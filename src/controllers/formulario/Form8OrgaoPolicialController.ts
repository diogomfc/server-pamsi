import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import {
    form8OrgaoPolicialSchema,
    Form8OrgaoPolicialSchemaType,
} from '@/schemas/FormsSchemas/Form8OrgaoPolicialSchema';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';

export class Form8OrgaoPolicialController {
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form8OrgaoPolicialBody: Form8OrgaoPolicialSchemaType['create'] = form8OrgaoPolicialSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação form8_Orgao_Policial no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form8OrgaoPolicial já existe no relatório
            const form8OrgaoPolicialExistente = await prisma.form8OrgaoPolicial.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form8OrgaoPolicialExistente) {
                throw new AppError('form8_Orgao_Policial já existe neste relatório', 409);
            }

            // 3 - Buscar o ID do formulário vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Criar um novo registro de Form8OrgaoPolicial
            const novoForm8OrgaoPolicial = await prisma.form8OrgaoPolicial.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    ...form8OrgaoPolicialBody,
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando Form8OrgaoPolicial)
            if (!relatorioExistente.formularios_selecionados?.includes('form8_Orgao_Policial')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form8_Orgao_Policial',
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

            // 6 - Retornar o Form8OrgaoPolicial criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm8OrgaoPolicial.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm8OrgaoPolicial,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao criar form8_Orgao_Policial no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de listagem form8_Orgao_Policial. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form8OrgaoPolicial existe no relatório
            const form8OrgaoPolicialExistente = await prisma.form8OrgaoPolicial.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form8OrgaoPolicialExistente) {
                throw new AppError('form8_Orgao_Policial não encontrado', 404);
            }

            logger.info({
                message: `Listagem form8_Orgao_Policial realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 3 - Retornar o Form8OrgaoPolicial
            return res.status(200).json({
                message: 'Formulário localizado.',
                data_registro: FormatDate(form8OrgaoPolicialExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_localizado: form8OrgaoPolicialExistente,
            });
            
        } catch (error) {
            logger.error({
                message: `Erro ao localizar o form8_Orgao_Policial. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form8OrgaoPolicialBody: Form8OrgaoPolicialSchemaType['update'] = form8OrgaoPolicialSchema.update.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de atualização form8_Orgao_Policial. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form8OrgaoPolicial existe no relatório
            const form8OrgaoPolicialExistente = await prisma.form8OrgaoPolicial.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form8OrgaoPolicialExistente) {
                throw new AppError('form8_Orgao_Policial não encontrado.', 404);
            }

            // 3 - Atualizar o registro de Form8OrgaoPolicial
            if (form8OrgaoPolicialExistente) {
                const form8OrgaoPolicialAtualizado = await prisma.form8OrgaoPolicial.update({
                    where: {
                        numero_processo: relatorioExistente.numero_processo,
                    },
                    data: {
                        status: Status_Formulario.Formalizando,
                        ...form8OrgaoPolicialBody
                    },
                });

                return res.status(200).json({
                    message: 'Atualização realizada com sucesso.',
                    data_registro: FormatDate(form8OrgaoPolicialAtualizado.data_cadastro),
                    relatorio_id: relatorio_id,
                    formulario_atualizado: form8OrgaoPolicialAtualizado,
                });
            }

            logger.info({
                message: `Atualização form8_Orgao_Policial realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao atualizar form8_Orgao_Policial. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de exclusão form8_Orgao_Policial. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form8OrgaoPolicial existe no relatório pelo número de processo
            const form8OrgaoPolicialExistente = await prisma.form8OrgaoPolicial.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form8OrgaoPolicialExistente) {
                throw new AppError('form8_Orgao_Policial não encontrado.', 404);
            }

            // 3 - Excluir o registro de Form8OrgaoPolicial na tabela Form8OrgaoPolicial
            await prisma.form8OrgaoPolicial.delete({
                where: {
                    numero_processo,
                },
            });

            // 4 - Atualizar o campo "formularios_selecionados" do relatório (removendo Form 8 orgao policial)

            if (relatorioExistente.formularios_selecionados?.includes('form8_Orgao_Policial')) {
                const updatedFormulariosSelecionados = relatorioExistente.formularios_selecionados.filter((formulario) => formulario !== 'form8_Orgao_Policial');

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
                message: `Exclusão form8_Orgao_Policial realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 5 - Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Etapa excluída do relatório',
                data_registro: FormatDate(form8OrgaoPolicialExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
                formulario_excluido: form8OrgaoPolicialExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao excluir form8_Orgao_Policial. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
}