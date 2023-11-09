import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form10SistemasProtecaoCarregamentoController } from '@/controllers/formulario/Form10SistemasProtecaoCarregamentoController';

const form10SistemasProtecaoCarregamentoController = new Form10SistemasProtecaoCarregamentoController();

export const form10SistemasProtecaoCarregamentoRoutes = Router();

// POST - /form10-sistemas-protecao-carregamento/:numero_processo/:relatorio_id
form10SistemasProtecaoCarregamentoRoutes.post(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form10SistemasProtecaoCarregamentoController.create
);

// GET - /form10-sistemas-protecao-carregamento/:numero_processo/:relatorio_id
form10SistemasProtecaoCarregamentoRoutes.get(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form10SistemasProtecaoCarregamentoController.show
);

// PUT - /form10-sistemas-protecao-carregamento/:numero_processo/:relatorio_id
form10SistemasProtecaoCarregamentoRoutes.put(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form10SistemasProtecaoCarregamentoController.update
);

// DELETE - /form10-sistemas-protecao-carregamento/:numero_processo/:relatorio_id
form10SistemasProtecaoCarregamentoRoutes.delete(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form10SistemasProtecaoCarregamentoController.delete
);
