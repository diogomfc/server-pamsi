import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';
import { Form3CronologiaSinistroController } from '@/controllers/formulario/Form3CronologiaSinistroController';

const form3CronologiaSinistroController = new Form3CronologiaSinistroController();

export const form3CronologiaSinistroRoutes = Router();

// POST - /form3-cronologia-sinistro/:numero_processo/:relatorio_id
form3CronologiaSinistroRoutes.post(
    '/:numero_processo/:relatorio_id', 
    verificarAutenticacao,
    form3CronologiaSinistroController.create
);

// GET - /form3-cronologia-sinistro/:numero_processo/:relatorio_id
form3CronologiaSinistroRoutes.get(
    '/:numero_processo/:relatorio_id', 
    verificarAutenticacao,
    form3CronologiaSinistroController.show
);

// PUT - /form3-cronologia-sinistro/:numero_processo/:relatorio_id
form3CronologiaSinistroRoutes.put(
    '/:numero_processo/:relatorio_id', 
    verificarAutenticacao,
    form3CronologiaSinistroController.update
);

// DELETE - /form3-cronologia-sinistro/:numero_processo/:relatorio_id
form3CronologiaSinistroRoutes.delete(
    '/:numero_processo/:relatorio_id', 
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form3CronologiaSinistroController.delete);