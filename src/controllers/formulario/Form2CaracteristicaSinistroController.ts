import { NextFunction, Request, Response } from 'express';
import { prisma } from '@/database';
import { Status_Formulario, Tipo_Formulario} from '@prisma/client';

import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { FormatDate } from '@/utils/DateUtils';

import { 
    Form2CaracteristicaSinistroSchemaType, 
    form2CaracteristicaSinistroSchema 
} from '@/schemas/FormsSchemas/Form2CaracteristicaSinistroSchema';


export class Form2CaracteristicaSinistroController {
    // POST - /form2-caracteristica-sinistro/:numero_processo/:relatorio_id
    async create(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form2CaracteristicaSinistroBody: Form2CaracteristicaSinistroSchemaType['create'] = form2CaracteristicaSinistroSchema.create.parse(req.body);

        try {
            logger.info({
                message: `Iniciando ação de criação form2_Caracteristica_Sinistro no relatório. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
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

            // 2 - Verificar se o form2_Caracteristica_Sinistro já existe no relatório
            const form2CaracteristicaSinistroExistente = await prisma.form2CaracteristicaSinistro.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (form2CaracteristicaSinistroExistente) {
                throw new AppError('form2_Caracteristica_Sinistro já existe neste relatório', 409);
            }

            // 3 - Buscar numero do formulariosDoRelatorio_id vinculado ao relatório
            const formulariosDoRelatorioVinculado = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            // 4 - Criar um novo registro de form2-caracteristica-sinistro na tabela form2CaracteristicaSinistro
            const novoForm2CaracteristicaSinistro = await prisma.form2CaracteristicaSinistro.create({
                data: {
                    formularioDoRelatorio_id: formulariosDoRelatorioVinculado?.id,
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Formalizando,
                    natureza_sinistro: relatorioExistente.natureza_sinistro,
                    ...form2CaracteristicaSinistroBody,
                },
            });


            // 5 - Atualizar o campo "formularios_selecionados" do relatório (adicionando form2_Caracteristica_Sinistro)
            if (!relatorioExistente.formularios_selecionados?.includes('form2_Caracteristica_Sinistro')) {
                const updatedFormulariosSelecionados = [
                    ...relatorioExistente.formularios_selecionados ?? [],
                    'form2_Caracteristica_Sinistro',
                ] as Tipo_Formulario[];

                await prisma.relatorio.update({
                    where: {
                        numero_processo: novoForm2CaracteristicaSinistro.numero_processo,
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
                message: 'Registro realizado com sucesso.',
                data_registro: FormatDate(novoForm2CaracteristicaSinistro.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_registrado: novoForm2CaracteristicaSinistro,
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
    // GET - /form2-caracteristica-sinistro/:numero_processo/:relatorio_id
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
            const form2CaracteristicaSinistroExistente = await prisma.form2CaracteristicaSinistro.findFirst({
                where: {
                    numero_processo: relatorioExistente.numero_processo,
                },
            });

            if (!form2CaracteristicaSinistroExistente) {
                throw new AppError('form2_Caracteristica_Sinistro não encontrado.', 404);
            }
        
            logger.info({
                message: `Listagem form2_Caracteristica_Sinistro realizada com sucesso. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}.`,
                method: req.method,
                url: req.originalUrl,
            });   
            // 4 - Retornar o form2_Caracteristica_Sinistro
            return res.status(200).json({
                message: 'Formulario localizado.',
                data_registro: FormatDate(form2CaracteristicaSinistroExistente.data_cadastro),
                relatorio_id: relatorio_id,
                formulario_localizado: form2CaracteristicaSinistroExistente,
            });
        } catch (error) {
            logger.error({
                message: `Erro ao localizar o form2_Caracteristica_Sinistro. Usuario:${usuario_responsavel.nome} - ID: ${usuario_responsavel.id}. Erro: ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });
            return next(error);
        }
    }
    // PUT - /form2-caracteristica-sinistro/:numero_processo/:relatorio_id
    async update(req: Request, res: Response, next: NextFunction) {
        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form2CaracteristicaSinistroBody: Form2CaracteristicaSinistroSchemaType['update'] = form2CaracteristicaSinistroSchema.update.parse(req.body);

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

            // 3 - Atualizar o registro de form2_Caracteristica_Sinistro
            if (form2CaracteristicaSinistroExistente) {
                const form2CaracteristicaSinistroAtualizado = await prisma.form2CaracteristicaSinistro.update({
                    where: {
                        numero_processo: relatorioExistente.numero_processo,
                    },
                    data: {
                        status: Status_Formulario.Formalizando,
                        natureza_sinistro: relatorioExistente.natureza_sinistro,
                        ...form2CaracteristicaSinistroBody,
                    }
                });
                return res.status(200).json({
                    message: 'Formulario atualizado com sucesso.',
                    data_registro: FormatDate(form2CaracteristicaSinistroAtualizado.data_cadastro),
                    relatorio_id: relatorio_id,
                    formulario_atualizado: form2CaracteristicaSinistroAtualizado,
                });
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
    // DELETE - /form2-caracteristica-sinistro/:numero_processo/:relatorio_id
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
                        id: relatorio_id,
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
                message: 'Etapa excluída do relatório',
                data_registro: FormatDate(form2CaracteristicaSinistroExistente.data_cadastro),
                data_exclusao: FormatDate(new Date()),
                relatorio_id: relatorio_id,
                formulario_excluido: form2CaracteristicaSinistroExistente,
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

