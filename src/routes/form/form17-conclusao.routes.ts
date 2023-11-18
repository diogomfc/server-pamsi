import { Router } from 'express';
import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';
import { FuncaoUsuario as funcao } from '@prisma/client';
import { Form17ConclusaoController } from '@/controllers/formulario/Form17ConclusaoController';

const form17ConclusaoController = new Form17ConclusaoController();

export const form17ConclusaoRoutes = Router();

// POST - /form17-conclusao/:numero_processo/:relatorio_id
form17ConclusaoRoutes.post(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form17ConclusaoController.create
);

// GET - /form17-conclusao/:numero_processo/:relatorio_id
form17ConclusaoRoutes.get(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form17ConclusaoController.show
);

// PUT - /form17-conclusao/:numero_processo/:relatorio_id
form17ConclusaoRoutes.put(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form17ConclusaoController.update
);

// DELETE - /form17-conclusao/:numero_processo/:relatorio_id
form17ConclusaoRoutes.delete(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form17ConclusaoController.delete
);
