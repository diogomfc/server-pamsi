import { NextFunction, Request, Response } from 'express';
import * as z from 'zod';

//import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import { Tipo_Formulario, Status_Relatorio } from '@prisma/client';


//Schema de validação do body da requisição
const RelatorioSchema = z.object({
    numero_processo: z.string().min(1), 
    cliente: z.string().min(1), 
    cnpj: z.string().min(1),
    data_entrada: z.date().optional(), 
    data_emissao: z.date().optional(),
    status: z.nativeEnum(Status_Relatorio).optional(),
    usuario_responsavel_id: z.string().optional(),
    usuarios_permitidos: z.array(z.string()).optional(), 
    formularios: z.array(z.string()).optional(),
    formularios_selecionados: z.nativeEnum(Tipo_Formulario).array().optional()
});


export class RelatorioController{
    //POST - /relatorio -- Responsável por registrar relatórios
    async create (req: Request, res: Response, next: NextFunction){
      
        const usuarioResponsavel = req.usuario;
      
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
            
            // Crie um objeto vazio para armazenar os formulários
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            // const formulariosCreate: any = {};

            // // Verifique se 'formularios_selecionados' está definido e é um array
            // if (body.formularios_selecionados) {
            //     // Percorra o array e crie um objeto com o tipo de formulário como chave e o id do formulário como valor
            //     body.formularios_selecionados.forEach((tipo) => {
            //         formulariosCreate[tipo] = {
            //             create: {
            //                 numero_processo: body.numero_processo,
            //             },
            //         };
            //     });
            // }
              
        
            interface FormularioCreate {
              numero_processo: string;
              nome_cliente?: string; 
              cnpj?: string;
            }
            
            const formulariosCreate: Record<string, { create: FormularioCreate }> = {};
            
            // Verifique se 'formularios_selecionados' está definido e é um array
            if (body.formularios_selecionados) {
                body.formularios_selecionados.forEach((tipo: string) => {
                // Crie um objeto para representar o formulário atual
                    const formulario: FormularioCreate = {
                        numero_processo: body.numero_processo,
                    };
            
                    if (tipo === 'form1_Cliente_Segurado') {
                        // Se o tipo for 'form1_Cliente_Segurado', adicione campos adicionais
                        formulario.nome_cliente = body.cliente; // Substitua pelo campo correto
                        formulario.cnpj = body.cnpj; // Substitua pelo campo correto
                    }
            
                    // Adicione o formulário ao objeto formulariosCreate com o tipo como chave
                    formulariosCreate[tipo] = {
                        create: formulario,
                    };
                });
            }
            
            //Cria o relatório
            const relatorioCriado = await prisma.relatorio.create({
                data: {
                    numero_processo: body.numero_processo,
                    cliente: body.cliente,
                    cnpj: body.cnpj,
                    data_entrada: body.data_entrada,
                    data_emissao: body.data_emissao,
                    status: body.status,
                    usuario_responsavel_id: usuarioResponsavel.id,
                    usuarios_permitidos: {
                        connect: body.usuarios_permitidos?.map((usuarioId) => ({
                            id: usuarioId,
                        })),
                    },
                    formularios_selecionados: body.formularios_selecionados,
                    formularios: {
                        create: formulariosCreate, 
                    },
                },
                
            });


            console.log('formulariosSelecionados', formulariosCreate);

            //Retorna o relatório criado
            return res.status(201).json({
                message : 'Relatório criado com sucesso',
                relatorio: relatorioCriado
            });


        } catch (error) {
            logger.error({
                message: `Erro ao criar relatório para o usuário ${usuarioResponsavel.nome} (ID: ${usuarioResponsavel.id}): ${JSON.stringify(error)}`,
            });

            return next(error);
        }
    }

    //GET - /relatorio -- Responsável por listar relatórios
    // async index (req: Request, res: Response, next: NextFunction){
    //     //Recupera o id e nome do usuário logado
    //     const usuario_responsavel = req.usuario;

    //     try {
    //         //Recupera todos os relatórios
    //         const relatorios = await prisma.relatorio.findMany({
    //             include:{
    //                 usuario_responsavel:{
    //                     select:{
    //                         nome: true,
    //                         email: true,
    //                         funcao: true,
    //                         avatar: true,
    //                     }
    //                 },
    //                 usuarios_permitidos:{
    //                     select:{
    //                         nome: true,
    //                         email: true,
    //                         funcao: true,
    //                         avatar: true,
    //                     }
    //                 },
    //                 formularios: true,
    //             }
    //         });

    //         //Retorna os relatórios
    //         return res.status(200).json({
    //             message: 'Relatórios listados com sucesso',
    //             relatorios
    //         });
    //     } catch (error) {
    //         logger.error({
    //             message: `Erro ao listar relatórios para o usuário ${usuario_responsavel.nome} (ID: ${usuario_responsavel.id}): ${JSON.stringify(error)}`,
    //         });

    //         return next(error);
    //     }
    // }

    //GET - /relatorio -- Responsável por listar relatórios
    async index(req: Request, res: Response, next: NextFunction) {
        // Recupera o id e nome do usuário logado
        const usuario_responsavel = req.usuario;

        try {
            // Recupera todos os relatórios
            //Recupera todos os relatórios
            const relatorios = await prisma.relatorio.findMany({
                include:{
                    usuario_responsavel:{
                        select:{
                            nome: true,
                            email: true,
                            funcao: true,
                            avatar: true,
                        }
                    },
                    usuarios_permitidos:{
                        select:{
                            nome: true,
                            email: true,
                            funcao: true,
                            avatar: true,
                        }
                    },
                    formularios: {
                        select:{
                            id: true,
                            form1_Cliente_Segurado: true,
                            form2_Caracteristica_Sinistro: true,
                            form3_Cronologia_Sinistro: true,
                            form4_Do_Carregamento: true,
                            form5_Motorista: true,
                            form6_Ajudantes: true,
                            form7_Veiculo_Transportador: true,
                            form8_Orgao_Policial: true,
                            form9_Gerenciamento_Risco_Veiculo: true,
                            form10_Sistemas_Protecao_Carregamento: true,
                            form11_Declaracao_Motorista_Ajudante: true,
                            form12_Gerenciamento_Risco_Deposito: true,
                            form13_Locais_Evento: true,
                            form14_Resumo_Averiguacoes: true,
                            form15_Recuperacao_Carga: true,
                            form16_Anexos_Fotograficos: true,
                            form17_Conclusao: true,
                        },
                        
                    }
                }
            });

            // Filtra os formulários nulos
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            relatorios.forEach((relatorio: any) => {
                Object.keys(relatorio.formularios).forEach((key: string) => {
                    if (relatorio.formularios[key] === null) {
                        delete relatorio.formularios[key];
                    }
                });
            });

            // Retorna os relatórios
            return res.status(200).json({
                message: 'Relatórios listados com sucesso',
                relatorios,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao listar relatórios para o usuário ${usuario_responsavel.nome} (ID: ${usuario_responsavel.id}): ${JSON.stringify(error)}`,
            });

            return next(error);
        }
    }


    //PUT - /relatorio/:id -- Responsável por atualizar relatórios
    // async update (req: Request, res: Response, next: NextFunction){}
}