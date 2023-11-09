import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import {
    form10SistemasProtecaoCarregamentoSchema,
    Form10SistemasProtecaoCarregamentoSchemaType,
} from '@/schemas/FormsSchemas/Form10SistemasProtecaoCarregamentoSchema';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';

export class Form10SistemasProtecaoCarregamentoController {
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form10SistemasProtecaoCarregamentoBody: Form10SistemasProtecaoCarregamentoSchemaType['create'] = form10SistemasProtecaoCarregamentoSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação form10_Sistemas_Protecao_Carregamento no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form10SistemasProtecaoCarregamento já existe no relatório
            const form10SistemasProtecaoCarregamentoExistente = await prisma.form10SistemasProtecaoCarregamento.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form10SistemasProtecaoCarregamentoExistente) {
                throw new AppError('form10_Sistemas_Protecao_Carregamento já existe neste relatório', 409);
            }

            // 3 - Buscar o ID do formulário vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Criar um novo registro de Form10SistemasProtecaoCarregamento
            const novoForm10SistemasProtecaoCarregamento = await prisma.form10SistemasProtecaoCarregamento.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    ...form10SistemasProtecaoCarregamentoBody,
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando Form10SistemasProtecaoCarregamento)
            if (!relatorioExistente.formularios_selecionados?.includes('form10_Sistemas_Protecao_Carregamento')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form10_Sistemas_Protecao_Carregamento',
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

            // 6 - Retornar o Form10SistemasProtecaoCarregamento criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm10SistemasProtecaoCarregamento.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm10SistemasProtecaoCarregamento,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao criar Form10_Sistemas_Protecao_Carregamento no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de listagem Form10_Sistemas_Protecao_Carregamento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1 - Verificar se o relatório existe pelo relatório_id e número de processo
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {
                    id: relatorio_id,
                    numero_processo,
                },
            });

            if (!relatorioExistente) {
                throw new AppError('Relatório não encontrado.', 404);
            }

            // 2 - Verificar se o Form10SistemasProtecaoCarregamento existe no relatório
            const form10SistemasProtecaoCarregamentoExistente = await prisma.form10SistemasProtecaoCarregamento.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form10SistemasProtecaoCarregamentoExistente) {
                throw new AppError('Form10_Sistemas_Protecao_Carregamento não encontrado', 404);
            }

            logger.info({
                message: `Listagem Form10_Sistemas_Protecao_Carregamento realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 3 - Retornar o Form10SistemasProtecaoCarregamento
            return res.status(200).json({
                message: 'Formulário localizado.',
                data_registro: FormatDate(form10SistemasProtecaoCarregamentoExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_localizado: form10SistemasProtecaoCarregamentoExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao localizar o Form10_Sistemas_Protecao_Carregamento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form10SistemasProtecaoCarregamentoBody: Form10SistemasProtecaoCarregamentoSchemaType['update'] = form10SistemasProtecaoCarregamentoSchema.update.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de atualização Form10_Sistemas_Protecao_Carregamento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1 - Verificar se o relatório existe pelo relatório_id e número de processo
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {
                    id: relatorio_id,
                    numero_processo,
                },
            });

            if (!relatorioExistente) {
                throw new AppError('Relatório não encontrado', 404);
            }

            // 2 - Verificar se o Form10SistemasProtecaoCarregamento existe no relatório
            const form10SistemasProtecaoCarregamentoExistente = await prisma.form10SistemasProtecaoCarregamento.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form10SistemasProtecaoCarregamentoExistente) {
                throw new AppError('Form10_Sistemas_Protecao_Carregamento não encontrado.', 404);
            }

            // 3 - Atualizar o registro de Form10SistemasProtecaoCarregamento
            if (form10SistemasProtecaoCarregamentoExistente) {
                const form10SistemasProtecaoCarregamentoAtualizado = await prisma.form10SistemasProtecaoCarregamento.update({
                    where: {
                        numero_processo: relatorioExistente.numero_processo,
                    },
                    data: {
                        status: Status_Formulario.Formalizando,
                        ...form10SistemasProtecaoCarregamentoBody
                    },
                });

                return res.status(200).json({
                    message: 'Atualização realizada com sucesso.',
                    data_registro: FormatDate(form10SistemasProtecaoCarregamentoAtualizado.data_cadastro),
                    relatorio_id: relatorio_id,
                    formulario_atualizado: form10SistemasProtecaoCarregamentoAtualizado,
                });
            }

            logger.info({
                message: `Atualização Form10_Sistemas_Protecao_Carregamento realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao atualizar Form10_Sistemas_Protecao_Carregamento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de exclusão Form10_Sistemas_Protecao_Carregamento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form10SistemasProtecaoCarregamento existe no relatório pelo número de processo
            const form10SistemasProtecaoCarregamentoExistente = await prisma.form10SistemasProtecaoCarregamento.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form10SistemasProtecaoCarregamentoExistente) {
                throw new AppError('Form10_Sistemas_Protecao_Carregamento não encontrado.', 404);
            }

            // 3 - Excluir o registro de Form10SistemasProtecaoCarregamento na tabela Form10SistemasProtecaoCarregamento
            await prisma.form10SistemasProtecaoCarregamento.delete({
                where: {
                    numero_processo,
                },
            });

            // 4 - Atualizar o campo "formularios_selecionados" do relatório (removendo Form10SistemasProtecaoCarregamento)
            if (relatorioExistente.formularios_selecionados?.includes('form10_Sistemas_Protecao_Carregamento')) {
                const updatedFormulariosSelecionados = relatorioExistente.formularios_selecionados.filter((formulario) => formulario !== 'form10_Sistemas_Protecao_Carregamento');

                await prisma.relatorio.update({
                    where: {
                        numero_processo,
                    },
                    data: {
                        formularios_selecionados: updatedFormulariosSelecionados,
                    },
                });
            }

            logger.info({
                message: `Exclusão Form10_Sistemas_Protecao_Carregamento realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 5 - Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Etapa excluída do relatório',
                data_registro: FormatDate(form10SistemasProtecaoCarregamentoExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
                formulario_excluido: form10SistemasProtecaoCarregamentoExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao excluir Form10_Sistemas_Protecao_Carregamento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

}
