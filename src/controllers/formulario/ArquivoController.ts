import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import { S3StorageService } from '@/services/s3StorageService';

export class ArquivoController {

    async create(req: Request, res: Response, next: NextFunction) {
        //const usuario_responsavel = req.usuario;
        const { form_id } = req.params;
        const {numero_processo, relatorio_id, form} = req.relatorio;
        
        const file = req.file as Express.MulterS3.File;

        try{
            logger.info({
                message: `Tentativa de upload de arquivo para o processo ${numero_processo} - Formulário ID: ${form_id}.`,
                method: req.method,
                url: req.originalUrl,
            });
            
            // 1 - Verificar se o arquivo foi fornecido
            if (!file) {
                return next(new AppError('Arquivo não fornecido.', 401));
            }

            const arquivo = file;
            const arquivo_nome = arquivo.originalname;
            const arquivo_tamanho = arquivo.size;
            const arquivo_chave = arquivo.key;
            const arquivo_localizacao =  decodeURIComponent(String(arquivo.location));

            // 2 - Registrar o arquivo no banco de dados conforme o formulário nome
            if (form.form_nome === 'form11_Declaracao_Motorista_Ajudante' && form.form_arquivo_campo_nome === 'declaracao_motorista_ajudante') {
                await prisma.form11DeclaracaoMotoristaAjudante.update({
                    where: {
                        id: form_id,
                    },
                    data: {
                        arquivos_declaracoes: {
                            create: {
                                numero_processo,
                                relatorio_id,
                                form_id: form.form_id,
                                form_nome : form.form_nome,
                                form_arquivo_campo_nome: form.form_arquivo_campo_nome,
                                arquivo_nome,
                                arquivo_tamanho,
                                arquivo_chave,
                                arquivo_localizacao,
                            },
                        },
                    },
                });
            } else if (form.form_nome === 'form13_Locais_Evento' && form.form_arquivo_campo_nome === 'fotos_local_da_abordagem') {
                await prisma.form13LocaisEvento.update({
                    where: {
                        id: form_id,
                    },
                    data: {
                        fotos_local_da_abordagem: {
                            create: {
                                numero_processo,
                                relatorio_id,
                                form_id: form.form_id,
                                form_nome : form.form_nome,
                                form_arquivo_campo_nome: form.form_arquivo_campo_nome,
                                arquivo_nome,
                                arquivo_tamanho,
                                arquivo_chave,
                                arquivo_localizacao,
                            },
                        },
                    },
                });
            } else if (form.form_nome === 'form13_Locais_Evento' && form.form_arquivo_campo_nome === 'fotos_local_de_cativeiro_e_abandono_do_motorista') {
                await prisma.form13LocaisEvento.update({
                    where: {
                        id: form_id,
                    },
                    data: {
                        fotos_local_de_cativeiro_e_abandono_do_motorista: {
                            create: {
                                numero_processo,
                                relatorio_id,
                                form_id: form.form_id,
                                form_nome : form.form_nome,
                                form_arquivo_campo_nome: form.form_arquivo_campo_nome,
                                arquivo_nome,
                                arquivo_tamanho,
                                arquivo_chave,
                                arquivo_localizacao,
                            },
                        },
                    },
                });
            }  else if (form.form_nome === 'form13_Locais_Evento' && form.form_arquivo_campo_nome === 'fotos_local_de_encontro_do_veiculo') {
                await prisma.form13LocaisEvento.update({
                    where: {
                        id: form_id,
                    },
                    data: {
                        fotos_local_de_encontro_do_veiculo: {
                            create: {
                                numero_processo,
                                relatorio_id,
                                form_id: form.form_id,
                                form_nome : form.form_nome,
                                form_arquivo_campo_nome: form.form_arquivo_campo_nome,
                                arquivo_nome,
                                arquivo_tamanho,
                                arquivo_chave,
                                arquivo_localizacao,
                            },
                        },
                    },
                });
            } else if (form.form_nome === 'form13_Locais_Evento' && form.form_arquivo_campo_nome === 'fotos_local_de_recuperacao_da_carga') {
                await prisma.form13LocaisEvento.update({
                    where: {
                        id: form_id,
                    },
                    data: {
                        fotos_local_de_recuperacao_da_carga: {
                            create: {
                                numero_processo,
                                relatorio_id,
                                form_id: form.form_id,
                                form_nome : form.form_nome,
                                form_arquivo_campo_nome: form.form_arquivo_campo_nome,
                                arquivo_nome,
                                arquivo_tamanho,
                                arquivo_chave,
                                arquivo_localizacao,
                            },
                        },
                    },
                });
            } else if (form.form_nome === 'form16_Anexos_Fotograficos' && form.form_arquivo_campo_nome === 'anexos_fotograficos') {
                await prisma.form16AnexosFotograficos.update({
                    where: {
                        id: form_id,
                    },
                    data: {
                        anexos_fotograficos: {
                            create: {
                                numero_processo,
                                relatorio_id,
                                form_id: form.form_id,
                                form_nome : form.form_nome,
                                form_arquivo_campo_nome: form.form_arquivo_campo_nome,
                                arquivo_nome,
                                arquivo_tamanho,
                                arquivo_chave,
                                arquivo_localizacao,
                            },
                        },
                    },
                });
            } else {
                return next(new AppError('Formulário não encontrado.', 404));
            }

            logger.info({
                message: `Upload realizado para o processo ${numero_processo} - Formulário ID: ${form_id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 3 - Retorna o arquivo registrado no banco de dados
            return res.status(201).json({
                message: `Arquivo associado no formulário ID: ${form_id}.`,
                data_registro: FormatDate(new Date()),
                arquivos_associados:{
                    form_id: form.form_id,
                    form_nome: form.form_nome,
                    form_arquivo_campo_nome: form.form_arquivo_campo_nome,
                    arquivo_nome,
                    arquivo_tamanho,
                    arquivo_chave,
                    arquivo_localizacao,
                }
            });

        } catch (error) {
            logger.error({
                message: `Erro ao realizar o upload do arquivo para o processo ${numero_processo} - Formulário ID: ${form_id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
         
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const { numero_processo, form_id, arquivo_id} = req.params;

        try {
            // 1 - Verificar se o arquivo existe
            const arquivoExistente = await prisma.arquivo.findUnique({
                where: {
                    id: arquivo_id,
                },
            });

            if (!arquivoExistente) {
                return next(new AppError('Arquivo não encontrado.', 404));
            }

            // 2 - Verificar se o arquivo pertence ao relatório
            if (arquivoExistente.form_id !== form_id) {
                return next(new AppError('Arquivo não pertence ao formulário.', 401));
            }

            // 5 - Obter as key do arquivo registradas no banco de dados
            const arquivoKey = arquivoExistente.arquivo_chave;
       
            // 6 - Excluir o arquivo do S3
            if(arquivoKey){
                await S3StorageService.delete(arquivoKey);

                logger.info({
                    message: `Arquivo ${arquivoKey} excluído com sucesso do Amazon S3.`,
                    method: req.method,
                    url: req.originalUrl,
                });
            }
            
            // 7 - Excluir o arquivo do banco de dados
            await prisma.arquivo.delete({
                where: {
                    id: arquivo_id,
                },
            });

            logger.info({
                message: `Arquivo: ${arquivoExistente.form_nome} excluído do processo: ${numero_processo} referente ao formulário ID: ${form_id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            return res.status(200).json({
                message: `Arquivo: ${arquivoExistente.arquivo_nome} excluído do processo: ${numero_processo} referente ao formulário ID: ${form_id}.`,
            });

        } catch (error) {
          
            logger.error({
                message: `Erro ao deletar arquivo do processo: ${numero_processo} referente ao formulário ID: ${form_id}.`,
                method: req.method
            });

            return next(error);
        }
    }
}


