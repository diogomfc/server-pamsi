import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form8OrgaoPolicialController } from '@/controllers/formulario/Form8OrgaoPolicialController';

const form8OrgaoPolicialController = new Form8OrgaoPolicialController();

export const form8OrgaoPolicialRoutes = Router();

// POST - /form8-orgao-policial/:numero_processo/:relatorio_id
form8OrgaoPolicialRoutes.post(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form8OrgaoPolicialController.create
);

// GET - /form8-orgao-policial/:numero_processo/:relatorio_id
form8OrgaoPolicialRoutes.get(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form8OrgaoPolicialController.show
);

// PUT - /form8-orgao-policial/:numero_processo/:relatorio_id
form8OrgaoPolicialRoutes.put(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form8OrgaoPolicialController.update
);

// DELETE - /form8-orgao-policial/:numero_processo/:relatorio_id
form8OrgaoPolicialRoutes.delete(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form8OrgaoPolicialController.delete
);
