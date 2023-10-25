import { NextFunction, Request, Response } from 'express';
import * as z from 'zod';

//import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import { TipoFormulario, StatusRelatorio } from '@prisma/client';


//Schema de validação do body da requisição
const RelatorioSchema = z.object({
    numero_processo: z.string().min(1), 
    cliente: z.string().min(1), 
    cnpj: z.string().min(1),
    data_entrada: z.date().optional(), 
    data_emissao: z.date().optional(),
    status: z.nativeEnum(StatusRelatorio).optional(),
    usuarioResponsavel_id: z.string().optional(),
    usuariosPermitidos: z.array(z.string()).optional(), 
    formulariosDoRelatorio: z.array(z.string()).optional(),
    formulariosSelecionados: z.nativeEnum(TipoFormulario).array().optional()
});


export class RelatorioController{
    //POST - /relatorio -- Responsável por registrar relatórios
    async create (req: Request, res: Response, next: NextFunction){
      
        //Recupera o id e nome do usuário logado
        const usuarioResponsavel_id = req.usuario.id;
        const usuarioResponsavel = req.usuario.nome;
      
        try {
            //Validação do body da requisição
            const body = RelatorioSchema.parse(req.body);

            //Validar se o numero do processo já existe
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {
                    numero_processo: body.numero_processo
                }
            });

            if(relatorioExistente){
                throw new AppError('Número do processo já existe', 400);
            }

            //Criar o relatório adicionando o id do usuário autenticado

            const relatorioCriado = await prisma.relatorio.create({
                data: {
                    numero_processo: body.numero_processo,
                    cliente: body.cliente,
                    cnpj: body.cnpj,
                    data_entrada: body.data_entrada,
                    data_emissao: body.data_emissao,
                    status: body.status,
                    usuarioResponsavel_id,
                    usuariosPermitidos: {
                        connect: body.usuariosPermitidos
                            ?.map((usuariosPermitidos_id) => ({id: usuariosPermitidos_id}))
                    },
                    formulariosSelecionados: body.formulariosSelecionados,
                    formulariosDoRelatorio: {
                        create:{
                            numero_processo: body.numero_processo,
                            formClienteSegurado: body.formulariosSelecionados?.includes('form1ClienteSegurado') ? {
                                create: {
                                    numero_etapa: '1',
                                    numero_processo: body.numero_processo,
                                }
                            } : undefined,
                            formDeclaracaoMotoristaAjudante: body.formulariosSelecionados?.includes('form11DeclaracaoMotoristaAjudante') ? {
                                create: {
                                    numero_etapa: '11',
                                    numero_processo: body.numero_processo,
                                }
                            } : undefined,
                        }
                    }
                }
            });

            //Retorna o relatório criado
            return res.status(201).json({
                message : 'Relatório criado com sucesso',
                relatorio: relatorioCriado
            });


        } catch (error) {
            logger.error({
                message: `Erro ao criar relatório para o usuário ${usuarioResponsavel} (ID: ${usuarioResponsavel_id}): ${JSON.stringify(error)}`,
            });

            return next(error);
        }
    }

    //GET - /relatorio -- Responsável por listar relatórios
    async index (req: Request, res: Response, next: NextFunction){
        //Recupera o id e nome do usuário logado
        const usuarioResponsavel_id = req.usuario.id;
        const usuarioResponsavel = req.usuario.nome;

        try {
            //Recupera todos os relatórios
            const relatorios = await prisma.relatorio.findMany({
                include:{
                    usuarioResponsavel:{
                        select:{
                            nome: true,
                            email: true,
                            funcao: true,
                            avatar: true,
                        }
                    },
                    usuariosPermitidos:{
                        select:{
                            nome: true,
                            email: true,
                            funcao: true,
                            avatar: true,
                        }
                    },
                    formulariosDoRelatorio: {
                        select: {
                            id: true,
                            numero_processo: true,
                            formClienteSegurado: {
                                select: {
                                    id: true,
                                    numero_processo: true,
                                }
                            },
                            formDeclaracaoMotoristaAjudante: {
                                select: {
                                    id: true,
                                    numero_processo: true,
                                }
                            },
                        }
                    },
                }
               
               
            });

            //Retorna os relatórios
            return res.status(200).json({
                message: 'Relatórios listados com sucesso',
                relatorios
            });
        } catch (error) {
            logger.error({
                message: `Erro ao listar relatórios para o usuário ${usuarioResponsavel} (ID: ${usuarioResponsavel_id}): ${JSON.stringify(error)}`,
            });

            return next(error);
        }
    }

    //PUT - /relatorio/:id -- Responsável por atualizar relatórios
    // async update (req: Request, res: Response, next: NextFunction){}
}