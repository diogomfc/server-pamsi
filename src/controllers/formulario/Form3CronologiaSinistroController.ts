import { NextFunction, Request, Response } from 'express';

import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';
import { 
    form3CronologiaSinistroSchema,
    Form3CronologiaSinistroSchemaType,  
} from '@/schemas/FormsSchemas/Form3CronologiaSinistroSchema';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';
import { FormatDate } from '@/utils/DateUtils';

export class Form3CronologiaSinistroController {

    // POST - /form3-cronologia-sinistro/:numero_processo/:relatorio_id
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form3CronologiaSinistroBody:Form3CronologiaSinistroSchemaType['create'] = form3CronologiaSinistroSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação Form3CronologiaSinistro no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form3_Cronologia_Sinistro já existe no relatório
            const form3CronologiaSinistroExistente = await prisma.form3CronologiaSinistro.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form3CronologiaSinistroExistente) {
                throw new AppError('form3_Cronologia_Sinistro já está cadastrado.', 409);
            }

            // 3 - Buscar numero do formulariosDoRelatorio_id vinculado ao relatório
            const formulariosDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Criar um novo registro de form3_Cronologia_Sinistro na tabela form3CronologiaSinistro
            const novoForm3CronologiaSinistro = await prisma.form3CronologiaSinistro.create({
                data: {
                    formularioDoRelatorio_id: formulariosDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    ...form3CronologiaSinistroBody,
                },
            });


            // 5 - Atualizar o campo "formularios_selecionados" do relatório (adicionando Form3CronologiaSinistro)
            if (!relatorioExistente.formularios_selecionados?.includes('form3_Cronologia_Sinistro')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form3_Cronologia_Sinistro',
                ] as Tipo_Formulario[];

                await prisma.relatorio.update({
                    where: {
                        numero_processo: novoForm3CronologiaSinistro.numero_processo,
                    },
                    data: {
                        formularios_selecionados: updatedFormulariosSelecionados,
                    },
                });
            }

            logger.info({
                message: `Cadastro form3_Cronologia_Sinistro realizado com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 6 - Retornar o form3_Cronologia_Sinistro criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm3CronologiaSinistro.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm3CronologiaSinistro,
            });

        } catch (error) {

            logger.error({
                message: `Erro ao criar form3_Cronologia_Sinistro no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    // GET - /form3-cronologia-sinistro/:numero_processo/:relatorio_id
    async show(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;

        try {
            logger.info({
                message: `Iniciando ação de listagem form3_Cronologia_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1 - Verificar se o relatório existe
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {  
                    id: relatorio_id,
                    numero_processo
                },
            });

            if (!relatorioExistente) {
                throw new AppError('Relatório não encontrado.', 404);
            }

            // 2 - Verificar se o Form3CronologiaSinistro existe no relatório
            const form3CronologiaSinistroExistente = await prisma.form3CronologiaSinistro.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form3CronologiaSinistroExistente) {
                throw new AppError('form3_Cronologia_Sinistro não encontrado.', 404);
            }

            logger.info({
                message: `Listagem form3_Cronologia_Sinistro realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 3 - Retornar o Form3CronologiaSinistro
            return res.status(200).json({
                message: 'Formulario localizado.',
                data_registro: FormatDate(form3CronologiaSinistroExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_localizado: form3CronologiaSinistroExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao listar form3_Cronologia_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    // PUT - /form3-cronologia-sinistro/:numero_processo/:relatorio_id
    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form3CronologiaSinistroBody:Form3CronologiaSinistroSchemaType['update'] = form3CronologiaSinistroSchema.update.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de atualização form3_Cronologia_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1 - Verificar se o relatório existe
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {  
                    id: relatorio_id,
                    numero_processo
                },
            });

            if (!relatorioExistente) {
                throw new AppError('Relatório não encontrado.', 404);
            }

            // 2 - Verificar se o Form3CronologiaSinistro existe no relatório
            const form3CronologiaSinistroExistente = await prisma.form3CronologiaSinistro.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                }
            });

            if (!form3CronologiaSinistroExistente) {
                throw new AppError('form3_Cronologia_Sinistro não encontrado.', 404);
            }

            // 3 - Atualizar o registro de Form3CronologiaSinistro na tabela Form3CronologiaSinistro
            if (form3CronologiaSinistroExistente) {
                // Atualize as propriedades relevantes conforme necessário
                const form3CronologiaSinistroAtualizado = await prisma.form3CronologiaSinistro.update({
                    where: {
                        numero_processo: relatorioExistente.numero_processo,
                    },
                    data: {
                        status: Status_Formulario.Formalizando,
                        ...form3CronologiaSinistroBody,
                    }
                });

                return res.status(200).json({
                    message: 'Atualização realizada com sucesso.',
                    data_registro: FormatDate(form3CronologiaSinistroAtualizado.data_cadastro),
                    relatorio_id: relatorio_id,
                    formulario_atualizado: form3CronologiaSinistroAtualizado,
                });
            }

            logger.info({
                message: `Atualização form3_Cronologia_Sinistro realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao atualizar form3_Cronologia_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    // DELETE - /form3-cronologia-sinistro/:numero_processo/:relatorio_id
    async delete(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;

        try {
            logger.info({
                message: `Iniciando ação de exclusão form3_Cronologia_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1 - Verificar se o relatório existe
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {  
                    id: relatorio_id,
                    numero_processo
                },
            });

            if (!relatorioExistente) {
                throw new AppError('Relatório não encontrado.', 404);
            }

            // 2 - Verificar se o form3_Cronologia_Sinistro existe no relatório pelo numero_processo
            const form3CronologiaSinistroExistente = await prisma.form3CronologiaSinistro.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form3CronologiaSinistroExistente) {
                throw new AppError('form3_Cronologia_Sinistro não encontrado.', 404);
            }

            // 3. Excluir o registro de form3_Cronologia_Sinistro do banco de dados
            await prisma.form3CronologiaSinistro.delete({
                where: {
                    numero_processo,
                },
            });

            // 4. Atualizar o campo "formularios_selecionados" do relatório (removendo form3_Cronologia_Sinistro)
            if (relatorioExistente.formularios_selecionados.includes('form3_Cronologia_Sinistro')) {
                const updatedFormulariosSelecionados = relatorioExistente.formularios_selecionados.filter(
                    (formulario) => formulario !== 'form3_Cronologia_Sinistro'
                );

                await prisma.relatorio.update({
                    where: {
                        id: relatorio_id,
                        numero_processo
                    },
                    data: {
                        formularios_selecionados: updatedFormulariosSelecionados,
                    },
                });
            }

            logger.info({
                message: `Exclusão form3_Cronologia_Sinistro realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 4. Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Etapa excluída do relatório',
                data_registro: FormatDate(form3CronologiaSinistroExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
                formulario_excluido: form3CronologiaSinistroExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao excluir form3_Cronologia_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        } 
    }
}
