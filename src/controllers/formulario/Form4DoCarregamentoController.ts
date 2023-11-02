import { NextFunction, Request, Response } from 'express';
import { prisma } from '@/database';
import { Status_Formulario, Tipo_Formulario} from '@prisma/client';

import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { FormatDate } from '@/utils/DateUtils';

import { 
    Form4DoCarregamentoCreateSchemaType, 
    form4DoCarregamentoSchema 
} from '@/schemas/FormsSchemas/Form4DoCarregamentoSchema';


export class Form4DoCarregamentoController {
    // POST - /form4-do-carregamento
    async create(req: Request, res: Response, next: NextFunction) {

        const usuario_responsavel = req.usuario;
        const { numero_processo, relatorio_id } = req.params;
        const form4Data: Form4DoCarregamentoCreateSchemaType = form4DoCarregamentoSchema.create.parse(req.body);
    
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
             
            // 2 - Verificar se o form2_Caracteristica_Sinistro já existe no relatório
            const form4DoCarregamentoExistente = await prisma.form4DoCarregamento.findFirst({
                where: {
                    numero_processo,
                },
            });

            if (form4DoCarregamentoExistente) {
                throw new AppError('Form4_Do_Carregamento já existe neste relatório.', 409);
            }

            // 3 - Buscar numero do formulariosDoRelatorio_id vinculado ao relatório
            const formulariosDoRelatorio = await prisma.formulariosDoRelatorio.findFirst({
                where: {
                    numero_processo
                },
            });

            // 4 - Criar um novo registro de form4_Do_Carregamento no banco de dados
            const novoForm4DoCarregamento = await prisma.form4DoCarregamento.create({
                data: {
                    numero_processo: relatorioExistente.numero_processo,
                    status: Status_Formulario.Finalizado,
                    ...form4Data,
                    formulariosDoRelatorio_id: formulariosDoRelatorio?.id,
                   
                },
            });

            const novoRegistro = {
                ...novoForm4DoCarregamento,
                data_cadastro: FormatDate(novoForm4DoCarregamento.data_cadastro),
            };

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

            // 6 - Retornar o form2CaracteristicaSinistro criado
            return res.status(201).json({
                message: 'Cadastro realizado com sucesso.',
                form4DoCarregamentoSchema: novoRegistro,
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

    // GET - /form4-do-carregamento/:id
    // async show(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     const id = req.params.id;

    //     // Your show logic here

    //     res.status(200).json({ message: 'Retrieved successfully', data: /* Your retrieved data */ });
    //   } catch (error) {
    //     next(error);
    //   }
    // }

    // PUT - /form4-do-carregamento/:id
    // async update(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     const id = req.params.id;
    //     const updatedData: Form4DoCarregamentoCreateSchemaType = Form4DoCarregamentoCreateSchema.parse(req.body);

    //     // Your update logic here

    //     res.status(200).json({ message: 'Updated successfully', data: updatedData });
    //   } catch (error) {
    //     next(error);
    //   }
    // }

    // DELETE - /form4-do-carregamento/:id
    // async delete(req: Request, res: Response, next: NextFunction) {
    //   try {
    //     const id = req.params.id;

    //     // Your delete logic here

    //     res.status(200).json({ message: 'Deleted successfully' });
    //   } catch (error) {
    //     next(error);
    //   }
    // }
}
