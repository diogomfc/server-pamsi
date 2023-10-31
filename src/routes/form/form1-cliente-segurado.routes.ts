import { Router } from 'express';
//import { FuncaoUsuario as funcao } from '@prisma/client';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
//import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form1ClienteSeguradoController } from '@/controllers/formulario/Form1ClienteSeguradoController';

const form1ClienteSeguradoController = new Form1ClienteSeguradoController();

export const form1ClienteSeguradoRoutes = Router();


//POST - /form1-cliente-segurado/:numero_processo
form1ClienteSeguradoRoutes.post(
    '/:numero_processo', 
    verificarAutenticacao,
    form1ClienteSeguradoController.create
);

//PUT - /form1-cliente-segurado/:numero_processo
form1ClienteSeguradoRoutes.put(
    '/:numero_processo', 
    verificarAutenticacao,
    form1ClienteSeguradoController.update
);

//DELETE - /form1-cliente-segurado/:numero_processo
form1ClienteSeguradoRoutes.delete(
    '/:numero_processo', 
    verificarAutenticacao,
    form1ClienteSeguradoController.delete
);

//POST - rr/form1-cliente-segurado/:numero_processo - Vincular a um relatório
form1ClienteSeguradoRoutes.post(
    '/rr/:numero_processo', 
    verificarAutenticacao,
    form1ClienteSeguradoController.createFormOnRelatorio
);
