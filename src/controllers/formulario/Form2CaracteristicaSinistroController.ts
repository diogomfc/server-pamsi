import { NextFunction, Request, Response } from 'express';

import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';
import { form2CaracteristicaSinistroSchema } from '@/schemas/FormsSchemas/Form2CaracteristicaSinistroSchema';
import { Status_Formulario, Tipo_Formulario} from '@prisma/client';
import { FormatDate } from '@/utils/DateUtils';


export class Form2CaracteristicaSinistroController {

    // POST - /form2-caracteristica-sinistro/:numero_processo
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form2CaracteristicaSinistro = form2CaracteristicaSinistroSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação form2_Caracteristica_Sinistro no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1 - Verificar se o relatório existe
            const relatorio = await prisma.relatorio.findFirst({
                where: {
                    id: relatorio_id,
                    numero_processo,
                },
            });

            if (!relatorio) {
                throw new AppError('Relatório não encontrado.', 404);
            }

            // 2 - Verificar se o form2_Caracteristica_Sinistro já existe no relatório
            const form2CaracteristicaSinistroExistente = await prisma.form2CaracteristicaSinistro.findFirst({
                where: {
                    numero_processo,
                },
            });

            if (form2CaracteristicaSinistroExistente) {
                throw new AppError('form2_Caracteristica_Sinistro já está cadastrado.', 409);
            }

            // 3 - Buscar numero do formulariosDoRelatorio_id vinculado ao relatório
            const formulariosDoRelatorio = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo
                },
            });

            // 4 - Criar um novo registro de form2-caracteristica-sinistro na tabela form2CaracteristicaSinistro
            const newForm2CaracteristicaSinistro = await prisma.form2CaracteristicaSinistro.create({
                data: {
                    numero_processo: relatorio.numero_processo,
                    status: Status_Formulario.Formalizando,
                    nome_seguradora: form2CaracteristicaSinistro.nome_seguradora,
                    natureza_sinistro: relatorio.natureza_sinistro,
                    carga_embarcada: form2CaracteristicaSinistro.carga_embarcada,
                    valor_carga: form2CaracteristicaSinistro.valor_carga,
                    formulariosDoRelatorio_id: formulariosDoRelatorio?.id,
                },
            });

            const novoRegistro = {
                ...newForm2CaracteristicaSinistro,
                data_cadastro: FormatDate(newForm2CaracteristicaSinistro.data_cadastro),
            };

            // 5 - Atualizar o campo "formularios_selecionados" do relatório (adicionando form2_Caracteristica_Sinistro)
            if (!relatorio.formularios_selecionados?.includes('form2_Caracteristica_Sinistro')) {
                const updatedFormulariosSelecionados = [
                    ...relatorio.formularios_selecionados ?? [],
                    'form2_Caracteristica_Sinistro',
                ] as Tipo_Formulario[];

                await prisma.relatorio.update({
                    where: {
                        numero_processo: newForm2CaracteristicaSinistro.numero_processo,
                    },
                    data: {
                        formularios_selecionados: updatedFormulariosSelecionados,
                    },
                });
            }

            logger.info({
                message: `Cadastro form2_Caracteristica_Sinistro realizado com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 6 - Retornar o form2CaracteristicaSinistro criado

            return res.status(201).json({
                message: 'Cadastro realizado com sucesso.',
                form2CaracteristicaSinistro: novoRegistro,
            });

        } catch (error) {

            logger.error({
                message: `Erro ao criar form2_Caracteristica_Sinistro no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    // GET - /form2-caracteristica-sinistro/:numero_processo
    async show(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;

        try {
            logger.info({
                message: `Iniciando ação de listagem form2_Caracteristica_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form2_Caracteristica_Sinistro existe no relatório
            const form2CaracteristicaSinistro = await prisma.form2CaracteristicaSinistro.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form2CaracteristicaSinistro) {
                throw new AppError('form2_Caracteristica_Sinistro não encontrado.', 404);
            }

            // 3 - Retornar o form2_Caracteristica_Sinistro com a data formatada
            const novaLista = {
                ...form2CaracteristicaSinistro,
                data_cadastro: FormatDate(form2CaracteristicaSinistro.data_cadastro),
            };

            logger.info({
                message: `Listagem form2_Caracteristica_Sinistro realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
             
            // 4 - Retornar o form2_Caracteristica_Sinistro
            return res.status(200).json({
                message: 'Listagem realizada com sucesso.',
                form2CaracteristicaSinistro: novaLista,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao listar form2_Caracteristica_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    // PUT - /form2-caracteristica-sinistro/:numero_processo
    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form2CaracteristicaSinistro = form2CaracteristicaSinistroSchema.update.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de atualização form2_Caracteristica_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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


            // 2 - Verificar se o form2_Caracteristica_Sinistro existe no relatório
            const form2CaracteristicaSinistroExistente = await prisma.form2CaracteristicaSinistro.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo
                }
            });

            if (!form2CaracteristicaSinistroExistente) {
                throw new AppError('form2_Caracteristica_Sinistro não encontrado.', 404);
            }

            // 3 - Atualizar o registro de form2_Caracteristica_Sinistro na tabela form1ClienteSegurado
            if (form2CaracteristicaSinistroExistente) {
                const form2CaracteristicaSinistroAtualizado = await prisma.form2CaracteristicaSinistro.update({
                    where: {
                        numero_processo: relatorioExistente.numero_processo,
                    },
                    data: {
                        nome_seguradora: form2CaracteristicaSinistro.nome_seguradora,
                        natureza_sinistro: form2CaracteristicaSinistro.natureza_sinistro,
                        carga_embarcada: form2CaracteristicaSinistro.carga_embarcada,
                        valor_carga: form2CaracteristicaSinistro.valor_carga,
                        status: Status_Formulario.Formalizando,
                    }
                });

                // 3 - Retornar o form2_Caracteristica_Sinistro atualizado com a data formatada
                const novaLista ={
                    ...form2CaracteristicaSinistroAtualizado,
                    data_cadastro: FormatDate(form2CaracteristicaSinistroAtualizado.data_cadastro),
                };
              
                return res.status(200).json(novaLista);
            }

            logger.info({
                message: `Atualização form2_Caracteristica_Sinistro realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao atualizar form2_Caracteristica_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    // DELETE - /form2-caracteristica-sinistro/:numero_processo
    async delete(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;

        try {
            logger.info({
                message: `Iniciando ação de exclusão form2_Caracteristica_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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


            // 2. Verificar se o "form2-Caracteristica-Sinistro" existe no relatório
            const form2CaracteristicaSinistroExistente = await prisma.form2CaracteristicaSinistro.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form2CaracteristicaSinistroExistente) {
                throw new AppError('form2_Caracteristica_Sinistro não encontrado.', 404);
            }

            // 3. Excluir o registro de form2-caracteristica-sinistro na tabela form2CaracteristicaSinistro
            await prisma.form2CaracteristicaSinistro.delete({
                where: {
                    numero_processo,
                },
            });

            // 4. Atualizar o campo "formularios_selecionados" do relatório (removendo form2_Caracteristica_Sinistro)
            if (relatorioExistente.formularios_selecionados.includes('form2_Caracteristica_Sinistro')) {
                const updatedFormulariosSelecionados = relatorioExistente.formularios_selecionados.filter(
                    (formulario) => formulario !== 'form2_Caracteristica_Sinistro'
                );

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
                message: `Exclusão form2_Caracteristica_Sinistro realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
            
            // 5. Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Exclusão realizada com sucesso.',
            });

        } catch (error) {
            logger.error({
                message: `Erro ao excluir form2_Caracteristica_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
}
