import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';
import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form11DeclaracaoMotoristaAjudanteController } from '@/controllers/formulario/Form11DeclaracaoMotoristaAjudanteController';

const form11DeclaracaoMotoristaAjudanteController = new Form11DeclaracaoMotoristaAjudanteController();

export const form11DeclaracaoMotoristaAjudanteRoutes = Router();

// POST - /form11-declaracao-motorista-ajudante/:numero_processo/:relatorio_id
form11DeclaracaoMotoristaAjudanteRoutes.post(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form11DeclaracaoMotoristaAjudanteController.create,
);


// GET - /form11-declaracao-motorista-ajudante/:numero_processo/:relatorio_id
form11DeclaracaoMotoristaAjudanteRoutes.get(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form11DeclaracaoMotoristaAjudanteController.show,
);

// DELETE - /form11-declaracao-motorista-ajudante/:numero_processo/:relatorio_id
form11DeclaracaoMotoristaAjudanteRoutes.delete(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form11DeclaracaoMotoristaAjudanteController.delete,
);

// PUT - /form11-declaracao-motorista-ajudante/:numero_processo/:relatorio_id
form11DeclaracaoMotoristaAjudanteRoutes.put(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form11DeclaracaoMotoristaAjudanteController.update,
);


