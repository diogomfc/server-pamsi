import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import {
    form13LocaisEventoSchema,
    Form13LocaisEventoSchemaType,
} from '@/schemas/FormsSchemas/Form13LocaisEventoSchema';

import { Status_Formulario, Tipo_Formulario } from '@prisma/client';
import { S3StorageService } from '@/services/s3StorageService';

export class Form13LocaisEventoController {
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo } = req.params;
        const form13LocaisEventoBody: Form13LocaisEventoSchemaType['create'] = form13LocaisEventoSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação Form13_Locais_Evento no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1 - Verificar se o relatório existe
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {
                    numero_processo,
                },
            });

            if (!relatorioExistente) {
                throw new AppError('Relatório não encontrado.', 404);
            }

            // 2 - Verificar se o Form13LocaisEvento já existe no relatório
            const form13LocaisEventoExistente = await prisma.form13LocaisEvento.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form13LocaisEventoExistente) {
                throw new AppError('Form13_Locais_Evento já existe neste relatório', 409);
            }

            // 3 - Buscar o ID do formulário vinculado ao relatório
            const formularioDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

      
            // 4 - Criar um novo registro de Form13LocaisEvento
            const novoForm13LocaisEvento = await prisma.form13LocaisEvento.create({
                data: {
                    formularioDoRelatorio_id: formularioDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    ...form13LocaisEventoBody,
                },
            });

            // 5. Atualizar o campo "formularios_selecionados" do relatório (adicionando Form13LocaisEvento)
            if (!relatorioExistente.formularios_selecionados?.includes('form13_Locais_Evento')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form13_Locais_Evento',
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

            // 6 - Retornar o Form13LocaisEvento criado
            return res.status(201).json({
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm13LocaisEvento.data_cadastro),
                formulario_registrado: novoForm13LocaisEvento,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao criar Form13_Locais_Evento no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de listagem Form13LocaisEvento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1 - Verificar se o relatório existe pelo relatório_id e número de processo
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {
                    id: relatorio_id,
                    numero_processo,
                },
            });

            if (!relatorioExistente) {
                throw new AppError('Relatório não encontrado.', 404);
            }

            // 2 - Verificar se o Form13_Locais_Evento existe no relatório
            const form13LocaisEventoExistente = await prisma.form13LocaisEvento.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
               
                include:{
                    fotos_local_da_abordagem: true,
                    fotos_local_de_cativeiro_e_abandono_do_motorista: true,
                    fotos_local_de_encontro_do_veiculo: true,
                    fotos_local_de_recuperacao_da_carga: true,
                }
            });


            if (!form13LocaisEventoExistente) {
                throw new AppError('form13_Locais_Evento não encontrado', 404);
            }

          
            // 3 - Verificar quais arquivos associados ao Form13_Locais_Evento
            const arquivosExistentes = await prisma.arquivo.findMany({
                where: {
                    form_id: form13LocaisEventoExistente?.id,
                },
            });

            if (!arquivosExistentes){
                throw new AppError('Arquivos não encontrados', 404);
            }

            // 4 - incluir na listagem do form13LocaisEventoExistente os arquivos encontrados
            form13LocaisEventoExistente.fotos_local_da_abordagem = arquivosExistentes
                .filter((arquivo) => arquivo.form_arquivo_campo_nome === 'fotos_local_da_abordagem') ;
             
            form13LocaisEventoExistente.fotos_local_de_cativeiro_e_abandono_do_motorista = arquivosExistentes
                .filter((arquivo) => arquivo.form_arquivo_campo_nome === 'fotos_local_de_cativeiro_e_abandono_do_motorista');
                
            form13LocaisEventoExistente.fotos_local_de_encontro_do_veiculo = arquivosExistentes
                .filter((arquivo) => arquivo.form_arquivo_campo_nome === 'fotos_local_de_encontro_do_veiculo');
               
            form13LocaisEventoExistente.fotos_local_de_recuperacao_da_carga = arquivosExistentes
                .filter((arquivo) => arquivo.form_arquivo_campo_nome === 'fotos_local_de_recuperacao_da_carga');
               
            
            logger.info({
                message: `Listagem form13_Locais_Evento realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // Retornar o Form13LocaisEvento
            return res.status(200).json({
                message: 'Formulário localizado.',
                data_registro: FormatDate(form13LocaisEventoExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_localizado:{
                    ...form13LocaisEventoExistente,
                    fotos_local_da_abordagem: form13LocaisEventoExistente.fotos_local_da_abordagem
                        .map((arquivo) => ({
                            id: arquivo.id,
                            arquivo_nome: arquivo.arquivo_nome,
                            arquivo_localizacao: arquivo.arquivo_localizacao,
                        })),
            
                    fotos_local_de_cativeiro_e_abandono_do_motorista: form13LocaisEventoExistente.fotos_local_de_cativeiro_e_abandono_do_motorista
                        .map((arquivo) => ({
                            id: arquivo.id,
                            arquivo_nome: arquivo.arquivo_nome,
                            arquivo_localizacao: arquivo.arquivo_localizacao,
                        })),
                    fotos_local_de_encontro_do_veiculo: form13LocaisEventoExistente.fotos_local_de_encontro_do_veiculo
                        .map((arquivo) => ({
                            id: arquivo.id,
                            arquivo_nome: arquivo.arquivo_nome,
                            arquivo_localizacao: arquivo.arquivo_localizacao,
                        })),
                    fotos_local_de_recuperacao_da_carga: form13LocaisEventoExistente.fotos_local_de_recuperacao_da_carga
                        .map((arquivo) => ({
                            id: arquivo.id,
                            arquivo_nome: arquivo.arquivo_nome,
                            arquivo_localizacao: arquivo.arquivo_localizacao,
                        })),
                },
            });

        } catch (error) {
            logger.error({
                message: `Erro ao localizar o Form13LocaisEvento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form13LocaisEventoBody: Form13LocaisEventoSchemaType['update'] = form13LocaisEventoSchema.update.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de atualização Form13LocaisEvento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // Verificar se o relatório existe pelo relatório_id e número de processo
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {
                    id: relatorio_id,
                    numero_processo,
                },
            });

            if (!relatorioExistente) {
                throw new AppError('Relatório não encontrado', 404);
            }

            // Verificar se o Form13LocaisEvento existe no relatório
            const form13LocaisEventoExistente = await prisma.form13LocaisEvento.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form13LocaisEventoExistente) {
                throw new AppError('Form13LocaisEvento não encontrado.', 404);
            }

            // Atualizar o registro de Form13LocaisEvento
            const form13LocaisEventoAtualizado = await prisma.form13LocaisEvento.update({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
                data: {
                    status: Status_Formulario.Formalizando,
                    ...form13LocaisEventoBody,
                },
            });

            logger.info({
                message: `Atualização Form13LocaisEvento realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // Retornar o Form13LocaisEvento atualizado
            return res.status(200).json({
                message: 'Atualização realizada com sucesso.',
                data_registro: FormatDate(form13LocaisEventoAtualizado.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_atualizado: form13LocaisEventoAtualizado,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao atualizar Form13LocaisEvento. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
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
                message: `Iniciando ação de exclusão Form13LocaisEvento no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1 - Verificar se o relatório existe
            const relatorioExistente = await prisma.relatorio.findFirst({
                where: {
                    numero_processo,
                    id: relatorio_id,
                },
            });

            if (!relatorioExistente) {
                throw new AppError('Relatório não encontrado.', 404);
            }

            // 2 - Verificar se o Form13LocaisEvento já existe no relatório
            const form13LocaisEventoExistente = await prisma.form13LocaisEvento.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form13LocaisEventoExistente) {
                throw new AppError('Form13LocaisEvento não encontrado neste relatório', 404);
            }

            // 3 - Localizar todos os arquivos vinculados
            const arquivosExistente = await prisma.arquivo.findMany({
                where: {
                    form_id: form13LocaisEventoExistente.id,
                },
            });

            // 4 - Excluir da S3 todos os arquivos cujas keys existem em arquivosExistente
            if (arquivosExistente.length > 0) {
                arquivosExistente.forEach(async (arquivo) => {
                    await S3StorageService.delete(arquivo.arquivo_chave);
                });

                logger.info({
                    message: `Arquivos ${arquivosExistente.map(arquivo => arquivo.id)} excluídos com sucesso do Amazon S3.`,
                    method: req.method,
                    url: req.originalUrl,
                });
            }

            // 5 - Excluir o registro de Form13LocaisEvento
            await prisma.form13LocaisEvento.delete({
                where: {
                    numero_processo,
                },
            });

            // 6 - Excluir qualquer arquivo vinculado ao form
            await prisma.arquivo.deleteMany({
                where: {
                    form_id: form13LocaisEventoExistente.id,
                },
            });

            // 7 - Atualizar o campo "formularios_selecionados" do relatório (removendo Form13LocaisEvento)
            if (relatorioExistente.formularios_selecionados?.includes('form13_Locais_Evento')) {
                const formulariosSelecionados = relatorioExistente.formularios_selecionados?.filter((formulario) => formulario !== 'form13_Locais_Evento');

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
                message: `Exclusão de Form13LocaisEvento no relatório realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 8 - Retornar mensagem de sucesso
            return res.status(200).json({
                message: 'Formulário excluído do relatório',
                data_registro: FormatDate(form13LocaisEventoExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao excluir Form13LocaisEvento no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
}
