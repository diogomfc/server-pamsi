import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';
import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';
import { Form13LocaisEventoController } from '@/controllers/formulario/Form13LocaisEventoController';

const form13LocaisEventoController = new Form13LocaisEventoController();

export const form13LocaisEventoRoutes = Router();

// POST - /form13-locais-evento/:numero_processo/:relatorio_id
form13LocaisEventoRoutes.post(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form13LocaisEventoController.create,
);

// GET - /form13-locais-evento/:numero_processo/:relatorio_id
form13LocaisEventoRoutes.get(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form13LocaisEventoController.show,
);

// DELETE - /form13-locais-evento/:numero_processo/:relatorio_id
form13LocaisEventoRoutes.delete(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form13LocaisEventoController.delete,
);

// PUT - /form13-locais-evento/:numero_processo/:relatorio_id
form13LocaisEventoRoutes.put(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form13LocaisEventoController.update,
);
