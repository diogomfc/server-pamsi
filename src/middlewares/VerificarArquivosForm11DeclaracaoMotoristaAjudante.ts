import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import { prisma } from '@/database';
//import { logger } from '@/utils/Logger';
//import { S3StorageService } from '@/services/s3StorageService';

// Verificar se já existe arquivos anexados no Form11DeclaracaoMotoristaAjudante para novo upload
async function verificarArquivoNovoUpload (req: Request, res: Response, next: NextFunction) {
    const { numero_processo, relatorio_id } = req.params;

    // 1 - Verificar se o relatório existe
    const relatorioExistente = await prisma.relatorio.findFirst({
        where: {
            id: relatorio_id,
            numero_processo,
        },
    });

    if (!relatorioExistente) {
        throw new AppError('Relatório não encontrado.', 404);
    }

    const form11DeclaracaoMotoristaAjudanteExiste = await prisma.form11DeclaracaoMotoristaAjudante.findUnique({
        where: { 
            numero_processo: relatorioExistente.numero_processo
        },
        select:{
            numero_processo: true,
            file_declaracao_ajudante: true,
            file_declaracao_motorista: true,
        }
    });

    // verificar se file_declaracao_ajudante e file_declaracao_motorista já existe
    const file_declaracao_ajudanteExiste = form11DeclaracaoMotoristaAjudanteExiste?.file_declaracao_ajudante;
    const file_declaracao_motoristaExiste = form11DeclaracaoMotoristaAjudanteExiste?.file_declaracao_motorista;

    // 2 - Verificar se o arquivo já existe
    if (file_declaracao_ajudanteExiste && file_declaracao_motoristaExiste) {
        throw new AppError('Já existe(m) arquivo(s) anexado(s) para form11_Declaracao_Motorista_Ajudante. Por favor, exclua o(s) arquivo(s) existente(s) antes de fazer o upload de um novo.');
    }

    next();
}

// Verificar se já existe arquivos anexados no Form11DeclaracaoMotoristaAjudante para novo upload
async function verificarArquivoUpdateUpload (req: Request, res: Response, next: NextFunction) {
    const { numero_processo, relatorio_id } = req.params;

    // 1 - Verificar se o relatório existe
    const relatorioExistente = await prisma.relatorio.findFirst({
        where: {
            id: relatorio_id,
            numero_processo,
        },
    });

    if (!relatorioExistente) {
        throw new AppError('Relatório não encontrado.', 404);
    }

    const form11DeclaracaoMotoristaAjudanteExiste = await prisma.form11DeclaracaoMotoristaAjudante.findUnique({
        where: { 
            numero_processo: relatorioExistente.numero_processo
        },
        select:{
            numero_processo: true,
            file_declaracao_ajudante: true,
            file_declaracao_motorista: true,
        }
    });

    if (!form11DeclaracaoMotoristaAjudanteExiste) {
        throw new AppError('Form11_Declaracao_Motorista_Ajudante não encontrado neste relatório', 404);
    } 

    // verificar se file_declaracao_ajudante e file_declaracao_motorista já existe
    const file_declaracao_ajudanteExiste = form11DeclaracaoMotoristaAjudanteExiste?.file_declaracao_ajudante;
    const file_declaracao_motoristaExiste = form11DeclaracaoMotoristaAjudanteExiste?.file_declaracao_motorista;

    // 2 - Verificar se o arquivo já existe
    if (file_declaracao_ajudanteExiste && file_declaracao_motoristaExiste) {
        throw new AppError('Já existe(m) arquivo(s) anexado(s) para form11_Declaracao_Motorista_Ajudante. Por favor, exclua o(s) arquivo(s) existente(s) antes de fazer o upload de um novo.');
    }

    next();
}

async function verificarArquivoDeleteDownload (req: Request, res: Response, next: NextFunction) {
    const { numero_processo, relatorio_id } = req.params;

    // 1 - Verificar se o relatório existe
    const relatorioExistente = await prisma.relatorio.findFirst({
        where: {
            id: relatorio_id,
            numero_processo,
        },
    });

    if (!relatorioExistente) {
        throw new AppError('Relatório não encontrado.', 404);
    }

    const form11DeclaracaoMotoristaAjudanteExiste = await prisma.form11DeclaracaoMotoristaAjudante.findUnique({
        where: { 
            numero_processo: relatorioExistente.numero_processo
        },
        select:{
            numero_processo: true,
            file_declaracao_ajudante: true,
            file_declaracao_motorista: true,
        }
    });

    if (!form11DeclaracaoMotoristaAjudanteExiste) {
        throw new AppError('Form11_Declaracao_Motorista_Ajudante não encontrado neste relatório', 404);
    } 

    // verificar se file_declaracao_ajudante e file_declaracao_motorista já existe
    const file_declaracao_ajudanteExiste = form11DeclaracaoMotoristaAjudanteExiste?.file_declaracao_ajudante;
    const file_declaracao_motoristaExiste = form11DeclaracaoMotoristaAjudanteExiste?.file_declaracao_motorista;

    // 2 - Verificar se o arquivo já existe
    if (!file_declaracao_ajudanteExiste && !file_declaracao_motoristaExiste) {
        throw new AppError('Não existe(m) arquivo(s) anexado(s) para form11_Declaracao_Motorista_Ajudante.');
    }

    next();
}

export const verificarArquivo = {
    novoUpload: verificarArquivoNovoUpload,
    updateUpload: verificarArquivoUpdateUpload,
    deleteDownload: verificarArquivoDeleteDownload,
};

