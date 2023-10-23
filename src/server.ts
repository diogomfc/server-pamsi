import 'express-async-errors';

import express from 'express';

import { env } from './env';
import { AppError } from './utils/AppError';


const app = express();


app.use(express.json());

app.listen({
    port: env.PORT,
}, () => {
    console.log(`🚀 Server is running on ${env.PORT}`);
});
