import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form2CaracteristicaSinistroController } from '@/controllers/formulario/Form2CaracteristicaSinistroController';

const form2CaracteristicaSinistroController = new Form2CaracteristicaSinistroController();

export const form2CaracteristicaSinistroRoutes = Router();

// POST - /form2-caracteristica-sinistro/:numero_processo/:relatorio_id
form2CaracteristicaSinistroRoutes.post(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form2CaracteristicaSinistroController.create
);

// GET - /form2-caracteristica-sinistro/:numero_processo/:relatorio_id
form2CaracteristicaSinistroRoutes.get(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form2CaracteristicaSinistroController.show
);

// PUT - /form2-caracteristica-sinistro/:numero_processo/:relatorio_id
form2CaracteristicaSinistroRoutes.put(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form2CaracteristicaSinistroController.update
);

// DELETE - /form2-caracteristica-sinistro/:numero_processo/:relatorio_id
form2CaracteristicaSinistroRoutes.delete(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form2CaracteristicaSinistroController.delete
);
