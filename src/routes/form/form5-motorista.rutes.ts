import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form5MotoristaController } from '@/controllers/formulario/Form5MotoristaController';

const form5MotoristaController = new Form5MotoristaController();

export const form5MotoristaRoutes = Router();

// POST - /form5-motorista/:numero_processo/:relatorio_id
form5MotoristaRoutes.post(
    '/:numero_processo/:relatorio_id', 
    verificarAutenticacao,
    form5MotoristaController.create
);

// GET - /form5-motorista/:numero_processo/:relatorio_id
form5MotoristaRoutes.get(
    '/:numero_processo/:relatorio_id', 
    verificarAutenticacao,
    form5MotoristaController.show
);

// PUT - /form5-motorista/:numero_processo/:relatorio_id
form5MotoristaRoutes.put(
    '/:numero_processo/:relatorio_id', 
    verificarAutenticacao,
    form5MotoristaController.update
);

// DELETE - /form5-motorista/:numero_processo/:relatorio_id
form5MotoristaRoutes.delete(
    '/:numero_processo/:relatorio_id', 
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]), 
    form5MotoristaController.delete
);
