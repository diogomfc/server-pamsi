import { NextFunction, Request, Response } from 'express';

import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';
import { form3CronologiaSinistroSchema } from '@/schemas/FormsSchemas/Form3CronologiaSinistroSchema';
import { Status_Formulario, Tipo_Formulario } from '@prisma/client';
import { FormatDate } from '@/utils/DateUtils';

export class Form3CronologiaSinistroController {

    // POST - /form3-cronologia-sinistro/:numero_processo
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form3CronologiaSinistro = form3CronologiaSinistroSchema.create.parse(req.body);

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

            // 2 - Verificar se o Form3CronologiaSinistro já existe no relatório
            const form3CronologiaSinistroExistente = await prisma.form3CronologiaSinistro.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form3CronologiaSinistroExistente) {
                throw new AppError('form3_Cronologia_Sinistro já está cadastrado.', 409);
            }

            // 3 - Buscar numero do formulariosDoRelatorio_id vinculado ao relatório
            const formulariosDoRelatorio = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Criar um novo registro de Form3CronologiaSinistro na tabela form3CronologiaSinistro
            const newForm3CronologiaSinistro = await prisma.form3CronologiaSinistro.create({
                data: {
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    cep_local_sinistro: form3CronologiaSinistro.cep_local_sinistro,
                    endereco_local_sinistro: form3CronologiaSinistro.endereco_local_sinistro,
                    numero_local_sinistro: form3CronologiaSinistro.numero_local_sinistro,
                    complemento_local_sinistro: form3CronologiaSinistro.complemento_local_sinistro,
                    bairro_local_sinistro: form3CronologiaSinistro.bairro_local_sinistro,
                    cidade_local_sinistro: form3CronologiaSinistro.cidade_local_sinistro,
                    uf_local_sinistro: form3CronologiaSinistro.uf_local_sinistro,
                    comunicante: form3CronologiaSinistro.comunicante,
                    data_hora_sinistro: form3CronologiaSinistro.data_hora_sinistro,
                    data_hora_comunicacao: form3CronologiaSinistro.data_hora_comunicacao,
                    agente_pamcary: form3CronologiaSinistro.agente_pamcary,
                    data_hora_chegada_local: form3CronologiaSinistro.data_hora_chegada_local,
                    formulariosDoRelatorio_id: formulariosDoRelatorio?.id,
                },
            });

            const novoRegistro = {
                ...newForm3CronologiaSinistro,
                data_cadastro: FormatDate(newForm3CronologiaSinistro.data_cadastro),
            };

            // 5 - Atualizar o campo "formularios_selecionados" do relatório (adicionando Form3CronologiaSinistro)
            if (!relatorioExistente.formularios_selecionados?.includes('form3_Cronologia_Sinistro')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form3_Cronologia_Sinistro',
                ] as Tipo_Formulario[];

                await prisma.relatorio.update({
                    where: {
                        numero_processo: newForm3CronologiaSinistro.numero_processo,
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

            // 6 - Retornar o Form3CronologiaSinistro criado
            return res.status(201).json({
                message: 'Cadastro realizado com sucesso.',
                Form3CronologiaSinistro: novoRegistro,
            });

        } catch (error) {

            logger.error({
                message: `Erro ao criar Form3CronologiaSinistro no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    // GET - /form3-cronologia-sinistro/:numero_processo
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
            const form3CronologiaSinistro = await prisma.form3CronologiaSinistro.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form3CronologiaSinistro) {
                throw new AppError('form3_Cronologia_Sinistro não encontrado.', 404);
            }

            // 3 - Retornar o Form3CronologiaSinistro com a data formatada
            const novaLista = {
                ...form3CronologiaSinistro,
                data_cadastro: FormatDate(form3CronologiaSinistro.data_cadastro),
            };

            logger.info({
                message: `Listagem form3_Cronologia_Sinistro realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 4 - Retornar o Form3CronologiaSinistro
            return res.status(200).json({
                message: 'Listagem realizada com sucesso.',
                Form3CronologiaSinistro: novaLista,
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

    // PUT - /form3-cronologia-sinistro/:numero_processo
    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form3CronologiaSinistro = form3CronologiaSinistroSchema.update.parse(req.body);

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
                        cep_local_sinistro: form3CronologiaSinistro.cep_local_sinistro,
                        endereco_local_sinistro: form3CronologiaSinistro.endereco_local_sinistro,
                        numero_local_sinistro: form3CronologiaSinistro.numero_local_sinistro,
                        complemento_local_sinistro: form3CronologiaSinistro.complemento_local_sinistro,
                        bairro_local_sinistro: form3CronologiaSinistro.bairro_local_sinistro,
                        cidade_local_sinistro: form3CronologiaSinistro.cidade_local_sinistro,
                        uf_local_sinistro: form3CronologiaSinistro.uf_local_sinistro,
                        comunicante: form3CronologiaSinistro.comunicante,
                        data_hora_sinistro: form3CronologiaSinistro.data_hora_sinistro,
                        data_hora_comunicacao: form3CronologiaSinistro.data_hora_comunicacao,
                        agente_pamcary: form3CronologiaSinistro.agente_pamcary,
                        data_hora_chegada_local: form3CronologiaSinistro.data_hora_chegada_local,
                    }
                });

                // 3 - Retornar o Form3CronologiaSinistro atualizado com a data formatada
                const novaLista ={
                    ...form3CronologiaSinistroAtualizado,
                    data_cadastro: FormatDate(form3CronologiaSinistroAtualizado.data_cadastro),
                };

                return res.status(200).json(novaLista);
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

    // DELETE - /form3-cronologia-sinistro/:numero_processo
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

            // 2. Excluir o registro de Form3CronologiaSinistro na tabela Form3CronologiaSinistro
            await prisma.form3CronologiaSinistro.delete({
                where: {
                    numero_processo: numero_processo,
                },
            });

            // 3. Atualizar o campo "formularios_selecionados" do relatório (removendo form3_Cronologia_Sinistro)
            if (relatorioExistente.formularios_selecionados.includes('form3_Cronologia_Sinistro')) {
                const updatedFormulariosSelecionados = relatorioExistente.formularios_selecionados.filter(
                    (formulario) => formulario !== 'form3_Cronologia_Sinistro'
                );

                await prisma.relatorio.update({
                    where: {
                        numero_processo: numero_processo,
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
                message: 'Exclusão realizada com sucesso.',
              
            });

        } catch (err) {
            logger.error({
                message: `Erro ao excluir form3_Cronologia_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(err)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(err);
        } 
    }
}
