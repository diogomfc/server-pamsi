import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form6AjudantesController } from '@/controllers/formulario/Form6AjudantesController';

const form6AjudantesController = new Form6AjudantesController();

export const form6AjudantesRoutes = Router();

// POST - /form6-ajudantes/:numero_processo/:relatorio_id
form6AjudantesRoutes.post(
    '/:numero_processo/:relatorio_id', 
    verificarAutenticacao,
    form6AjudantesController.create
);

// GET - /form6-ajudantes/:numero_processo/:relatorio_id
form6AjudantesRoutes.get(
    '/:numero_processo/:relatorio_id', 
    verificarAutenticacao,
    form6AjudantesController.show
);

// PUT - /form6-ajudantes/:numero_processo/:relatorio_id
form6AjudantesRoutes.put(
    '/:numero_processo/:relatorio_id', 
    verificarAutenticacao,
    form6AjudantesController.update
);

// DELETE - /form6-ajudantes/:numero_processo/:relatorio_id
form6AjudantesRoutes.delete(
    '/:numero_processo/:relatorio_id', 
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]), 
    form6AjudantesController.delete
);
