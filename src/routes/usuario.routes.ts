import { Router } from 'express';
import multer from 'multer';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { UsuarioController } from '@/controllers/UsuarioController';
import { UsuarioAvatarController } from '@/controllers/UsuarioAvatarController';

import { FuncaoUsuario as funcao } from '@prisma/client';
import { STORAGE_LOCAL } from '@/configs/localStorage';

export const usuarioRouter = Router();

const usuarioController = new UsuarioController();
const usuarioAvatarController = new UsuarioAvatarController();
const uploadAvatar = multer({ storage: STORAGE_LOCAL.uploadFile});


//Rota para criar um novo usuário - OK
usuarioRouter.post(
    '/', 
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]), 
    uploadAvatar.single('avatar'),
    usuarioController.create, 
);

// Rota para carregar o perfil do usuário - OK
usuarioRouter.get(
    '/perfil',
    verificarAutenticacao,  
    usuarioController.perfil
);

//Rota par listar um usuário pelo ID ou todos - OK - OK
usuarioRouter.get(
    '/:id?', 
    verificarAutenticacao, 
    usuarioController.index
);

// Rota para alterar a senha do usuário -OK
usuarioRouter.put(
    '/alterar-senha',
    verificarAutenticacao,  
    usuarioController.alterarSenha
);

// Rota para alterar o avatar do usuário - OK
usuarioRouter.patch(
    '/avatar',
    verificarAutenticacao,
    uploadAvatar.single('avatar'),
    usuarioAvatarController.create
);

// Rota para deletar um avatar do usuário - OK
usuarioRouter.delete(
    '/avatar',
    verificarAutenticacao,
    usuarioAvatarController.delete
);

// Rota para editar o perfil do usuário 
usuarioRouter.put(
    '/editar-perfil',
    verificarAutenticacao,
    usuarioController.editarPerfil
);