import { Router } from 'express';
import { usuarioRouter } from './usuario.routes';


export const routes = Router();



// Rota de inicialização para teste
routes.get('/', async (request, response) => {
    return response.json({ message: 'Api iniciada com sucesso' });
});

// Rota de usuário
routes.use('/usuarios', usuarioRouter);
