import { NextFunction, Request, Response } from 'express';

import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import { relatorioSchema } from '@/schemas/RelatorioSchema';
import { Tipo_Formulario } from '@prisma/client';


export class RelatorioController{
    //POST - /relatorio -- Responsável por criar relatórios
    async create (req: Request, res: Response, next: NextFunction){
        const usuario_responsavel = req.usuario;
        const relatorio = relatorioSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação de relatório. Usuário: ${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            //Validação do body da requisição
            // if (!relatorio.numero_processo || !relatorio.cliente || !relatorio.cnpj) {
            //     throw new AppError('Número do processo, cliente e CNPJ são obrigatórios', 400);
            // }
              
            //Validar se o numero do processo já existe
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {
                    numero_processo: relatorio.numero_processo
                }
            });

            if(relatorioExistente){
                throw new AppError('Número do processo já existe', 400);
            }
            
           
            //Cria o relatório
            const criarRelatorio = await prisma.relatorio.create({
                data: {
                    numero_processo: relatorio.numero_processo,
                    cliente: relatorio.cliente,
                    natureza_sinistro: relatorio.natureza_sinistro,
                    cnpj: relatorio.cnpj,
                    usuario_responsavel_id: usuario_responsavel.id,
                    usuarios_permitidos: {
                        connect: relatorio.usuarios_permitidos?.map((usuario_id) => ({
                            id: usuario_id,
                        })),
                    },
                    formularios_selecionados: relatorio.formularios_selecionados,
                    formularios: {
                        create:{
                            numero_processo: relatorio.numero_processo,
                            form1_Cliente_Segurado: relatorio.formularios_selecionados?.includes('form1_Cliente_Segurado') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                    nome_cliente: relatorio.cliente,
                                    cnpj: relatorio.cnpj,
                                },
                            } : undefined,
                            form2_Caracteristica_Sinistro: relatorio.formularios_selecionados?.includes('form2_Caracteristica_Sinistro') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form3_Cronologia_Sinistro: relatorio.formularios_selecionados?.includes('form3_Cronologia_Sinistro') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form4_Do_Carregamento: relatorio.formularios_selecionados?.includes('form4_Do_Carregamento') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form5_Motorista: relatorio.formularios_selecionados?.includes('form5_Motorista') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form6_Ajudantes: relatorio.formularios_selecionados?.includes('form6_Ajudantes') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form7_Veiculo_Transportador: relatorio.formularios_selecionados?.includes('form7_Veiculo_Transportador') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form8_Orgao_Policial: relatorio.formularios_selecionados?.includes('form8_Orgao_Policial') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form9_Gerenciamento_Risco_Veiculo: relatorio.formularios_selecionados?.includes('form9_Gerenciamento_Risco_Veiculo') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form10_Sistemas_Protecao_Carregamento: relatorio.formularios_selecionados?.includes('form10_Sistemas_Protecao_Carregamento') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form11_Declaracao_Motorista_Ajudante: relatorio.formularios_selecionados?.includes('form11_Declaracao_Motorista_Ajudante') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form12_Gerenciamento_Risco_Deposito: relatorio.formularios_selecionados?.includes('form12_Gerenciamento_Risco_Deposito') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form13_Locais_Evento: relatorio.formularios_selecionados?.includes('form13_Locais_Evento') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form14_Resumo_Averiguacoes: relatorio.formularios_selecionados?.includes('form14_Resumo_Averiguacoes') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form15_Recuperacao_Carga: relatorio.formularios_selecionados?.includes('form15_Recuperacao_Carga') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form16_Anexos_Fotograficos: relatorio.formularios_selecionados?.includes('form16_Anexos_Fotograficos') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form17_Conclusao: relatorio.formularios_selecionados?.includes('form17_Conclusao') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                        }, 
                    },
                },
            });

            //Usuário usuarios_permitidos
            const usuariosPermitidos = await prisma.relatorio.findUnique({
                where: {
                    id: criarRelatorio.id,
                },
                select: {
                    usuarios_permitidos: {
                        select: {
                            id: true,
                            nome: true,
                            email: true,
                            avatar: true,
                        },
                    },
                },
            });

            //Usuário usuario_responsavel
            const usuarioResponsavel = await prisma.usuario.findUnique({
                where: {
                    id: criarRelatorio.usuario_responsavel_id,
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    avatar: true,
                },
            });

          
            //Ordenar os formulários selecionados e incluir a etapa de cada formulário
            criarRelatorio.formularios_selecionados.sort((a, b) => {
                const regex = /form(\d+)_/;
                const numA = parseInt(a.match(regex)![1]);
                const numB = parseInt(b.match(regex)![1]);
          
                return numA - numB;
            });

            criarRelatorio.formularios_selecionados = criarRelatorio.formularios_selecionados.map((form, index) => ({
                form: form as Tipo_Formulario,
                etapa: (index + 1).toString(),
            })) as unknown as Array<Tipo_Formulario & { etapa: string }>;


            //Relatorio criado
            const relatorioCriado = {
                id: criarRelatorio.id,
                numero_processo: criarRelatorio.numero_processo,
                cliente: criarRelatorio.cliente,
                cnpj: criarRelatorio.cnpj,
                data_entrada: FormatDate(criarRelatorio.data_entrada),
                status: criarRelatorio.status,
                usuario_responsavel: usuarioResponsavel,
                usuarios_permitidos: usuariosPermitidos?.usuarios_permitidos,
                formularios_selecionados: criarRelatorio.formularios_selecionados,
               
            };

            //Retorna o relatório criado  
            logger.info({
                message: `Relatório criado com sucesso. ID: ${criarRelatorio.id}, Numero do Processo: ${criarRelatorio.numero_processo}, Usuário: ${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            return res.status(201).json({
                message : 'Relatório criado com sucesso',
                relatorioCriado: relatorioCriado
            });

        } catch (error) {
            logger.error({
                message: `Erro ao criar relatório para o usuário ${usuario_responsavel.nome} (ID: ${usuario_responsavel.id}): ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    //GET - /relatorio/:numero_processo? -- Responsável por listar um relatório por numero_processo ou todos os relatórios
    async index(req: Request, res: Response, next: NextFunction) {
      
        const usuario_responsavel = req.usuario;
        const {numero_processo} = req.params;

        try {       
            logger.info({
                message: `Iniciando ação de busca de relatórios. Número do Processo: ${numero_processo}, Usuário: ${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method, 
                url: req.originalUrl
            });

            //Selecionar todos os relatórios
            const todosRelatoriosExistente = await prisma.relatorio.findMany({
                where: {
                    numero_processo: numero_processo ? numero_processo as string : undefined,
                },
                orderBy: {
                    data_emissao: 'desc',
                },
                include:{
                    usuario_responsavel:{
                        select:{
                            id: true,
                            nome: true,
                            email: true,
                            avatar: true,
                        }
                    },

                    usuarios_permitidos:{
                        select:{
                            id: true,
                            nome: true,
                            email: true,
                            avatar: true,
                        }
                    },
                   
                    formularios:{
                        select:{
                            numero_processo: true,
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
                        }
                    },
                },
            });

            // Caso não tiver relatórios cadastrados retorna uma mensagem
            if (todosRelatoriosExistente.length === 0) {
                let message: string = 'Não existe relatório cadastrado';
                if (numero_processo) {
                    message = `Não existe relatório cadastrado com o número do processo ${numero_processo}`;
                }

                logger.info({
                    message: `${message}. Usuário: ${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                    method: req.method, 
                    url: req.originalUrl
                });

                return res.status(404).json({ message });
            }


            //Ordenar os formulários selecionados e incluir a etapa de cada formulário
            todosRelatoriosExistente.forEach((relatorio) => {
                relatorio.formularios_selecionados.sort((a, b) => {
                    const regex = /form(\d+)_/;
                    const numA = parseInt(a.match(regex)![1]);
                    const numB = parseInt(b.match(regex)![1]);
            
                    return numA - numB;
                });
            
                relatorio.formularios_selecionados = relatorio.formularios_selecionados.map((form, index) => ({
                    form: form as Tipo_Formulario,
                    etapa: (index + 1).toString(),
                })) as unknown as Array<Tipo_Formulario & { etapa: string }>;
            });

            // Filtrar os valores nulos
            const relatoriosFiltrados = todosRelatoriosExistente.map(relatorio => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formularioFiltrado: {[key: string]: any} = {};
                for (const key in relatorio.formularios) {
                    if (Object.prototype.hasOwnProperty.call(relatorio.formularios, key)) {
                        const form = relatorio.formularios[key as keyof typeof relatorio.formularios];
                        if (form !== null) {
                            formularioFiltrado[key] = form;
                        }
                    }
                }

                return {
                    id: relatorio.id,
                    numero_processo: relatorio.numero_processo,
                    status: relatorio.status,
                    cliente: relatorio.cliente,
                    cnpj: relatorio.cnpj,
                    data_entrada: relatorio.data_entrada ? FormatDate(relatorio.data_entrada) : null,
                    data_emissao: relatorio.data_emissao ? FormatDate(relatorio.data_emissao) : '00/00/00',
                    usuario_responsavel: relatorio.usuario_responsavel,
                    usuarios_permitidos: relatorio.usuarios_permitidos,
                    formularios_selecionados: relatorio.formularios_selecionados,
                    formularios: formularioFiltrado
                };
            });

            const message: string = numero_processo ? 'Relatório filtrado com sucesso' : 'Relatórios listados com sucesso';
            logger.info({
                message: `${message}. Usuário: ${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method, 
                url: req.originalUrl
            });

            // Retorna a resposta
            return res.status(200).json({
                message : message,
                relatoriosFiltrados: relatoriosFiltrados
            });
          
        } catch (error) {
            logger.error({
                message: `Usuário: ${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}, encontrou um erro ao listar relatórios: ${JSON.stringify(error)}`, 
                method: req.method, 
                url: req.originalUrl
            });
            return next(error);
        }
    }

    //DELETE - /relatorio/:id -- Responsável por deletar relatórios
    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const usuario_responsavel = req.usuario;
        try {
            logger.info({
                message: `Usuário: ${usuario_responsavel.nome} - ID: ${usuario_responsavel.id} iniciando a ação de deletar o relatório com ID: ${id}`,
                method: req.method, 
                url: req.originalUrl
            });
              
            // Recupera o relatório a ser excluído
            const relatorioDeletado = await prisma.relatorio.findUnique({
                where: {
                    id: id,
                },
            });

            // Verifica se o relatório existe
            if (!relatorioDeletado) {
                throw new AppError('Relatório não encontrado', 404);
            }
            
            //Deleta o relatório
            const relatorioExcluido = await prisma.relatorio.delete({
                where: {
                    id: id,
                },
                include: {
                    usuario_responsavel: true,
                    usuarios_permitidos: true,
                    formularios: true,
                },
            });

            return res.status(200).json({
                message: 'Relatório excluído com sucesso',
                relatorio_excluido: relatorioExcluido,
            });
        } catch (error) {
            logger.error({
                message: `Usuário: ${usuario_responsavel.nome} - ID: ${usuario_responsavel.id} encontrou um erro ao deletar o relatório com ID: ${id}. Erro: ${JSON.stringify(error)}`, 
                method: req.method, 
                url: req.originalUrl
            });
            next(new AppError('Erro ao deletar o relatório', 500));
        }
    }
  
    //PUT - /relatorio/:id -- Responsável por atualizar relatórios
    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { id } = req.params;
        const relatorio = relatorioSchema.update.parse(req.body);
  
        try {
            logger.info({
                message: `Iniciando ação de atualização de relatório. Usuário: ${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            //Validação do body da requisição precisa passar pelo menso um campo a ser atualizado
            if (!relatorio.numero_processo && !relatorio.cliente && !relatorio.cnpj && !relatorio.status && !relatorio.usuario_responsavel_id && !relatorio.usuarios_permitidos && !relatorio.formularios_selecionados) {
                throw new AppError('Pelo menos um campo precisa ser atualizado', 400);
            }
  
            // Validar se o relatório existe
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {
                    id: id
                },  
            });
            
  
            if(!relatorioExistente){
                throw new AppError('Relatório não encontrado', 404);
            }
            
            //verificar quais os fomulários existente no relatório
            const formulariosSelecionadosExistente = await prisma.relatorio.findFirst({
                where:{
                    numero_processo: relatorioExistente.numero_processo
                }, 
                select:{
                    formularios_selecionados: true,
                }
            });

            // Verifique se existem formulários selecionados existentes no relatório.
            const formulariosSelecionadosExistentes = formulariosSelecionadosExistente?.formularios_selecionados || [];

            // Mantenha os valores existentes e adicione os novos valores.
            relatorio.formularios_selecionados = [
                ...formulariosSelecionadosExistentes,
                ...(relatorio.formularios_selecionados || []),
            ];


            // Não permitir que o usuário cadastre o mesmo formulário que já existe no relatório.
            const formulariosSelecionadosUnicos = new Set(relatorio.formularios_selecionados);
            if (formulariosSelecionadosUnicos.size !== relatorio.formularios_selecionados?.length) {
                throw new AppError('Não é permitido cadastrar o mesmo formulário mais de uma vez', 400);
            }
           

            ///Atualiza o relatório
            const atualizarRelatorio = await prisma.relatorio.update({
                where: { id: id },
                data: {
                    numero_processo: relatorio.numero_processo,
                    cliente: relatorio.cliente,
                    cnpj: relatorio.cnpj,
                    usuario_responsavel_id: usuario_responsavel.id,
                    usuarios_permitidos: {
                        set: relatorio.usuarios_permitidos?.map((usuario_id) => ({
                            id: usuario_id,
                        })),
                    },
                    formularios_selecionados: relatorio.formularios_selecionados,
                    formularios: {
                        update:{
                            numero_processo: relatorio.numero_processo,
                            form1_Cliente_Segurado: relatorio.formularios_selecionados?.includes('form1_Cliente_Segurado') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                    nome_cliente: relatorio.cliente,
                                    cnpj: relatorio.cnpj,
                                },
                            } : undefined,
                            form2_Caracteristica_Sinistro: relatorio.formularios_selecionados?.includes('form2_Caracteristica_Sinistro') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form3_Cronologia_Sinistro: relatorio.formularios_selecionados?.includes('form3_Cronologia_Sinistro') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form4_Do_Carregamento: relatorio.formularios_selecionados?.includes('form4_Do_Carregamento') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form5_Motorista: relatorio.formularios_selecionados?.includes('form5_Motorista') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form6_Ajudantes: relatorio.formularios_selecionados?.includes('form6_Ajudantes') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form7_Veiculo_Transportador: relatorio.formularios_selecionados?.includes('form7_Veiculo_Transportador') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form8_Orgao_Policial: relatorio.formularios_selecionados?.includes('form8_Orgao_Policial') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form9_Gerenciamento_Risco_Veiculo: relatorio.formularios_selecionados?.includes('form9_Gerenciamento_Risco_Veiculo') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form10_Sistemas_Protecao_Carregamento: relatorio.formularios_selecionados?.includes('form10_Sistemas_Protecao_Carregamento') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form11_Declaracao_Motorista_Ajudante: relatorio.formularios_selecionados?.includes('form11_Declaracao_Motorista_Ajudante') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form12_Gerenciamento_Risco_Deposito: relatorio.formularios_selecionados?.includes('form12_Gerenciamento_Risco_Deposito') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form13_Locais_Evento: relatorio.formularios_selecionados?.includes('form13_Locais_Evento') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form14_Resumo_Averiguacoes: relatorio.formularios_selecionados?.includes('form14_Resumo_Averiguacoes') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form15_Recuperacao_Carga: relatorio.formularios_selecionados?.includes('form15_Recuperacao_Carga') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form16_Anexos_Fotograficos: relatorio.formularios_selecionados?.includes('form16_Anexos_Fotograficos') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                            form17_Conclusao: relatorio.formularios_selecionados?.includes('form17_Conclusao') ? {
                                create:{
                                    numero_processo: relatorio.numero_processo,
                                },
                            } : undefined,
                        }, 
                    },
                },
            });
  
            //Retornar o relatório atualizado
            return res.status(200).json({
                message : 'Relatório atualizado com sucesso',
                relatorioAtualizado : atualizarRelatorio
            });

        } catch (error) {
            logger.error({
                message: `Erro ao atualizar relatório para o usuário ${usuario_responsavel.nome} (ID: ${usuario_responsavel.id}): ${JSON.stringify(error)}`,
            });
  
            return next(error);
        }
    }

}