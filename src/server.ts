import 'express-async-errors';

import express, { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { env } from './env';
import { AppError } from './utils/AppError';
import { routes } from './routes';

const app = express();

//Habilitar o express para receber dados em formato json
app.use(express.json());

//Habilitar o CORS
app.use(cors());

// ROTAS DA APLICAÇÃO
app.use(routes);

//Tratamento de erros: Verificar se erro vem do lado do CLIENTE ou pelo SERVIDOR
app.use((err: ErrorRequestHandler, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error(err);
    next();
    return response.status(500).json({
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
