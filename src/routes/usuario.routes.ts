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

//POST - /usuarios/ - Rota para criar um usuário
usuarioRouter.post(
    '/', 
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]), 
    uploadAvatar.single('avatar'),
    usuarioController.create, 
);

//GET - /usuarios/perfil - Rota para carregar o perfil do usuário
usuarioRouter.get(
    '/perfil',
    verificarAutenticacao,  
    usuarioController.perfil
);

//GET - /usuarios/:id? - Rota par listar um usuário pelo ID ou todos
usuarioRouter.get(
    '/:id?', 
    verificarAutenticacao, 
    usuarioController.index
);

//PUT- /usuarios/alterar-senha - Rota para alterar a senha do usuário autenticado
usuarioRouter.put(
    '/alterar-senha',
    verificarAutenticacao,  
    usuarioController.alterarSenha
);

//PUT- /usuarios/editar-perfil -  Rota para editar o perfil do usuário autenticado
usuarioRouter.put(
    '/editar-perfil',
    verificarAutenticacao,
    usuarioController.editarPerfil
);

//PATCH - /usuarios/avatar -  Rota para alterar o avatar do usuário autenticado
usuarioRouter.patch(
    '/avatar',
    verificarAutenticacao,
    uploadAvatar.single('avatar'),
    usuarioAvatarController.create
);

//DELETE - /usuarios/avatar - Rota para deletar um avatar do usuário autenticado
usuarioRouter.delete(
    '/avatar',
    verificarAutenticacao,
    usuarioAvatarController.delete
);

