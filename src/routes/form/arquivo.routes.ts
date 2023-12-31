import { Router } from 'express';

import { ArquivoController } from '@/controllers/formulario/ArquivoController';

import { S3StorageService } from '@/services/s3StorageService';

import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { validarUploadArquivo } from '@/middlewares/ValidarUploadArquivo';

const arquivoController = new ArquivoController();

export const arquivoRoutes = Router();

const upload = S3StorageService;

//POST - /upload/arquivos/:numero_processo/:relatorio_id/:form_id
arquivoRoutes.post(
    '/:numero_processo/:relatorio_id/:form_id/:form_arquivo_campo_nome', 
    verificarAutenticacao,
    validarUploadArquivo,
    upload.single(
        'arquivo',
        // (req) => `arquivos/processo:${req.relatorio.numero_processo}/${req.relatorio.form.form_nome}/${req.relatorio.form.form_arquivo_campo_nome}`
        (req) => `arquivos/processo:${req.relatorio.numero_processo}/${req.relatorio.form.form_nome}/${req.params.form_arquivo_campo_nome}`
    ),
    arquivoController.create
);

// arquivoRoutes.post(
//     '/:numero_processo/:relatorio_id/:form_id/:form_arquivo_campo_nome', 
//     verificarAutenticacao,
//     validarUploadArquivo,
//     upload.single1(
//         (req) => `${req.relatorio.form.form_arquivo_campo_nome}`,
//         (req) => `arquivos/processo:${req.relatorio.numero_processo}/${req.relatorio.form.form_nome}/${req.params.form_arquivo_campo_nome}`
//     ),
//     arquivoController.create
// );

//DELETE - /upload/arquivos/:numero_processo/:form_id/:arquivo_id
arquivoRoutes.delete(
    '/:numero_processo/:form_id/:arquivo_id', 
    verificarAutenticacao, 
    arquivoController.delete
);
