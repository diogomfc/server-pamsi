import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import {
    form9GerenciamentoRiscoSchema,
    Form9GerenciamentoRiscoSchemaType,
} from '@/schemas/FormsSchemas/Form9GerenciamentoRiscoSchema';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';

export class Form9GerenciamentoRiscoController {
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form9GerenciamentoRiscoBody: Form9GerenciamentoRiscoSchemaType['create'] = form9GerenciamentoRiscoSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação form9_Gerenciamento_Risco no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form9GerenciamentoRisco já existe no relatório
            const form9GerenciamentoRiscoExistente = await prisma.form9GerenciamentoRiscoVeiculo.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form9GerenciamentoRiscoExistente) {
                throw new AppError('form9_Gerenciamento_Risco já existe neste relatório', 409);
            }

            // 3 - Buscar o ID do formulário vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Criar um novo registro de Form9GerenciamentoRisco
            const novoForm9GerenciamentoRisco = await prisma.form9GerenciamentoRiscoVeiculo.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    ...form9GerenciamentoRiscoBody,
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando Form9GerenciamentoRisco)
            if (!relatorioExistente.formularios_selecionados?.includes('form9_Gerenciamento_Risco_Veiculo')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form9_Gerenciamento_Risco_Veiculo',
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

            // 6 - Retornar o Form9GerenciamentoRisco criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm9GerenciamentoRisco.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm9GerenciamentoRisco,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao criar form9_Gerenciamento_Risco no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de listagem form9_Gerenciamento_Risco. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form9GerenciamentoRisco existe no relatório
            const form9GerenciamentoRiscoExistente = await prisma.form9GerenciamentoRiscoVeiculo.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form9GerenciamentoRiscoExistente) {
                throw new AppError('form9_Gerenciamento_Risco não encontrado', 404);
            }

            logger.info({
                message: `Listagem form9_Gerenciamento_Risco realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 3 - Retornar o Form9GerenciamentoRisco
            return res.status(200).json({
                message: 'Formulário localizado.',
                data_registro: FormatDate(form9GerenciamentoRiscoExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_localizado: form9GerenciamentoRiscoExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao localizar o form9_Gerenciamento_Risco. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form9GerenciamentoRiscoBody: Form9GerenciamentoRiscoSchemaType['update'] = form9GerenciamentoRiscoSchema.update.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de atualização form9_Gerenciamento_Risco. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form9GerenciamentoRisco existe no relatório
            const form9GerenciamentoRiscoExistente = await prisma.form9GerenciamentoRiscoVeiculo.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form9GerenciamentoRiscoExistente) {
                throw new AppError('form9_Gerenciamento_Risco não encontrado.', 404);
            }

            // 3 - Atualizar o registro de Form9GerenciamentoRisco
            if (form9GerenciamentoRiscoExistente) {
                const form9GerenciamentoRiscoAtualizado = await prisma.form9GerenciamentoRiscoVeiculo.update({
                    where: {
                        numero_processo: relatorioExistente.numero_processo,
                    },
                    data: {
                        status: Status_Formulario.Formalizando,
                        ...form9GerenciamentoRiscoBody
                    },
                });

                return res.status(200).json({
                    message: 'Atualização realizada com sucesso.',
                    data_registro: FormatDate(form9GerenciamentoRiscoAtualizado.data_cadastro),
                    relatorio_id: relatorio_id,
                    formulario_atualizado: form9GerenciamentoRiscoAtualizado,
                });
            }

            logger.info({
                message: `Atualização form9_Gerenciamento_Risco realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao atualizar form9_Gerenciamento_Risco. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de exclusão form9_Gerenciamento_Risco. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form9GerenciamentoRisco existe no relatório pelo número de processo
            const form9GerenciamentoRiscoExistente = await prisma.form9GerenciamentoRiscoVeiculo.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form9GerenciamentoRiscoExistente) {
                throw new AppError('form9_Gerenciamento_Risco não encontrado.', 404);
            }

            // 3 - Excluir o registro de Form9GerenciamentoRisco na tabela Form9GerenciamentoRisco
            await prisma.form9GerenciamentoRiscoVeiculo.delete({
                where: {
                    numero_processo,
                },
            });

            // 4 - Atualizar o campo "formularios_selecionados" do relatório (removendo Form9GerenciamentoRisco)
            if (relatorioExistente.formularios_selecionados?.includes('form9_Gerenciamento_Risco_Veiculo')) {
                const updatedFormulariosSelecionados = relatorioExistente.formularios_selecionados.filter((formulario) => formulario !== 'form9_Gerenciamento_Risco_Veiculo');

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
                message: `Exclusão form9_Gerenciamento_Risco realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 5 - Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Etapa excluída do relatório',
                data_registro: FormatDate(form9GerenciamentoRiscoExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
                formulario_excluido: form9GerenciamentoRiscoExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao excluir form9_Gerenciamento_Risco. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
}
