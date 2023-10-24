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
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]), 
    usuarioController.create, 
    usuarioAvatarController.create
);

// Rota para carregar o perfil do usuário
usuarioRouter.get(
    '/perfil',
    verificarAutenticacao,  
    usuarioController.perfil
);

//Rota par listar um usuário pelo ID ou todos
usuarioRouter.get(
    '/:id?', 
    verificarAutenticacao, 
    usuarioController.index
);

//Rota para atualizar o perfil do usuario pelo ID
usuarioRouter.put(
    '/:id', 
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    usuarioController.update
);

//Rota para para atualizar o perfil
usuarioRouter.put(
    '/perfil', 
    verificarAutenticacao,
    usuarioController.updateTeste
);


