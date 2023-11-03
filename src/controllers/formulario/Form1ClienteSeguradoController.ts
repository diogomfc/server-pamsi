import { NextFunction, Request, Response } from 'express';

import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import { 
    form1ClienteSeguradoSchema,
    Form1ClienteSeguradoSchemaType 
} from '@/schemas/FormsSchemas/Form1ClienteSeguradoSchema';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';

export class Form1ClienteSeguradoController {

    //POST - /form1-cliente-segurado/:numero_processo/:relatorio_id
    async create(req: Request, res: Response, next: NextFunction){
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form1ClienteSegurado: Form1ClienteSeguradoSchemaType['create'] = form1ClienteSeguradoSchema.create.parse(req.body);

        try{
            logger.info({
                message: `Iniciando ação de criação form1_Cliente_Segurado no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form1_Cliente_Segurado já existe no relatório
            const form1ClienteSeguradoExistente = await prisma.form1ClienteSegurado.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo
                },
            });

            if (form1ClienteSeguradoExistente) {
                throw new AppError('form1_Cliente_Segurado já existe neste relatório', 409);
            }

            // 3 - Buscar numero do formularioDoRelatorio_id vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            //4 - Criar um novo registro de form1-cliente-segurado na tabela form1ClienteSegurado
            const novoForm1ClienteSegurado = await prisma.form1ClienteSegurado.create({
                data: {
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    nome_cliente: relatorioExistente.cliente,
                    cnpj: relatorioExistente.cnpj,
                    telefone: form1ClienteSegurado.telefone,
                    celular: form1ClienteSegurado.celular,
                    email: form1ClienteSegurado.email,
                    representante: form1ClienteSegurado.representante,
                    cep: form1ClienteSegurado.cep,
                    endereco: form1ClienteSegurado.endereco,
                    numero: form1ClienteSegurado.numero,
                    complemento: form1ClienteSegurado.complemento,
                    bairro: form1ClienteSegurado.bairro,
                    cidade: form1ClienteSegurado.cidade,
                    uf: form1ClienteSegurado.uf,
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando form1_Cliente_Segurado)
            if (!relatorioExistente.formularios_selecionados?.includes('form1_Cliente_Segurado')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form1_Cliente_Segurado',
                ] as Tipo_Formulario[];

                await prisma.relatorio.update({
                    where: {
                        numero_processo: novoForm1ClienteSegurado.numero_processo,
                    },
                    data: {
                        formularios_selecionados: updatedFormulariosSelecionados,
                    },
                });
            }

            logger.info({
                message: `Cadastro form1_Cliente_Segurado realizado com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 6 - Retornar o form1-cliente-segurado criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm1ClienteSegurado.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm1ClienteSegurado,
            });

        }catch(error){

            logger.error({
                message: `Erro ao criar form1_Cliente_Segurado no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
    // GET - /form1-cliente-segurado/:numero_processo/:relatorio_id
    async show(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;

        try {
            logger.info({
                message: `Iniciando ação de listagem form1_Cliente_Segurado. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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
                throw new AppError('Relatório não encontrado.', 404);
            }

            // 2 - Verificar se o form1_Cliente_Segurado existe no relatório 
            const form1ClienteSeguradoExistente = await prisma.form1ClienteSegurado.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form1ClienteSeguradoExistente) {
                throw new AppError('form1_Cliente_Segurado não encontrado', 404);
            }


            logger.info({
                message: `Listagem form1_Cliente_Segurado realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 3 - Retornar o form1_Cliente_Segurado
            return res.status(200).json({
                message: 'Formulario localizado.',
                data_registro: FormatDate(form1ClienteSeguradoExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_localizado: form1ClienteSeguradoExistente,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao localizar o form1_Cliente_Segurado. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
  
    //PUT - /form1-cliente-segurado/:numero_processo/relatorio_id
    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form1ClienteSegurado: Form1ClienteSeguradoSchemaType['update'] = form1ClienteSeguradoSchema.update.parse(req.body);

        try{
            logger.info({
                message: `Iniciando ação de atualização form1_Cliente_Segurado. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2- Verificar se o form1_Cliente_Segurado existe no relatório 
            const form1ClienteSeguradoExistente = await prisma.form1ClienteSegurado.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                }
            });
             
            if(!form1ClienteSeguradoExistente){
                throw new AppError('form1_Cliente_Segurado não encontrado.', 404);
            }

            // 3 - Atualizar o registro de form1_Cliente_Segurado
            if(form1ClienteSeguradoExistente){
                const form1ClienteSeguradoAtualizado = await prisma.form1ClienteSegurado.update({
                    where: {
                        numero_processo: relatorioExistente.numero_processo,
                    },
                    data: {
                        representante: form1ClienteSegurado.representante,
                        telefone: form1ClienteSegurado.telefone,
                        celular: form1ClienteSegurado.celular,
                        email: form1ClienteSegurado.email,
                        cep: form1ClienteSegurado.cep,
                        endereco: form1ClienteSegurado.endereco,
                        numero: form1ClienteSegurado.numero,
                        complemento: form1ClienteSegurado.complemento,
                        bairro: form1ClienteSegurado.bairro,
                        cidade: form1ClienteSegurado.cidade,
                        uf: form1ClienteSegurado.uf,
                        status: Status_Formulario.Formalizando,
                    }
                });

            
                return res.status(200).json({
                    message: 'Atualização realizada com sucesso.',
                    data_registro: FormatDate(form1ClienteSeguradoAtualizado.data_cadastro),
                    relatorio_id: relatorio_id,
                    formulario_atualizado: form1ClienteSeguradoAtualizado,
                });
            }

            logger.info({
                message: `Atualização form1_Cliente_Segurado realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

        }catch(error){
            logger.error({
                message: `Erro ao atualizar form1_Cliente_Segurado. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });
            
            return next(error);
        }
    }

    // DELETE - /form1-cliente-segurado/:numero_processo/:relatorio_id
    async delete(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;

        try {
            logger.info({
                message: `Iniciando ação de exclusão form1_Cliente_Segurado. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form1_Cliente_Segurado existe no relatório pelo numero_processo
            const form1ClienteSeguradoExistente = await prisma.form1ClienteSegurado.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form1ClienteSeguradoExistente) {
                throw new AppError('form1_Cliente_Segurado não encontrado.', 404);
            }

            // 3 - Excluir o registro de form1-cliente-segurado na tabela form1ClienteSegurado
            await prisma.form1ClienteSegurado.delete({
                where: {
                    numero_processo,
                },
            });

            // 4 - Atualizar o campo "formularios_selecionados" do relatório (removendo form1_Cliente_Segurado)
            if (relatorioExistente.formularios_selecionados.includes('form1_Cliente_Segurado')) {
                const updatedFormulariosSelecionados = relatorioExistente.formularios_selecionados.filter(
                    (formulario) => formulario !== 'form1_Cliente_Segurado'
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
                message: `Exclusão form1_Cliente_Segurado realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
            
            // 5 - Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Etapa excluída do relatório',
                data_registro: FormatDate(form1ClienteSeguradoExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
                formulario_excluido: form1ClienteSeguradoExistente,
            });
            
        } catch (error) {
            logger.error({
                message: `Erro ao excluir form1_Cliente_Segurado. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

}