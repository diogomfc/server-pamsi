import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';
import { S3StorageService } from '@/services/s3StorageService';

export class Form11DeclaracaoMotoristaAjudanteController {
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;

        const files = req.files as {[key: string]: Express.MulterS3.File[]};

        const declaracaoMotorista = files.file_declaracao_motorista ? files.file_declaracao_motorista[0] : null;
        const declaracaoAjudante = files.file_declaracao_ajudante ? files.file_declaracao_ajudante[0] : null;

        try {
            logger.info({
                message: `Iniciando ação de criação de arquivos form11_Declaracao_Motorista_Ajudante no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

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

            // 2 - Verificar se o form11_Declaracao_Motorista_Ajudante já existe no relatório
            const form11DeclaracaoMotoristaAjudanteExistente = await prisma.form11DeclaracaoMotoristaAjudante.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                }
            });

            if (form11DeclaracaoMotoristaAjudanteExistente) {
                throw new AppError('form11_Declaracao_Motorista_Ajudante já existe neste relatório', 409);
            }

            // 3 - Buscar o ID do formulário vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Caso não exita, criar um novo registro de formulário form11_Declaracao_Motorista_Ajudante vinculado ao relatório
            const novoForm11DeclaracaoMotoristaAjudante = await prisma.form11DeclaracaoMotoristaAjudante.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    file_declaracao_ajudante: decodeURIComponent(String(declaracaoAjudante?.location)),
                    file_declaracao_motorista:  decodeURIComponent(String(declaracaoMotorista?.location)),
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando form11DeclaracaoMotoristaAjudante)  

            if (!relatorioExistente.formularios_selecionados?.includes(
                'form11_Declaracao_Motorista_Ajudante'
            )) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form11_Declaracao_Motorista_Ajudante',
                ] as Tipo_Formulario[];
                
                await prisma.relatorio.update({
                    where: {
                        numero_processo: relatorioExistente.numero_processo,
                    },
                    data: {
                        formularios_selecionados: updatedFormulariosSelecionados,
                    },
                });
            }

            // 6 - Retornar o form11_Declaracao_Motorista_Ajudante criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm11DeclaracaoMotoristaAjudante.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm11DeclaracaoMotoristaAjudante,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao atualizar form11_Declaracao_Motorista_Ajudante no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
  
    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;

        const files = req.files as {[key: string]: Express.MulterS3.File[]};

        const declaracaoMotorista = files.file_declaracao_motorista ? files.file_declaracao_motorista[0] : null;
        const declaracaoAjudante = files.file_declaracao_ajudante ? files.file_declaracao_ajudante[0] : null;
      
        try {

            logger.info({
                message: `Iniciando ação de upload de arquivos form11_Declaracao_Motorista_Ajudante no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1 - Validar os arquivos enviados
            if (!declaracaoMotorista && !declaracaoAjudante) {
                throw new AppError('Pelo menos um arquivo é necessário para o upload', 400);
            }

            // 2 - Verificar se o relatório existe
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {
                    id: relatorio_id,
                    numero_processo,
                },
            });

            if (!relatorioExistente) {
                throw new AppError('Relatório não encontrado.', 404);
            }

            // 3 - Verificar se o form11_Declaracao_Motorista_Ajudante já existe no relatório
            const form11DeclaracaoMotoristaAjudanteExistente = await prisma.form11DeclaracaoMotoristaAjudante.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });


            if(!form11DeclaracaoMotoristaAjudanteExistente){
                throw new AppError('form11_Declaracao_Motorista_Ajudante não encontrado neste relatório', 404);
            }

          
            // 5 - caso exista, efetuar o upload dos arquivos e atualizar o registro
            if(form11DeclaracaoMotoristaAjudanteExistente){
                const form11DeclaracaoMotoristaAjudanteAtualizado = await prisma.form11DeclaracaoMotoristaAjudante.update({
                    where: {
                        numero_processo: relatorioExistente.numero_processo,
                    },
                    data: {
                        status: Status_Formulario.Formalizando,
                        file_declaracao_ajudante: declaracaoAjudante?.location,
                        file_declaracao_motorista:  declaracaoMotorista?.location

                        // file_declaracao_ajudante: form11DeclaracaoMotoristaAjudanteExistente.file_declaracao_ajudante === '' ? String(declaracaoAjudante?.location): form11DeclaracaoMotoristaAjudanteExistente.file_declaracao_ajudante,
                        // file_declaracao_motorista: form11DeclaracaoMotoristaAjudanteExistente.file_declaracao_motorista === '' ? String(declaracaoMotorista?.location): form11DeclaracaoMotoristaAjudanteExistente.file_declaracao_motorista,

                        // file_declaracao_ajudante:  (declaracaoAjudante && declaracaoAjudante.filename !== '') ? declaracaoAjudante.filename : form11DeclaracaoMotoristaAjudanteExistente.file_declaracao_ajudante,
                        // file_declaracao_motorista:  (declaracaoMotorista && declaracaoMotorista.filename !== '') ? declaracaoMotorista.filename : form11DeclaracaoMotoristaAjudanteExistente.file_declaracao_motorista 
                    },
                });

                return res.status(200).json({
                    message: 'Atualização realizada com sucesso.',
                    data_registro: FormatDate(form11DeclaracaoMotoristaAjudanteAtualizado.data_cadastro),
                    relatorio_id: relatorio_id,
                    formulario_registrado: form11DeclaracaoMotoristaAjudanteAtualizado,
                });
            }
            
            logger.info({
                message: `Atualização de arquivos form11_Declaracao_Motorista_Ajudante no relatório realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao atualizar  form11_Declaracao_Motorista_Ajudante no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    async show(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
      
        try {
            logger.info({
                message: `Iniciando ação de listagem form11_Declaracao_Motorista_Ajudante no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
          
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
          
            // 2 - Verificar se o form11_Declaracao_Motorista_Ajudante já existe no relatório
            const form11DeclaracaoMotoristaAjudanteExistente = await prisma.form11DeclaracaoMotoristaAjudante.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if(!form11DeclaracaoMotoristaAjudanteExistente){
                throw new AppError('form11_Declaracao_Motorista_Ajudante não encontrado neste relatório', 404);
            }

            logger.info({
                message: `Listagem de arquivos form11_Declaracao_Motorista_Ajudante no relatório realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            return res.status(200).json({
                message: 'Formulário localizado',
                data_registro: FormatDate(form11DeclaracaoMotoristaAjudanteExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: form11DeclaracaoMotoristaAjudanteExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao listar form11_Declaracao_Motorista_Ajudante no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
      
        try {
            logger.info({
                message: `Iniciando ação de exclusão form11_Declaracao_Motorista_Ajudante no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
          
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
          
            // 2 - Verificar se o form11_Declaracao_Motorista_Ajudante já existe no relatório
            const form11DeclaracaoMotoristaAjudanteExistente = await prisma.form11DeclaracaoMotoristaAjudante.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if(!form11DeclaracaoMotoristaAjudanteExistente){
                throw new AppError('form11_Declaracao_Motorista_Ajudante não encontrado neste relatório', 404);
            }

            // 3 - Obter o registro dos files files.file_declaracao_motorista e files.file_declaracao_ajudante
            const fileDeclaracaoMotorista = form11DeclaracaoMotoristaAjudanteExistente.file_declaracao_motorista;
            const fileDeclaracaoAjudante = form11DeclaracaoMotoristaAjudanteExistente.file_declaracao_ajudante;

            if(!fileDeclaracaoMotorista && !fileDeclaracaoAjudante){
                throw new AppError('Arquivos não encontrados', 404);
            }

            // 4 - Obter as keys dos arquivos registros
            const keyDeclaracaoMotorista = fileDeclaracaoMotorista?.split('/').slice(3).join('/');
            const keyDeclaracaoAjudante = fileDeclaracaoAjudante?.split('/').slice(3).join('/');

            // 5 - Excluir os arquivos do S3
            if(keyDeclaracaoMotorista){
                await S3StorageService.deleteFileFromS3(keyDeclaracaoMotorista);
                
                logger.info({
                    message: `Arquivo ${keyDeclaracaoMotorista} excluído com sucesso do Amazon S3.`,
                    method: req.method,
                    url: req.originalUrl,
                });
            }

            if(keyDeclaracaoAjudante){
                await S3StorageService.deleteFileFromS3(keyDeclaracaoAjudante);
                logger.info({
                    message: `Arquivo ${keyDeclaracaoAjudante} excluído com sucesso do Amazon S3.`,
                    method: req.method,
                    url: req.originalUrl,
                });
            }
          
            // 6 -  Excluir o registro de form11_Declaracao_Motorista_Ajudante
            await prisma.form11DeclaracaoMotoristaAjudante.delete({
                where: {
                    numero_processo
                },
            });

            //7 - Atualizar o campo "formularios_selecionados" do relatório (removendo form11DeclaracaoMotoristaAjudante)
            if (relatorioExistente.formularios_selecionados?.includes('form11_Declaracao_Motorista_Ajudante')) {
                const formulariosSelecionados = relatorioExistente.formularios_selecionados?.filter((formulario) => formulario !== 'form11_Declaracao_Motorista_Ajudante');
                
                await prisma.relatorio.update({
                    where: {
                        numero_processo,
                    },
                    data: {
                        formularios_selecionados: formulariosSelecionados,
                    },
                });
            }

            logger.info({
                message: `Exclusão de arquivos form11_Declaracao_Motorista_Ajudante no relatório realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 8 - Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Etapa excluída do relatório',
                data_registro: FormatDate(form11DeclaracaoMotoristaAjudanteExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
                formulario_excluido: form11DeclaracaoMotoristaAjudanteExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao excluir form11_Declaracao_Motorista_Ajudante no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    async deleteFile(req: Request, res: Response, next: NextFunction) {
        try {
            const { key } = req.params;

            // Deletar o arquivo do S3
            await S3StorageService.deleteFileFromS3(key);

            res.status(200).json({ message: 'Arquivo deletado com sucesso.' });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}


