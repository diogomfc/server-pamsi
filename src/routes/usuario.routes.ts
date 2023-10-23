import { Router } from 'express';
import multer from 'multer';

import { UsuarioController } from '@/controllers/UsuarioController';
import { STORAGE_LOCAL } from '@/configs/localStorage';
import { UsuarioAvatarController } from '@/controllers/UsuarioAvatarController';

import { verificarAutenticacao } from '@/middlewares/verificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';
import { FuncaoUsuario as funcao } from '@prisma/client';




export const usuarioRouter = Router();

const usuarioController = new UsuarioController();
const uploadAvatar = multer({ storage: STORAGE_LOCAL.uploadFile});
const usuarioAvatarController = new UsuarioAvatarController();



//Rota para criar um novo usuário
usuarioRouter.post(
    '/', 
    verificarAutenticacao,
    uploadAvatar.single('avatar'), 
    usuarioController.create, 
    usuarioAvatarController.create
);

usuarioRouter.get('/perfil',verificarAutenticacao, permicaoParaAcesso([funcao.Analista]),  usuarioController.show);

