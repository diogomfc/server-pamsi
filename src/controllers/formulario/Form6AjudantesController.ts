import { NextFunction, Request, Response } from 'express';

import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import {
    form6AjudantesSchema,
    Form6AjudantesSchemaType,
} from '@/schemas/FormsSchemas/Form6AjudantesSchema';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';

export class Form6AjudantesController {
    // POST - /form6-ajudantes/:numero_processo/:relatorio_id
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form6AjudantesBody: Form6AjudantesSchemaType['create'] = form6AjudantesSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação form6_Ajudantes no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form6_Ajudantes já existe no relatório
            const form6AjudantesExistente = await prisma.form6Ajudantes.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form6AjudantesExistente) {
                throw new AppError('form6_Ajudantes já existe neste relatório', 409);
            }

            // 3 - Buscar o ID do formulário vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Criar um novo registro de form6_Ajudantes
            const novoForm6Ajudantes = await prisma.form6Ajudantes.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    ...form6AjudantesBody
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando form6_Ajudantes)
            if (!relatorioExistente.formularios_selecionados?.includes('form6_Ajudantes')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form6_Ajudantes',
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

            // 6 - Retornar o form6-ajudantes criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm6Ajudantes.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm6Ajudantes,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao criar form6_Ajudantes no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    // GET - /form6-ajudantes/:numero_processo/:relatorio_id
    async show(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;

        try {
            logger.info({
                message: `Iniciando ação de listagem form6_Ajudantes. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form6_Ajudantes existe no relatório
            const form6AjudantesExistente = await prisma.form6Ajudantes.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form6AjudantesExistente) {
                throw new AppError('form6_Ajudantes não encontrado', 404);
            }

            logger.info({
                message: `Listagem form6_Ajudantes realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 3 - Retornar o form6_Ajudantes
            return res.status(200).json({
                message: 'Formulário localizado.',
                data_registro: FormatDate(form6AjudantesExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_localizado: form6AjudantesExistente,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao localizar o form6_Ajudantes. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    // PUT - /form6-ajudantes/:numero_processo/:relatorio_id
    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form6AjudantesBody: Form6AjudantesSchemaType['update'] = form6AjudantesSchema.update.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de atualização form6_Ajudantes. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form6_Ajudantes existe no relatório
            const form6AjudantesExistente = await prisma.form6Ajudantes.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form6AjudantesExistente) {
                throw new AppError('form6_Ajudantes não encontrado.', 404);
            }

            // 3 - Atualizar o registro de form6_Ajudantes
            if (form6AjudantesExistente) {
                const form6AjudantesAtualizado = await prisma.form6Ajudantes.update({
                    where: {
                        numero_processo: relatorioExistente.numero_processo,
                    },
                    data: {
                        status: Status_Formulario.Formalizando,
                        ...form6AjudantesBody
                    },
                });

                return res.status(200).json({
                    message: 'Atualização realizada com sucesso.',
                    data_registro: FormatDate(form6AjudantesAtualizado.data_cadastro),
                    relatorio_id: relatorio_id,
                    formulario_atualizado: form6AjudantesAtualizado,
                });
            }

            logger.info({
                message: `Atualização form6_Ajudantes realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao atualizar form6_Ajudantes. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    // DELETE - /form6-ajudantes/:numero_processo/:relatorio_id
    async delete(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;

        try {
            logger.info({
                message: `Iniciando ação de exclusão form6_Ajudantes. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form6_Ajudantes existe no relatório pelo número de processo
            const form6AjudantesExistente = await prisma.form6Ajudantes.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form6AjudantesExistente) {
                throw new AppError('form6_Ajudantes não encontrado.', 404);
            }

            // 3 - Excluir o registro de form6-ajudantes na tabela form6Ajudantes
            await prisma.form6Ajudantes.delete({
                where: {
                    numero_processo,
                },
            });

            // 4 - Atualizar o campo "formularios_selecionados" do relatório (removendo form6_Ajudantes)
            if (relatorioExistente.formularios_selecionados.includes('form6_Ajudantes')) {
                const updatedFormulariosSelecionados = relatorioExistente.formularios_selecionados.filter(
                    (formulario) => formulario !== 'form6_Ajudantes'
                );

                await prisma.relatorio.update({
                    where: {
                        id: relatorio_id,
                    },
                    data: {
                        formularios_selecionados: updatedFormulariosSelecionados,
                    },
                });
            }

            logger.info({
                message: `Exclusão form6_Ajudantes realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 5 - Retornar mensagem de sucesso

            return res.status(200).json({
                message: 'Etapa excluída do relatório',
                data_registro: FormatDate(form6AjudantesExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
                formulario_excluido: form6AjudantesExistente,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao excluir form6_Ajudantes. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });
            return next(error);
        }
    }
}

