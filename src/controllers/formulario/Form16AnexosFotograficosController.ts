import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';
import { 
    form16AnexosFotograficosSchema,
    Form16AnexosFotograficosSchemaType 
} from '@/schemas/FormsSchemas/Form16AnexosFotograficosSchema';

import { S3StorageService } from '@/services/s3StorageService';

export class Form16AnexosFotograficosController {
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;

        try {
            logger.info({
                message: `Iniciando ação de criação de arquivos form16_Anexos_Fotograficos no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form16_Anexos_Fotograficos já existe no relatório
            const form16AnexosFotograficosExistente = await prisma.form16AnexosFotograficos.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                }
            });

            if (form16AnexosFotograficosExistente) {
                throw new AppError('form16_Anexos_Fotograficos já existe neste relatório', 409);
            }

            // 3 - Buscar o ID do formulário vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Caso não exista, criar um novo registro de formulário form16_Anexos_Fotograficos vinculado ao relatório
            const novoForm16AnexosFotograficos = await prisma.form16AnexosFotograficos.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando form16AnexosFotograficos)  
            if (!relatorioExistente.formularios_selecionados?.includes(
                'form16_Anexos_Fotograficos'
            )) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form16_Anexos_Fotograficos',
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

            // 6 - Retornar o form16_Anexos_Fotograficos criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm16AnexosFotograficos.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm16AnexosFotograficos,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao criar form16_Anexos_Fotograficos no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form16AnexosFotograficosBody: Form16AnexosFotograficosSchemaType['update'] = form16AnexosFotograficosSchema.update.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de upload de arquivos form16_Anexos_Fotograficos no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form16_Anexos_Fotograficos já existe no relatório
            const form16AnexosFotograficosExistente = await prisma.form16AnexosFotograficos.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form16AnexosFotograficosExistente) {
                throw new AppError('form16_Anexos_Fotograficos não encontrado neste relatório', 404);
            }

            // 3 - Efetuar o upload dos arquivos e atualizar o registro
            const form16AnexosFotograficosAtualizado = await prisma.form16AnexosFotograficos.update({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
                data: {
                    ...form16AnexosFotograficosBody,
                },
            });

            logger.info({
                message: `Atualização de arquivos form16_Anexos_Fotograficos no relatório realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 4 - Retornar o form16_Anexos_Fotograficos atualizado
            return res.status(200).json({
                message: 'Atualização realizada com sucesso.',
                data_registro: FormatDate(form16AnexosFotograficosAtualizado.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: form16AnexosFotograficosAtualizado,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao atualizar form16_Anexos_Fotograficos no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de listagem form16_Anexos_Fotograficos no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form16_Anexos_Fotograficos já existe no relatório
            const form16AnexosFotograficosExistente = await prisma.form16AnexosFotograficos.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
                include: {
                    anexos_fotograficos: {
                        where: {
                            form_nome: relatorioExistente.formularios_selecionados.find((form) => form === 'form16_Anexos_Fotograficos'),
                        },
                        select: {
                            id: true,
                            arquivo_nome: true,
                            arquivo_localizacao: true,
                        },
                    },
                },
            });

            if (!form16AnexosFotograficosExistente) {
                throw new AppError('form16_Anexos_Fotograficos não encontrado neste relatório', 404);
            }

            logger.info({
                message: `Listagem de arquivos form16_Anexos_Fotograficos no relatório realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 3 - Retornar o form16_Anexos_Fotograficos encontrado
            return res.status(200).json({
                message: 'Formulário localizado',
                data_registro: FormatDate(form16AnexosFotograficosExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: form16AnexosFotograficosExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao listar form16_Anexos_Fotograficos no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de exclusão form16_Anexos_Fotograficos no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1 - Verificar se o relatório existe
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {
                    numero_processo,
                    id: relatorio_id,
                },
            });

            if (!relatorioExistente) {
                throw new AppError('Relatório não encontrado.', 404);
            }

            // 2 - Verificar se o form16_Anexos_Fotograficos já existe no relatório
            const form16AnexosFotograficosExistente = await prisma.form16AnexosFotograficos.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form16AnexosFotograficosExistente) {
                throw new AppError('form16_Anexos_Fotograficos não encontrado neste relatório', 404);
            }

            // 3 - Localizar todos os arquivos vinculados
            const arquivoExistente = await prisma.arquivo.findMany({
                where: {
                    form_id: form16AnexosFotograficosExistente.id,
                },
            });

            // 4 - Excluir da S3 todos os arquivos cujas keys existem em arquivoExistente
            if (arquivoExistente) {
                arquivoExistente.forEach(async (arquivo) => {
                    await S3StorageService.delete(arquivo.arquivo_chave);
                });

                logger.info({
                    message: `Arquivos ${arquivoExistente} excluídos com sucesso do Amazon S3.`,
                    method: req.method,
                    url: req.originalUrl,
                });
            }

            // 5 - Excluir o registro de form16_Anexos_Fotograficos
            await prisma.form16AnexosFotograficos.delete({
                where: {
                    numero_processo,
                },
            });

            // 6 - Excluir qualquer arquivo vinculado ao formulário
            await prisma.arquivo.deleteMany({
                where: {
                    form_id: form16AnexosFotograficosExistente.id,
                },
            });

            // 7 - Atualizar o campo "formularios_selecionados" do relatório (removendo form16_Anexos_Fotograficos)
            if (relatorioExistente.formularios_selecionados?.includes('form16_Anexos_Fotograficos')) {
                const formulariosSelecionados = relatorioExistente.formularios_selecionados?.filter((formulario) => formulario !== 'form16_Anexos_Fotograficos');

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
                message: `Exclusão de arquivos form16_Anexos_Fotograficos no relatório realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 8 - Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Etapa excluída do relatório',
                data_registro: FormatDate(form16AnexosFotograficosExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao excluir form16_Anexos_Fotograficos no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

}
