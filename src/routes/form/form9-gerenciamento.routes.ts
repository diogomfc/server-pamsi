import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form9GerenciamentoRiscoController } from '@/controllers/formulario/Form9GerenciamentoRiscoController';

const form9GerenciamentoRiscoController = new Form9GerenciamentoRiscoController();

export const form9GerenciamentoRiscoRoutes = Router();

// POST - /form9-gerenciamento-risco/:numero_processo/:relatorio_id
form9GerenciamentoRiscoRoutes.post(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form9GerenciamentoRiscoController.create
);

// GET - /form9-gerenciamento-risco/:numero_processo/:relatorio_id
form9GerenciamentoRiscoRoutes.get(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form9GerenciamentoRiscoController.show
);

// PUT - /form9-gerenciamento-risco/:numero_processo/:relatorio_id
form9GerenciamentoRiscoRoutes.put(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form9GerenciamentoRiscoController.update
);

// DELETE - /form9-gerenciamento-risco/:numero_processo/:relatorio_id
form9GerenciamentoRiscoRoutes.delete(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form9GerenciamentoRiscoController.delete
);
