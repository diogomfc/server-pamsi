import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form2CaracteristicaSinistroController } from '@/controllers/formulario/Form2CaracteristicaSinistroController';

const form2CaracteristicaSinistroController = new Form2CaracteristicaSinistroController();

export const form2CaracteristicaSinistroRoutes = Router();

// POST - /form2-caracteristica-sinistro/:numero_processo
form2CaracteristicaSinistroRoutes.post(
    '/:numero_processo',
    verificarAutenticacao,
    form2CaracteristicaSinistroController.create
);

// GET - /form2-caracteristica-sinistro/:numero_processo
form2CaracteristicaSinistroRoutes.get(
    '/:numero_processo',
    verificarAutenticacao,
    form2CaracteristicaSinistroController.show
);

// PUT - /form2-caracteristica-sinistro/:numero_processo
form2CaracteristicaSinistroRoutes.put(
    '/:numero_processo',
    verificarAutenticacao,
    form2CaracteristicaSinistroController.update
);

// DELETE - /form2-caracteristica-sinistro/:numero_processo
form2CaracteristicaSinistroRoutes.delete(
    '/:numero_processo',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form2CaracteristicaSinistroController.delete
);
