import { NextFunction, Request, Response } from 'express';
//import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
//import { prisma } from '@/database';
import { S3StorageService } from '@/services/S3StorageService';
import { prisma } from '@/database';
import { Tipo_Formulario } from '@/database';

interface FileMulter extends Express.Multer.File {
  key: string;
  location: string;
}

export class FormFilesController {
  
    // PATCH - /formfiles/upload - Controller para fazer upload de arquivo para formulário
    async create(req: Request, res: Response, next: NextFunction) {
        
        const usuario_responsavel = req.usuario;
        const { numero_processo, form_nome } = req.params;
        const anexosFotograficos = req.files as FileMulter[];

        try{

            logger.info({
                message:`Tentativa de upload de arquivo para formulário: ${form_nome}`,
                method: req.method,
                url: req.originalUrl,
            });


            // 1 - Verificar se o arquivo foi fornecido
            if (!anexosFotograficos) {
                return next(new AppError('Arquivo não fornecido.', 401));
            }

            try{
                // 2 - Salve o arquivo no armazenamento na aws3
                const fileKey = anexosFotograficos[0].key;
                const fileLocation = anexosFotograficos[0].location;
                const fileUrl = anexosFotograficos[0].location;
                const fileNome = anexosFotograficos[0].originalname;
                const fileMimetype = anexosFotograficos[0].mimetype;
                const fileTamanho = anexosFotograficos[0].size;
                const fileExtensao = anexosFotograficos[0].originalname.split('.').pop();
                const fileFormulario = form_nome as Tipo_Formulario;
                const fileNumeroProcesso = numero_processo;
                

            } catch (error) {
                logger.error({
                    message: `Erro ao processar a solicitação. Detalhes do erro: ${JSON.stringify(error)}.`,
                    method: req.method,
                    url: req.originalUrl,
                });

                return next(error);
            }




        } catch (error) {
            logger.error({
                message: `Erro ao processar a solicitação. Detalhes do erro: ${JSON.stringify(error)}.`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }
     






    // PATCH - /formfiles/upload - Controller para fazer upload de arquivo para formulário
    // async upload(req: Request, res: Response, next: NextFunction) {

    //     const usuario_responsavel = req.usuario;
    //     const { numero_processo, form_nome } = req.params;
    //     const anexosFotograficos = req.files as FileMulter[];

    //     try {
    //         logger.info({
    //             message:`Tentativa de upload de arquivo para formulário: ${form_id}`,
    //             method: req.method,
    //             url: req.originalUrl,
    //         });

    //         // 1 - Verificar se o relatório existe pelo numero de processo
    //         const relatorioExistente = await prisma.relatorio.findFirst({
    //             where: {
    //                 numero_processo,
    //             },
    //         });

    //         if (!relatorioExistente) {
    //             throw new AppError('Relatório não encontrado.', 404);
    //         }

    //         // 2 - Verificar se o form_nome já existe no relatório
    //         if (relatorioExistente.formularios_selecionados?.includes(form_nome as Tipo_Formulario)) {
    //             //
    //         } else {
    //             throw new AppError('Formulário não encontrado.', 404);
    //         }
               
            



    //     } catch (error) {
    //         logger.error({
    //             message: `Erro ao processar a solicitação. Detalhes do erro: ${JSON.stringify(error)}.`,
    //             method: req.method,
    //             url: req.originalUrl,
    //         });

    //         return next(error);
    //     }
    // }

    // DELETE - /formfiles/delete/:fileKey - Controller para deletar um arquivo de formulário
    // async delete(req: Request, res: Response, next: NextFunction) {
    //     const fileKey = req.params.fileKey;

    //     try {
    //         logger.info({
    //             message: `Tentativa de exclusão de arquivo de formulário: ${fileKey}.`,
    //             method: req.method,
    //             url: req.originalUrl,
    //         });

    //         // Verificar se o arquivo existe
    //         // Realizar operações adicionais, se necessário

    //         // Exemplo: Atualizar no banco de dados

    //         // Deletar o arquivo do S3
    //         await S3StorageService.deleteFileFromS3(fileKey);

    //         logger.info({
    //             message: `Arquivo excluído com sucesso: ${fileKey}`,
    //             method: req.method,
    //             url: req.originalUrl,
    //         });

    //         // Retornar resposta
    //         return res.json({ message: 'Arquivo excluído com sucesso.' });

    //     } catch (error) {
    //         logger.error({
    //             message: `Erro ao excluir o arquivo. Detalhes do erro: ${JSON.stringify(error)}.`,
    //             method: req.method,
    //             url: req.originalUrl,
    //         });

    //         return next(error);
    //     }
    // }
}
