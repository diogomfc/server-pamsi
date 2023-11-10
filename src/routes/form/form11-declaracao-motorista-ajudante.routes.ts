import { Router } from 'express';
import { FuncaoUsuario as funcao } from '@prisma/client';
import { verificarAutenticacao } from '@/middlewares/VerificarAutenticacao';
import { permicaoParaAcesso } from '@/middlewares/PermicaoParaAcesso';

import { Form11DeclaracaoMotoristaAjudanteController } from '@/controllers/formulario/Form11DeclaracaoMotoristaAjudanteController';
//import { verificarArquivo } from '@/middlewares/VerificarArquivos';
import { S3StorageService } from '@/services/s3StorageService';
import { verificarArquivo } from '@/middlewares/VerificarArquivosForm11DeclaracaoMotoristaAjudante';

const form11DeclaracaoMotoristaAjudanteController = new Form11DeclaracaoMotoristaAjudanteController();

export const form11DeclaracaoMotoristaAjudanteRoutes = Router();

// POST - /form11-declaracao-motorista-ajudante/:numero_processo/:relatorio_id
form11DeclaracaoMotoristaAjudanteRoutes.post(
    '/:numero_processo/:relatorio_id?',
    verificarAutenticacao,
    verificarArquivo.novoUpload,
    S3StorageService.uploadFieldsToS3([
        { name: 'file_declaracao_motorista', maxCount: 1 },
        { name: 'file_declaracao_ajudante', maxCount: 1 },
    ], (req) => 
        `files-declaracao-motorista-ajudante/processo:${req.params.numero_processo}`
    ),
    form11DeclaracaoMotoristaAjudanteController.create,
);

// PUT - /form11-declaracao-motorista-ajudante/:numero_processo/:relatorio_id
form11DeclaracaoMotoristaAjudanteRoutes.put(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    verificarArquivo.updateUpload,
    S3StorageService.uploadFieldsToS3([
        { name: 'file_declaracao_motorista', maxCount: 1 },
        { name: 'file_declaracao_ajudante', maxCount: 1 },
    ], (req) => 
        `files_declaracao_motorista_ajudante/processo_${req.params.numero_processo}`
    ),
    
    form11DeclaracaoMotoristaAjudanteController.update
);

// GET - /form11-declaracao-motorista-ajudante/:numero_processo/:relatorio_id
form11DeclaracaoMotoristaAjudanteRoutes.get(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    form11DeclaracaoMotoristaAjudanteController.show,
);

// DELETE - /form11-declaracao-motorista-ajudante/:numero_processo/:relatorio_id
form11DeclaracaoMotoristaAjudanteRoutes.delete(
    '/:numero_processo/:relatorio_id',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form11DeclaracaoMotoristaAjudanteController.delete,
);

form11DeclaracaoMotoristaAjudanteRoutes.delete(
    '/file/:key',
    verificarAutenticacao,
    permicaoParaAcesso([funcao.Supervisor, funcao.Admin]),
    form11DeclaracaoMotoristaAjudanteController.deleteFile,
);
