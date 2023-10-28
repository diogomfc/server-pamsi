import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';  

import { RelatorioController } from '@/controllers/RelatorioController';

export const relatorioRouter = Router();

const relatorioController = new RelatorioController();


//POST - /relatorio -- Responsável por criar relatórios
relatorioRouter.post(
    '/', 
    verificarAutenticacao,
    relatorioController.create, 
);

//GET - /relatorio/:numero_processo? -- Responsável por listar um relatório por numero_processo ou todos os relatórios
relatorioRouter.get(
    '/:numero_processo?', 
    verificarAutenticacao, 
    relatorioController.index
);

//DELETE - /relatorio/:id -- Responsável por deletar relatórios
relatorioRouter.delete(
    '/:id', 
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]), 
    relatorioController.delete
);

//PUT - /relatorio/:id -- Responsável por atualizar relatórios
relatorioRouter.put(
    '/:id', 
    verificarAutenticacao,
    relatorioController.update
);

