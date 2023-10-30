import 'express-async-errors';

import express, { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { env } from './env';
import { AppError } from './utils/AppError';
import { routes } from './routes';
import { z } from 'zod';

const app = express();

//Habilitar o express para receber dados em formato json
app.use(express.json());

//Habilitar o CORS
app.use(cors());

// ROTAS DA APLICAÇÃO
app.use(routes);

//Tratamento de erros: Verificar se erro vem do lado do CLIENTE ou pelo SERVIDOR
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'Error de aplicação',
            message: err.message,
        });
    } else if (err instanceof z.ZodError) {
        const validationError = err.issues.map((issue) => ({
            status: 'Erro de cadastro',
            input: issue.path.join('.'),
            message: issue.message,
        }));

        if (validationError.length === 1) {
            return res.status(400).send(validationError[0]);
        } else {
            return res.status(400).send(validationError);
        }

    }

    next();

    if (env.NODE_ENV !== 'production') {
        console.error(err);
    } else {
        // TODO: Deve utilizar um ferramenta de DataDog/NewRelic/Sentry
    }

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
