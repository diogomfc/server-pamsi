import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import { 
    form14ResumoAveriguacoesSchema, 
    Form14ResumoAveriguacoesSchema
} from '@/schemas/FormsSchemas/Form14ResumoAveriguacoesSchema';


import { Status_Formulario, Tipo_Formulario } from '@prisma/client';


export class Form14ResumoAveriguacoesController {
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form14ResumoAveriguacoesBody: Form14ResumoAveriguacoesSchema['create'] = form14ResumoAveriguacoesSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação de formulário Form14ResumoAveriguacoes no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form14ResumoAveriguacoes já existe no relatório
            const form14ResumoAveriguacoesExistente = await prisma.form14ResumoAveriguacoes.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form14ResumoAveriguacoesExistente) {
                throw new AppError('Form14ResumoAveriguacoes já existe neste relatório', 409);
            }

            // 3 - Buscar o ID do formulário vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Caso não exista, criar um novo registro de formulário Form14ResumoAveriguacoes vinculado ao relatório
            const novoForm14ResumoAveriguacoes = await prisma.form14ResumoAveriguacoes.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    ...form14ResumoAveriguacoesBody,
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando Form14ResumoAveriguacoes)
            if (!relatorioExistente.formularios_selecionados?.includes(
                'form14_Resumo_Averiguacoes'
            )) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form14_Resumo_Averiguacoes',
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

            // 6 - Retornar o Form14ResumoAveriguacoes criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm14ResumoAveriguacoes.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm14ResumoAveriguacoes,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao criar Form14ResumoAveriguacoes no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
    
    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form14ResumoAveriguacoesBody: Form14ResumoAveriguacoesSchema['update'] = form14ResumoAveriguacoesSchema.update.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de atualização de formulário Form14ResumoAveriguacoes no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form14ResumoAveriguacoes já existe no relatório
            const form14ResumoAveriguacoesExistente = await prisma.form14ResumoAveriguacoes.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form14ResumoAveriguacoesExistente) {
                throw new AppError('Form14ResumoAveriguacoes não encontrado neste relatório', 404);
            }

            // 3 - Atualizar o registro do Form14ResumoAveriguacoes
            const form14ResumoAveriguacoesAtualizado = await prisma.form14ResumoAveriguacoes.update({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
                data: {
                    ...form14ResumoAveriguacoesBody,
                },
            });

            // 4 - Retornar a resposta
            return res.status(200).json({
                message: 'Atualização realizada com sucesso.',
                data_registro: FormatDate(form14ResumoAveriguacoesAtualizado.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: form14ResumoAveriguacoesAtualizado,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao atualizar Form14ResumoAveriguacoes no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de listagem de formulário Form14ResumoAveriguacoes no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form14ResumoAveriguacoes já existe no relatório
            const form14ResumoAveriguacoesExistente = await prisma.form14ResumoAveriguacoes.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
                // Adicione qualquer relação necessária para mostrar os dados relacionados
            });

            if (!form14ResumoAveriguacoesExistente) {
                throw new AppError('Form14ResumoAveriguacoes não encontrado neste relatório', 404);
            }

            logger.info({
                message: `Listagem de formulário Form14ResumoAveriguacoes no relatório realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 3 - Retornar o Form14ResumoAveriguacoes encontrado
            return res.status(200).json({
                message: 'Formulário localizado',
                data_registro: FormatDate(form14ResumoAveriguacoesExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: form14ResumoAveriguacoesExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao listar Form14ResumoAveriguacoes no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de exclusão de formulário Form14ResumoAveriguacoes no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form14ResumoAveriguacoes já existe no relatório
            const form14ResumoAveriguacoesExistente = await prisma.form14ResumoAveriguacoes.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form14ResumoAveriguacoesExistente) {
                throw new AppError('Form14ResumoAveriguacoes não encontrado neste relatório', 404);
            }

            // 3 - Excluir o registro de Form14ResumoAveriguacoes
            await prisma.form14ResumoAveriguacoes.delete({
                where: {
                    numero_processo,
                },
            });
   
            // 4 - Atualizar o campo "formularios_selecionados" do relatório (removendo Form14ResumoAveriguacoes)
            if (relatorioExistente.formularios_selecionados?.includes('form14_Resumo_Averiguacoes')) {
                const formulariosSelecionados = relatorioExistente.formularios_selecionados?.filter((formulario) => formulario !== 'form14_Resumo_Averiguacoes');

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
                message: `Exclusão de formulário Form14ResumoAveriguacoes no relatório realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 5 - Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Formulário excluído do relatório',
                data_registro: FormatDate(form14ResumoAveriguacoesExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao excluir Form14ResumoAveriguacoes no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
}
