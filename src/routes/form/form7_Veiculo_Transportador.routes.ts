import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form7VeiculoTransportadorController } from '@/controllers/formulario/Form7VeiculoTransportadorController';

const form7VeiculoTransportadorController = new Form7VeiculoTransportadorController();

export const form7VeiculoTransportadorRoutes = Router();

// POST - /form7-veiculo-transportador/:numero_processo/:relatorio_id
form7VeiculoTransportadorRoutes.post(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form7VeiculoTransportadorController.create
);

// GET - /form7-veiculo-transportador/:numero_processo/:relatorio_id
form7VeiculoTransportadorRoutes.get(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form7VeiculoTransportadorController.show
);

// PUT - /form7-veiculo-transportador/:numero_processo/:relatorio_id
form7VeiculoTransportadorRoutes.put(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form7VeiculoTransportadorController.update
);

// DELETE - /form7-veiculo-transportador/:numero_processo/:relatorio_id
form7VeiculoTransportadorRoutes.delete(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form7VeiculoTransportadorController.delete
);
