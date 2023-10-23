import 'express-async-errors';

import express, { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

import { env } from './env';
import { AppError } from './utils/AppError';


const app = express();


app.use(express.json());

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

app.listen({
    port: env.PORT,
}, () => {
    console.log(`🚀 Server is running on ${env.PORT}`);
});
