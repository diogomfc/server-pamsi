import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form12GerenciamentoRiscoDepositoController } from '@/controllers/formulario/Form12GerenciamentoRiscoDepositoController';

const form12GerenciamentoRiscoDepositoController = new Form12GerenciamentoRiscoDepositoController();

export const form12GerenciamentoRiscoDepositoRoutes = Router();

// POST - /form12-gerenciamento-risco-deposito/:numero_processo/:relatorio_id
form12GerenciamentoRiscoDepositoRoutes.post(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form12GerenciamentoRiscoDepositoController.create
);

// GET - /form12-gerenciamento-risco-deposito/:numero_processo/:relatorio_id
form12GerenciamentoRiscoDepositoRoutes.get(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form12GerenciamentoRiscoDepositoController.show
);

// PUT - /form12-gerenciamento-risco-deposito/:numero_processo/:relatorio_id
form12GerenciamentoRiscoDepositoRoutes.put(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form12GerenciamentoRiscoDepositoController.update
);

// DELETE - /form12-gerenciamento-risco-deposito/:numero_processo/:relatorio_id
form12GerenciamentoRiscoDepositoRoutes.delete(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form12GerenciamentoRiscoDepositoController.delete
);
