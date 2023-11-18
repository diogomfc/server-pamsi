import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import {
    form15RecuperacaoCargaSchema,
    Form15RecuperacaoCargaSchema
} from '@/schemas/FormsSchemas/Form15RecuperacaoCargaSchema';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';

export class Form15RecuperacaoCargaController {
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form15RecuperacaoCargaBody: Form15RecuperacaoCargaSchema['create'] = form15RecuperacaoCargaSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação de formulário Form15RecuperacaoCarga no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form15RecuperacaoCarga já existe no relatório
            const form15RecuperacaoCargaExistente = await prisma.form15RecuperacaoCarga.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form15RecuperacaoCargaExistente) {
                throw new AppError('Form15RecuperacaoCarga já existe neste relatório', 409);
            }

            // 3 - Buscar o ID do formulário vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Caso não exista, criar um novo registro de formulário Form15RecuperacaoCarga vinculado ao relatório
            const novoForm15RecuperacaoCarga = await prisma.form15RecuperacaoCarga.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    ...form15RecuperacaoCargaBody,
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando Form15RecuperacaoCarga)
            if (!relatorioExistente.formularios_selecionados?.includes('form15_Recuperacao_Carga')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form15_Recuperacao_Carga',
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

            // 6 - Retornar o Form15RecuperacaoCarga criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm15RecuperacaoCarga.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm15RecuperacaoCarga,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao criar Form15RecuperacaoCarga no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de listagem de formulário Form15RecuperacaoCarga no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form15RecuperacaoCarga já existe no relatório
            const form15RecuperacaoCargaExistente = await prisma.form15RecuperacaoCarga.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
                // Adicione qualquer relação necessária para mostrar os dados relacionados
            });

            if (!form15RecuperacaoCargaExistente) {
                throw new AppError('Form15RecuperacaoCarga não encontrado neste relatório', 404);
            }

            logger.info({
                message: `Listagem de formulário Form15RecuperacaoCarga no relatório realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 3 - Retornar o Form15RecuperacaoCarga encontrado
            return res.status(200).json({
                message: 'Formulário localizado',
                data_registro: FormatDate(form15RecuperacaoCargaExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: form15RecuperacaoCargaExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao listar Form15RecuperacaoCarga no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form15RecuperacaoCargaBody: Form15RecuperacaoCargaSchema['update'] = form15RecuperacaoCargaSchema.update.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de atualização de formulário Form15RecuperacaoCarga no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form15RecuperacaoCarga já existe no relatório
            const form15RecuperacaoCargaExistente = await prisma.form15RecuperacaoCarga.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form15RecuperacaoCargaExistente) {
                throw new AppError('Form15RecuperacaoCarga não encontrado neste relatório', 404);
            }

            // 3 - Atualizar o registro do Form15RecuperacaoCarga
            const form15RecuperacaoCargaAtualizado = await prisma.form15RecuperacaoCarga.update({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
                data: {
                    ...form15RecuperacaoCargaBody,
                },
            });

            // 4 - Retornar a resposta
            return res.status(200).json({
                message: 'Atualização realizada com sucesso.',
                data_registro: FormatDate(form15RecuperacaoCargaAtualizado.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: form15RecuperacaoCargaAtualizado,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao atualizar Form15RecuperacaoCarga no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de exclusão de formulário Form15RecuperacaoCarga no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form15RecuperacaoCarga já existe no relatório
            const form15RecuperacaoCargaExistente = await prisma.form15RecuperacaoCarga.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form15RecuperacaoCargaExistente) {
                throw new AppError('Form15RecuperacaoCarga não encontrado neste relatório', 404);
            }

            // 3 - Excluir o registro de Form15RecuperacaoCarga
            await prisma.form15RecuperacaoCarga.delete({
                where: {
                    numero_processo,
                },
            });
 
            // 4 - Atualizar o campo "formularios_selecionados" do relatório (removendo Form15RecuperacaoCarga)
            if (relatorioExistente.formularios_selecionados?.includes('form15_Recuperacao_Carga')) {
                const formulariosSelecionados = relatorioExistente.formularios_selecionados?.filter((formulario) => formulario !== 'form15_Recuperacao_Carga');

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
                message: `Exclusão de formulário Form15RecuperacaoCarga no relatório realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 5 - Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Formulário excluído do relatório',
                data_registro: FormatDate(form15RecuperacaoCargaExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao excluir Form15RecuperacaoCarga no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
}
