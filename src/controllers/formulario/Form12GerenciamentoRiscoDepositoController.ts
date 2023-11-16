import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import {
    form12GerenciamentoRiscoDepositoSchema,
    Form12GerenciamentoRiscoDepositoSchemaType,
} from '@/schemas/FormsSchemas/Form12GerenciamentoRiscoDepositoSchema';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';

export class Form12GerenciamentoRiscoDepositoController {
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form12GerenciamentoRiscoDepositoBody: Form12GerenciamentoRiscoDepositoSchemaType['create'] = form12GerenciamentoRiscoDepositoSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação Form12_Gerenciamento_Risco_Deposito no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form12GerenciamentoRiscoDeposito já existe no relatório
            const form12GerenciamentoRiscoDepositoExistente = await prisma.form12GerenciamentoRiscoDeposito.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form12GerenciamentoRiscoDepositoExistente) {
                throw new AppError('Form12_Gerenciamento_Risco_Deposito já existe neste relatório', 409);
            }

            // 3 - Buscar o ID do formulário vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Criar um novo registro de Form12GerenciamentoRiscoDeposito
            const novoForm12GerenciamentoRiscoDeposito = await prisma.form12GerenciamentoRiscoDeposito.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    ...form12GerenciamentoRiscoDepositoBody,
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando Form12GerenciamentoRiscoDeposito)
            if (!relatorioExistente.formularios_selecionados?.includes('form12_Gerenciamento_Risco_Deposito')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form12_Gerenciamento_Risco_Deposito',
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

            // 6 - Retornar o Form12GerenciamentoRiscoDeposito criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm12GerenciamentoRiscoDeposito.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm12GerenciamentoRiscoDeposito,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao criar Form12_Gerenciamento_Risco_Deposito no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de listagem Form12_Gerenciamento_Risco_Deposito. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form12GerenciamentoRiscoDeposito existe no relatório
            const form12GerenciamentoRiscoDepositoExistente = await prisma.form12GerenciamentoRiscoDeposito.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form12GerenciamentoRiscoDepositoExistente) {
                throw new AppError('Form12_Gerenciamento_Risco_Deposito não encontrado', 404);
            }

            logger.info({
                message: `Listagem Form12_Gerenciamento_Risco_Deposito realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 3 - Retornar o Form12GerenciamentoRiscoDeposito
            return res.status(200).json({
                message: 'Formulário localizado.',
                data_registro: FormatDate(form12GerenciamentoRiscoDepositoExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_localizado: form12GerenciamentoRiscoDepositoExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao localizar o Form12_Gerenciamento_Risco_Deposito. Usuario
                :${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form12GerenciamentoRiscoDepositoBody: Form12GerenciamentoRiscoDepositoSchemaType['update'] = form12GerenciamentoRiscoDepositoSchema.update.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de atualização form12_Gerenciamento_Risco_Deposito. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form12GerenciamentoRiscoDeposito existe no relatório
            const form12GerenciamentoRiscoDepositoExistente = await prisma.form12GerenciamentoRiscoDeposito.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form12GerenciamentoRiscoDepositoExistente) {
                throw new AppError('form12_Gerenciamento_Risco_Deposito não encontrado.', 404);
            }

            // 3 - Atualizar o registro de Form12GerenciamentoRiscoDeposito
            const form12GerenciamentoRiscoDepositoAtualizado = await prisma.form12GerenciamentoRiscoDeposito.update({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
                data: {
                    status: Status_Formulario.Formalizando,
                    ...form12GerenciamentoRiscoDepositoBody,
                },
            });

            logger.info({
                message: `Atualização form12_Gerenciamento_Risco_Deposito realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 4 - Retornar o Form12GerenciamentoRiscoDeposito atualizado
            return res.status(200).json({
                message: 'Atualização realizada com sucesso.',
                data_registro: FormatDate(form12GerenciamentoRiscoDepositoAtualizado.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_atualizado: form12GerenciamentoRiscoDepositoAtualizado,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao atualizar form12_Gerenciamento_Risco_Deposito. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de exclusão form12_Gerenciamento_Risco_Deposito. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form12GerenciamentoRiscoDeposito existe no relatório pelo número de processo
            const form12GerenciamentoRiscoDepositoExistente = await prisma.form12GerenciamentoRiscoDeposito.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form12GerenciamentoRiscoDepositoExistente) {
                throw new AppError('form12_Gerenciamento_Risco_Deposito não encontrado.', 404);
            }

            // 3 - Excluir o registro de Form12GerenciamentoRiscoDeposito
            await prisma.form12GerenciamentoRiscoDeposito.delete({
                where: {
                    numero_processo,
                },
            });

            // 4 - Atualizar o campo "formularios_selecionados" do relatório (removendo Form12GerenciamentoRiscoDeposito)
            if (relatorioExistente.formularios_selecionados?.includes('form12_Gerenciamento_Risco_Deposito')) {
                const updatedFormulariosSelecionados = relatorioExistente.formularios_selecionados.filter((formulario) => formulario !== 'form12_Gerenciamento_Risco_Deposito');

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
                message: `Exclusão form12_Gerenciamento_Risco_Deposito realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 5 - Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Etapa excluída do relatório',
                data_registro: FormatDate(form12GerenciamentoRiscoDepositoExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
                formulario_excluido: form12GerenciamentoRiscoDepositoExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao excluir form12_Gerenciamento_Risco_Deposito. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

}