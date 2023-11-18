import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';
import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form16AnexosFotograficosController } from '@/controllers/formulario/Form16AnexosFotograficosController';

const form16AnexosFotograficosController = new Form16AnexosFotograficosController();

export const form16AnexosFotograficosRoutes = Router();

// POST - /form16-anexos-fotograficos/:numero_processo/:relatorio_id
form16AnexosFotograficosRoutes.post(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form16AnexosFotograficosController.create,
);

// GET - /form16-anexos-fotograficos/:numero_processo/:relatorio_id
form16AnexosFotograficosRoutes.get(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form16AnexosFotograficosController.show,
);

// DELETE - /form16-anexos-fotograficos/:numero_processo/:relatorio_id
form16AnexosFotograficosRoutes.delete(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form16AnexosFotograficosController.delete,
);

// PUT - /form16-anexos-fotograficos/:numero_processo/:relatorio_id
form16AnexosFotograficosRoutes.put(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form16AnexosFotograficosController.update,
);
