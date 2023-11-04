import { NextFunction, Request, Response } from 'express';

import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import {
    form5MotoristaSchema,
    Form5MotoristaSchemaType,
} from '@/schemas/FormsSchemas/Form5MotoristaSchema';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';

export class Form5MotoristaController {
    // POST - /form5-motorista/:numero_processo/:relatorio_id
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form5MotoristaBody: Form5MotoristaSchemaType['create'] = form5MotoristaSchema.create.parse(req.body);
        try {
            logger.info({
                message: `Iniciando ação de criação form5_Motorista no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form5_Motorista já existe no relatório
            const form5MotoristaExistente = await prisma.form5Motorista.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });
            if (form5MotoristaExistente) {
                throw new AppError('form5_Motorista já existe neste relatório', 409);
            }

            // 3 - Buscar o ID do formulário vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Criar um novo registro de form5_Motorista
            const novoForm5Motorista = await prisma.form5Motorista.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    ...form5MotoristaBody
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando form5_Motorista)
            if (!relatorioExistente.formularios_selecionados?.includes('form5_Motorista')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form5_Motorista',
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

            // 6 - Retornar o form5-motorista criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm5Motorista.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm5Motorista,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao criar form5_Motorista no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    // GET - /form5-motorista/:numero_processo/:relatorio_id
    async show(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;

        try {
            logger.info({
                message: `Iniciando ação de listagem form5_Motorista. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form5_Motorista existe no relatório
            const form5MotoristaExistente = await prisma.form5Motorista.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form5MotoristaExistente) {
                throw new AppError('form5_Motorista não encontrado', 404);
            }

            logger.info({
                message: `Listagem form5_Motorista realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 3 - Retornar o form5_Motorista
            return res.status(200).json({
                message: 'Formulário localizado.',
                data_registro: FormatDate(form5MotoristaExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_localizado: form5MotoristaExistente,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao localizar o form5_Motorista. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    // PUT - /form5-motorista/:numero_processo/:relatorio_id
    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form5MotoristaBody: Form5MotoristaSchemaType['update'] = form5MotoristaSchema.update.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de atualização form5_Motorista. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form5_Motorista existe no relatório
            const form5MotoristaExistente = await prisma.form5Motorista.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form5MotoristaExistente) {
                throw new AppError('form5_Motorista não encontrado.', 404);
            }

            // 3 - Atualizar o registro de form5_Motorista
            if (form5MotoristaExistente) {
                const form5MotoristaAtualizado = await prisma.form5Motorista.update({
                    where: {
                        numero_processo: relatorioExistente.numero_processo,
                    },
                    data: {
                        status: Status_Formulario.Formalizando,
                        ...form5MotoristaBody
                    },
                });

                return res.status(200).json({
                    message: 'Atualização realizada com sucesso.',
                    data_registro: FormatDate(form5MotoristaAtualizado.data_cadastro),
                    relatorio_id: relatorio_id,
                    formulario_atualizado: form5MotoristaAtualizado,
                });
            }

            logger.info({
                message: `Atualização form5_Motorista realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao atualizar form5_Motorista. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    // DELETE - /form5-motorista/:numero_processo/:relatorio_id
    async delete(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;

        try {
            logger.info({
                message: `Iniciando ação de exclusão form5_Motorista. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form5_Motorista existe no relatório pelo número de processo
            const form5MotoristaExistente = await prisma.form5Motorista.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form5MotoristaExistente) {
                throw new AppError('form5_Motorista não encontrado.', 404);
            }

            // 3 - Excluir o registro de form5-motorista na tabela form5Motorista
            await prisma.form5Motorista.delete({
                where: {
                    numero_processo,
                },
            });

            // 4 - Atualizar o campo "formularios_selecionados" do relatório (removendo form5_Motorista)
            if (relatorioExistente.formularios_selecionados.includes('form5_Motorista')) {
                const updatedFormulariosSelecionados = relatorioExistente.formularios_selecionados.filter(
                    (formulario) => formulario !== 'form5_Motorista'
                );

                await prisma.relatorio.update({
                    where: {
                        id: relatorio_id,
                        numero_processo,
                    },
                    data: {
                        formularios_selecionados: updatedFormulariosSelecionados,
                    },
                });
            }

            logger.info({
                message: `Exclusão form5_Motorista realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 5 - Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Etapa excluída do relatório',
                data_registro: FormatDate(form5MotoristaExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
                formulario_excluido: form5MotoristaExistente,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao excluir form5_Motorista. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
}
