import { Router } from 'express';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';
import { FuncaoUsuario as funcao } from '@prisma/client';

import { Form14ResumoAveriguacoesController } from '@/controllers/formulario/Form14ResumoAveriguacoesController';

const form14ResumoAveriguacoesController = new Form14ResumoAveriguacoesController();

export const form14ResumoAveriguacoesRoutes = Router();

// POST - /form14-resumo-averiguacoes/:numero_processo/:relatorio_id
form14ResumoAveriguacoesRoutes.post(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form14ResumoAveriguacoesController.create
);

// GET - /form14-resumo-averiguacoes/:numero_processo/:relatorio_id
form14ResumoAveriguacoesRoutes.get(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form14ResumoAveriguacoesController.show
);

// PUT - /form14-resumo-averiguacoes/:numero_processo/:relatorio_id
form14ResumoAveriguacoesRoutes.put(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form14ResumoAveriguacoesController.update
);

// DELETE - /form14-resumo-averiguacoes/:numero_processo/:relatorio_id
form14ResumoAveriguacoesRoutes.delete(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form14ResumoAveriguacoesController.delete
);
