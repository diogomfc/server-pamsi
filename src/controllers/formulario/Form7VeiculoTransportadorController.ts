import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import {
    form7VeiculoTransportadorSchema,
    Form7VeiculoTransportadorSchemaType,
} from '@/schemas/FormsSchemas/Form7VeiculoTransportadorSchema';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';

export class Form7VeiculoTransportadorController {
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form7VeiculoTransportadorBody: Form7VeiculoTransportadorSchemaType['create'] = form7VeiculoTransportadorSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação form7VeiculoTransportador no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form7VeiculoTransportador já existe no relatório
            const form7VeiculoTransportadorExistente = await prisma.form7VeiculoTransportador.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form7VeiculoTransportadorExistente) {
                throw new AppError('form7_Veiculo_Transportador já existe neste relatório', 409);
            }

            // 3 - Buscar o ID do formulário vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Criar um novo registro de form7VeiculoTransportador
            const novoForm7VeiculoTransportador = await prisma.form7VeiculoTransportador.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    ...form7VeiculoTransportadorBody,
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando form7VeiculoTransportador)
            if (!relatorioExistente.formularios_selecionados?.includes('form7_Veiculo_Transportador')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form7_Veiculo_Transportador',
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

            // 6 - Retornar o form7VeiculoTransportador criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm7VeiculoTransportador.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm7VeiculoTransportador,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao criar form7_Veiculo_Transportador no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de listagem form7VeiculoTransportador. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form7VeiculoTransportador existe no relatório
            const form7VeiculoTransportadorExistente = await prisma.form7VeiculoTransportador.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form7VeiculoTransportadorExistente) {
                throw new AppError('form7_Veiculo_Transportador não encontrado', 404);
            }

            logger.info({
                message: `Listagem form7_Veiculo_Transportador realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 3 - Retornar o form7VeiculoTransportador
            return res.status(200).json({
                message: 'Formulário localizado.',
                data_registro: FormatDate(form7VeiculoTransportadorExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_localizado: form7VeiculoTransportadorExistente,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao localizar o form7_Veiculo_Transportador. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form7VeiculoTransportadorBody: Form7VeiculoTransportadorSchemaType['update'] = form7VeiculoTransportadorSchema.update.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de atualização form7_Veiculo_Transportador. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form7VeiculoTransportador existe no relatório
            const form7VeiculoTransportadorExistente = await prisma.form7VeiculoTransportador.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form7VeiculoTransportadorExistente) {
                throw new AppError('form7_Veiculo_Transportador não encontrado.', 404);
            }

            // 3 - Atualizar o registro de form7VeiculoTransportador
            if (form7VeiculoTransportadorExistente) {
                const form7VeiculoTransportadorAtualizado = await prisma.form7VeiculoTransportador.update({
                    where: {
                        numero_processo: relatorioExistente.numero_processo,
                    },
                    data: {
                        status: Status_Formulario.Formalizando,
                        ...form7VeiculoTransportadorBody
                    },
                });

                return res.status(200).json({
                    message: 'Atualização realizada com sucesso.',
                    data_registro: FormatDate(form7VeiculoTransportadorAtualizado.data_cadastro),
                    relatorio_id: relatorio_id,
                    formulario_atualizado: form7VeiculoTransportadorAtualizado,
                });
            }

            logger.info({
                message: `Atualização form7_Veiculo_Transportador realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao atualizar form7_Veiculo_Transportador. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de exclusão form7_Veiculo_Transportador. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form7VeiculoTransportador existe no relatório pelo número de processo
            const form7VeiculoTransportadorExistente = await prisma.form7VeiculoTransportador.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form7VeiculoTransportadorExistente) {
                throw new AppError('form7_Veiculo_Transportador não encontrado.', 404);
            }

            // 3 - Excluir o registro de form7VeiculoTransportador na tabela form7VeiculoTransportador
            await prisma.form7VeiculoTransportador.delete({
                where: {
                    numero_processo,
                },
            });

            // 4 - Atualizar o campo "formularios_selecionados" do relatório (removendo form7VeiculoTransportador)
            if (relatorioExistente.formularios_selecionados.includes('form7_Veiculo_Transportador')) {
                const updatedFormulariosSelecionados = relatorioExistente.formularios_selecionados.filter(
                    (formulario) => formulario !== 'form7_Veiculo_Transportador'
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
                message: `Exclusão form7VeiculoTransportador realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 5 - Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Etapa excluída do relatório',
                data_registro: FormatDate(form7VeiculoTransportadorExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
                formulario_excluido: form7VeiculoTransportadorExistente,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao excluir form7_Veiculo_Transportador. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
}

           
