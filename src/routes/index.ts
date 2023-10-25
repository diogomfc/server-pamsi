import { Router } from 'express';
import { usuarioRouter } from './usuario.routes';
import { loginRoutes } from './login.routes';
import { relatorioRouter } from './relatorio.routes';

export const routes = Router();

// Rota de inicialização para teste
routes.get('/', async (request, response) => {
    return response.json({ message: 'Api iniciada com sucesso' });
});

// Rota de usuário
routes.use('/usuarios', usuarioRouter);
routes.use('/login', loginRoutes);
routes.use('/relatorios', relatorioRouter);

