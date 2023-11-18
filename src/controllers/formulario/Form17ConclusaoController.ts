import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import {
    form17ConclusaoSchema,
    Form17ConclusaoSchema,
} from '@/schemas/FormsSchemas/Form17ConclusaoSchema';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';

export class Form17ConclusaoController {
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form17ConclusaoBody: Form17ConclusaoSchema['create'] = form17ConclusaoSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação de formulário Form17Conclusao no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o Form17Conclusao já existe no relatório
            const form17ConclusaoExistente = await prisma.form17Conclusao.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form17ConclusaoExistente) {
                throw new AppError('Form17Conclusao já existe neste relatório', 409);
            }

            // 3 - Buscar o ID do formulário vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Caso não exista, criar um novo registro de formulário Form17Conclusao vinculado ao relatório
            const novoForm17Conclusao = await prisma.form17Conclusao.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    ...form17ConclusaoBody,
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando Form17Conclusao)
            if (!relatorioExistente.formularios_selecionados?.includes('form17_Conclusao')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form17_Conclusao',
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

            // 6 - Retornar o Form17Conclusao criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm17Conclusao.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm17Conclusao,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao criar Form17Conclusao no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form17ConclusaoBody: Form17ConclusaoSchema['update'] = form17ConclusaoSchema.update.parse(req.body);
  
        try {
            logger.info({
                message: `Iniciando ação de atualização de formulário Form17Conclusao no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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
  
            // 2 - Verificar se o Form17Conclusao já existe no relatório
            const form17ConclusaoExistente = await prisma.form17Conclusao.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });
  
            if (!form17ConclusaoExistente) {
                throw new AppError('Form17Conclusao não encontrado neste relatório', 404);
            }
  
            // 3 - Atualizar o registro do Form17Conclusao
            const form17ConclusaoAtualizado = await prisma.form17Conclusao.update({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
                data: {
                    ...form17ConclusaoBody,
                },
            });
  
            // 4 - Retornar a resposta
            return res.status(200).json({
                message: 'Atualização realizada com sucesso.',
                data_registro: FormatDate(form17ConclusaoAtualizado.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: form17ConclusaoAtualizado,
            });
  
        } catch (error) {
            logger.error({
                message: `Erro ao atualizar Form17Conclusao no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de listagem de formulário Form17Conclusao no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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
  
            // 2 - Verificar se o Form17Conclusao já existe no relatório
            const form17ConclusaoExistente = await prisma.form17Conclusao.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
                // Adicione qualquer relação necessária para mostrar os dados relacionados
            });
  
            if (!form17ConclusaoExistente) {
                throw new AppError('Form17Conclusao não encontrado neste relatório', 404);
            }
  
            logger.info({
                message: `Listagem de formulário Form17Conclusao no relatório realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
  
            // 3 - Retornar o Form17Conclusao encontrado
            return res.status(200).json({
                message: 'Formulário localizado',
                data_registro: FormatDate(form17ConclusaoExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: form17ConclusaoExistente,
            });
  
        } catch (error) {
            logger.error({
                message: `Erro ao listar Form17Conclusao no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de exclusão de formulário Form17Conclusao no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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
  
            // 2 - Verificar se o Form17Conclusao já existe no relatório
            const form17ConclusaoExistente = await prisma.form17Conclusao.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });
  
            if (!form17ConclusaoExistente) {
                throw new AppError('Form17Conclusao não encontrado neste relatório', 404);
            }
  
            // 3 - Excluir o registro de Form17Conclusao
            await prisma.form17Conclusao.delete({
                where: {
                    numero_processo,
                },
            });
  
            // 4 - Atualizar o campo "formularios_selecionados" do relatório (removendo Form17Conclusao)
            if (relatorioExistente.formularios_selecionados?.includes('form17_Conclusao')) {
                const formulariosSelecionados = relatorioExistente.formularios_selecionados?.filter((formulario) => formulario !== 'form17_Conclusao');
  
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
                message: `Exclusão de formulário Form17Conclusao no relatório realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
  
            // 5 - Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Formulário excluído do relatório',
                data_registro: FormatDate(form17ConclusaoExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
            });
  
        } catch (error) {
            logger.error({
                message: `Erro ao excluir Form17Conclusao no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });
  
            return next(error);
        }
    }
  
}
