import { NextFunction, Request, Response } from 'express';
import { prisma } from '@/database';
import { Status_Formulario, Tipo_Formulario} from '@prisma/client';

import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { FormatDate } from '@/utils/DateUtils';

import { 
    Form4DoCarregamentoSchemaType, 
    form4DoCarregamentoSchema 
} from '@/schemas/FormsSchemas/Form4DoCarregamentoSchema';


export class Form4DoCarregamentoController {

    // POST - /form4-do-carregamento/:numero_processo/:id_relatorio
    async create(req: Request, res: Response, next: NextFunction) {

        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form4DoCarregamentoBody: Form4DoCarregamentoSchemaType['create'] = form4DoCarregamentoSchema.create.parse(req.body);
    
        try {
            logger.info({
                message: `Iniciando ação de criação form4_Do_Carregamento no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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
             
            // 2 - Verificar se o form4_Do_Carregamento já existe no relatório
            const form4DoCarregamentoExistente = await prisma.form4DoCarregamento.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form4DoCarregamentoExistente) {
                throw new AppError('Form4_Do_Carregamento já existe neste relatório.', 409);
            }

            // 3 - Buscar numero do formularioDoRelatorio_id vinculado ao relatório
            const formularioDoRelatorio = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo
                },
            });

            // 4 - Criar um novo registro de form4_Do_Carregamento no banco de dados
            const novoForm4DoCarregamento = await prisma.form4DoCarregamento.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorio?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Finalizado,
                    ...form4DoCarregamentoBody,
                },
            });

        
            // 5 - Atualizar o campo "formularios_selecionados" do relatório (adicionar form4_Do_Carregamento)
            if (!relatorioExistente.formularios_selecionados?.includes('form4_Do_Carregamento')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form4_Do_Carregamento',
                ] as Tipo_Formulario[]; 
              
                await prisma.relatorio.update({
                    where: {
                        numero_processo: novoForm4DoCarregamento.numero_processo,
                    },
                    data: {
                        formularios_selecionados: updatedFormulariosSelecionados,
                    },
                });
            }

            logger.info({
                message: `Cadastro form4_Do_Carregamento realizado com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 6 - Retornar o form4_Do_Carregamento criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm4DoCarregamento.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm4DoCarregamento,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao criar form4_Do_Carregamento no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });
            return next(error);
        }
    }

    // GET - /form4-do-carregamento/:numero_processo/:id_relatorio
    async show(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
      
        try {
            logger.info({
                message: `Iniciando ação de listagem form4_Do_Carregamento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form4_Do_Carregamento já existe no relatório
            const form4DoCarregamentoExistente = await prisma.form4DoCarregamento.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form4DoCarregamentoExistente) {
                throw new AppError('Form4_Do_Carregamento já existe neste relatório.', 409);
            }

            logger.info({
                message: `Listagem form4_Do_Carregamento realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 4 - Retornar o form4_Do_Carregamento
            return res.status(200).json({
                message: 'Formulario filtrado.',
                data_registro: FormatDate(form4DoCarregamentoExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_filtrado: form4DoCarregamentoExistente,
            });

        } catch (error) {
            return next(error);
        }
    }

    //PUT - /form4-do-carregamento/:numero_processo/relatorio_id
    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form4DoCarregamentoBody: Form4DoCarregamentoSchemaType['update'] = form4DoCarregamentoSchema.update.parse(req.body);

        try{
            logger.info({
                message: `Iniciando ação de atualização form4_Do_Carregamento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1 - Verificar se o relatorio existe pelo relatório_id e numero_processo
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {
                    id: relatorio_id,
                    numero_processo,
                },
            });

            if (!relatorioExistente) {
                throw new AppError('Relatório não encontrado', 404);
            }

            // 2- Verificar se o form4_Do_Carregamento existe no relatório 
            const form4DoCarregamentoExistente = await prisma.form4DoCarregamento.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                }
            });
       
            if(!form4DoCarregamentoExistente){
                throw new AppError('form4_Do_Carregamento não encontrado.', 404);
            }

            // 3 - Atualizar o registro de form4_Do_Carregamento
            if(form4DoCarregamentoExistente){
                const form4DoCarregamentoAtualizado = await prisma.form4DoCarregamento.update({
                    where: {
                        numero_processo: relatorioExistente.numero_processo,
                    },
                    data: {
                        status: Status_Formulario.Formalizando,
                        ...form4DoCarregamentoBody,
                    }
                });

      
                return res.status(200).json({
                    message: 'Atualização realizada com sucesso.',
                    data_registro: FormatDate(form4DoCarregamentoAtualizado.data_cadastro),
                    relatorio_id: relatorio_id,
                    formulario_atualizado: form4DoCarregamentoAtualizado,
                });
            }

            logger.info({
                message: `Atualização form4_Do_Carregamento realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

        }catch(error){
            logger.error({
                message: `Erro ao atualizar form4_Do_Carregamento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });
      
            return next(error);
        }
    }

    //DELETE - /form4-do-carregamento/:numero_processo/:id_relatorio
    async delete(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
      
        try {
            logger.info({
                message: `Iniciando ação de exclusão form4_Do_Carregamento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            //2-Verificar se o form4_Do_Carregamento existe no relatório pelo numero_processo
            const form4DoCarregamentoExistente = await prisma.form4DoCarregamento.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form4DoCarregamentoExistente) {
                throw new AppError('Form4_Do_Carregamento não existe neste relatório.', 409);
            }

            // 2. Excluir o registro de form4DoCarregamento do banco de dados
            await prisma.form4DoCarregamento.delete({
                where: {
                    numero_processo,
                },
            });

            // 3. Atualizar o campo "formularios_selecionados" do relatório (remover form4_Do_Carregamento)
            if (relatorioExistente.formularios_selecionados.includes('form4_Do_Carregamento')) {
                const updatedFormulariosSelecionados = relatorioExistente.formularios_selecionados.filter(
                    (formulario) => formulario !== 'form4_Do_Carregamento'
                );

                await prisma.relatorio.update({
                    where: {
                        id: relatorio_id
                    },
                    data: {
                        formularios_selecionados: updatedFormulariosSelecionados,
                    },
                });
            }

            logger.info({
                message: `Exclusão form4_Do_Carregamento realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
            // 4. Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Etapa excluída do relatório',
                data_registro: FormatDate(form4DoCarregamentoExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
                formulario_excluido: form4DoCarregamentoExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao excluir form4_Do_Carregamento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
}
