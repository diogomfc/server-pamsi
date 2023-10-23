import { Router } from 'express';
import multer from 'multer';

import { UsuarioController } from '@/controllers/UsuarioController';
import { STORAGE_LOCAL } from '@/configs/localStorage';
import { UsuarioAvatarController } from '@/controllers/UsuarioAvatarController';


export const usuarioRouter = Router();

const usuarioController = new UsuarioController();
const uploadAvatar = multer({ storage: STORAGE_LOCAL.uploadFile});
const usuarioAvatarController = new UsuarioAvatarController();


//Rota para criar um novo usuário
usuarioRouter.post(
    '/', 
    uploadAvatar.single('avatar'), 
    usuarioController.create, 
    usuarioAvatarController.create
);
