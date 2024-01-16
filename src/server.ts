import 'express-async-errors';

import express, { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { env } from './env';
import { AppError } from './utils/AppError';
import { STORAGE_LOCAL } from './configs/localStorage';
import { routes } from './routes';
import { z } from 'zod';

const app = express();

//Habilitar o express para receber dados em formato json
app.use(express.json());

//Habilitar o CORS
app.use(cors());

// ROTAS DA APLICAÇÃO
app.use(routes);

// rota estática para arquivos
app.use('/images/avatar', express.static(STORAGE_LOCAL.UPLOADS_FOLDER_AVATAR));

// Tratamento de erros: Verificar se erro vem do lado do CLIENTE ou pelo SERVIDOR
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'Error de aplicação',
            message: err.message,
        });
    } 

    if (err instanceof z.ZodError) {
        const validationErrors = err.issues.map((issue) => ({
            input: issue.path.join('.'),
            message: issue.message,
        }));

        return res.status(400).json({
            status: 'Erro de cadastro',
            errors: validationErrors,
        });
    }

    console.error(err);

    next();
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

// Rota para iniciar o servidor
app.listen({
    port: env.PORT,
}, () => {
    console.log(`🚀 Server is running on ${env.PORT}`);
});
