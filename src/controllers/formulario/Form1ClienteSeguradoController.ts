import { NextFunction, Request, Response } from 'express';

import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';
import { form1ClienteSeguradoSchema } from '@/schemas/FormsSchemas/Form1ClienteSeguradoSchema';
import { Status_Formulario, Tipo_Formulario } from '@prisma/client';
import { FormatDate } from '@/utils/DateUtils';

export class Form1ClienteSeguradoController {
    //POST - /form1-cliente-segurado/:numero_processo
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const numero_processo = req.params.numero_processo;
        const form1ClienteSegurado = form1ClienteSeguradoSchema.create.parse(req.body);

        try{
            logger.info({
                message: `Iniciando ação de castro form1_Cliente_Segurado. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            //Localizar o form1ClienteSegurado no banco de dados pelo numero_processo vinculado ao relatório
            const form1ClienteSeguradoExistente = await prisma.form1ClienteSegurado.findFirst({
                where: {
                    numero_processo: numero_processo
                }
            });
             
            // se não existir
            if(!form1ClienteSeguradoExistente){
                throw new AppError('Form1ClienteSegurado não encontrado.', 404);
            }

            //Se existir, atualiza
            if(form1ClienteSeguradoExistente){
                const form1ClienteSeguradoAtualizado = await prisma.form1ClienteSegurado.update({
                    where: {
                        numero_processo: numero_processo
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
                        data_cadastro: FormatDate(new Date()),
                    }
                });

                return res.status(200).json(form1ClienteSeguradoAtualizado);
            }


            logger.info({
                message: `Cadastro form1_Cliente_Segurado realizado com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            

        }catch(error){
            logger.error({
                message: `Erro ao cadastrar form1_Cliente_Segurado. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });
            

            return next(error);
        }
    }

    //PUT - /form1-cliente-segurado/:numero_processo
    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const numero_processo = req.params.numero_processo;
        const form1ClienteSegurado = form1ClienteSeguradoSchema.update.parse(req.body);

        try{
            logger.info({
                message: `Iniciando ação de atualização form1_Cliente_Segurado. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            //Localizar o form1ClienteSegurado no banco de dados pelo numero_processo vinculado ao relatório
            const form1ClienteSeguradoExistente = await prisma.form1ClienteSegurado.findFirst({
                where: {
                    numero_processo: numero_processo
                }
            });
             
            // se não existir
            if(!form1ClienteSeguradoExistente){
                throw new AppError('Form1ClienteSegurado não encontrado.', 404);
            }

            // Se existir, atualiza
            if(form1ClienteSeguradoExistente){
                const form1ClienteSeguradoAtualizado = await prisma.form1ClienteSegurado.update({
                    where: {
                        numero_processo: numero_processo
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
                        data_cadastro: FormatDate(new Date()),
                    }
                });

                return res.status(200).json(form1ClienteSeguradoAtualizado);
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

    // DELETE - /form1-cliente-segurado/:numero_processo
    async delete(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const numero_processo = req.params.numero_processo;

        try {
            logger.info({
                message: `Iniciando ação de exclusão form1_Cliente_Segurado. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1. Verificar se o "form1-Cliente-Segurado" existe no relatório
            const relatorio = await prisma.relatorio.findFirst({
                where: {
                    numero_processo: numero_processo,
                },
            });

            if (!relatorio) {
                throw new AppError('Relatório não encontrado.', 404);
            }

            // 2. Excluir o registro de form1-cliente-segurado na tabela form1ClienteSegurado
            await prisma.form1ClienteSegurado.delete({
                where: {
                    numero_processo: numero_processo,
                },
            });

            // 3. Atualizar o campo "formularios_selecionados" do relatório (removendo form1_Cliente_Segurado)
            if (relatorio.formularios_selecionados.includes('form1_Cliente_Segurado')) {
                const updatedFormulariosSelecionados = relatorio.formularios_selecionados.filter(
                    (formulario) => formulario !== 'form1_Cliente_Segurado'
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
                message: `Exclusão form1_Cliente_Segurado realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });



            return res.status(200).json({
                message: 'Exclusão realizada com sucesso.',
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

    async createFormOnRelatorio(req: Request, res: Response, next: NextFunction){
        const usuario_responsavel = req.usuario;
        const numero_processo = req.params.numero_processo;
        const form1ClienteSegurado = form1ClienteSeguradoSchema.create.parse(req.body);

        try{
            logger.info({
                message: `Iniciando ação de criação form1_Cliente_Segurado no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });


            // 1 - Verificar se o relatório existe
            const relatorio = await prisma.relatorio.findFirst({
                where: {
                    numero_processo: numero_processo,
                },
            });

            if (!relatorio) {
                throw new AppError('Relatório não encontrado.', 404);
            }

            // 2 - Buscar numero do formulariosDoRelatorio_id vinculado ao relatório
            const formulariosDoRelatorio = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo
                },
            });


            //3 - Criar um novo registro de form1-cliente-segurado na tabela form1ClienteSegurado
            const newForm1ClienteSegurado = await prisma.form1ClienteSegurado.create({
                data: {
                    numero_processo: relatorio.numero_processo,
                    status: Status_Formulario.Formalizando,
                    data_cadastro: FormatDate(new Date()),
                    nome_cliente: relatorio.cliente,
                    cnpj: relatorio.cnpj,
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
                    formulariosDoRelatorio_id: formulariosDoRelatorio?.id,
                },
            });

            // 4. Atualizar o campo "formularios_selecionados" do relatório (adicionando form1_Cliente_Segurado)
            if (!relatorio.formularios_selecionados?.includes('form1_Cliente_Segurado')) {
                const updatedFormulariosSelecionados = [
                    ...relatorio.formularios_selecionados ?? [],
                    'form1_Cliente_Segurado',
                ] as Tipo_Formulario[];

                await prisma.relatorio.update({
                    where: {
                        numero_processo: newForm1ClienteSegurado.numero_processo,
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
       
            return res.status(201).json({
                message: 'Criação realizada com sucesso.',
                form1ClienteSegurado: newForm1ClienteSegurado,
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

           
}