import { Router } from 'express';

import { LoginController } from '@/controllers/LoginController';
import { UsuarioRefreshToken } from '@/controllers/UsuarioRefreshToken';

const loginController = new LoginController();
const usuarioRefreshToken = new UsuarioRefreshToken();

export const loginRoutes = Router();

loginRoutes.post('/', loginController.create);
loginRoutes.post('/atualizar-token', usuarioRefreshToken.create);