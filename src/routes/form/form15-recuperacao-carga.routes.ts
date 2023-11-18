import { Router } from 'express';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';
import { FuncaoUsuario as funcao } from '@prisma/client';

import { Form15RecuperacaoCargaController } from '@/controllers/formulario/Form15RecuperacaoCargaController';

const form15RecuperacaoCargaController = new Form15RecuperacaoCargaController();

export const form15RecuperacaoCargaRoutes = Router();

// POST - /form15-recuperacao-carga/:numero_processo/:relatorio_id
form15RecuperacaoCargaRoutes.post(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form15RecuperacaoCargaController.create
);

// GET - /form15-recuperacao-carga/:numero_processo/:relatorio_id
form15RecuperacaoCargaRoutes.get(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form15RecuperacaoCargaController.show
);

// PUT - /form15-recuperacao-carga/:numero_processo/:relatorio_id
form15RecuperacaoCargaRoutes.put(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form15RecuperacaoCargaController.update
);

// DELETE - /form15-recuperacao-carga/:numero_processo/:relatorio_id
form15RecuperacaoCargaRoutes.delete(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form15RecuperacaoCargaController.delete
);
