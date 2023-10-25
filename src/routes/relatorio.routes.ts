import { Router } from 'express';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
//import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';  

import { RelatorioController } from '@/controllers/RelatorioController';

export const relatorioRouter = Router();

const relatorioController = new RelatorioController();


//Rota para criar um novo relatório
relatorioRouter.post(
    '/', 
    verificarAutenticacao,
    relatorioController.create, 
);

//Rota para listar um relatório todos os Relatorios
relatorioRouter.get(
    '/', 
    verificarAutenticacao, 
    relatorioController.index
);


