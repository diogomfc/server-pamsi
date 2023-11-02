import { Router } from 'express';
//import { FuncaoUsuario as funcao } from '@prisma/client';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
//import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form4DoCarregamentoController } from '@/controllers/formulario/Form4DoCarregamentoController';


const form4DoCarregamentoController = new Form4DoCarregamentoController();


export const form4DoCarregamentoRoutes = Router();


// POST - /form4-do-carregamento/:numero_processo/:relatorio_id
form4DoCarregamentoRoutes.post(
    '/:numero_processo/:relatorio_id', 
    verificarAutenticacao,
    form4DoCarregamentoController.create
);