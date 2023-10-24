import { Request, Response } from 'express';

import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';
import { LocalStorage } from '@/providers/LocalStorageProvider';

export class UsuarioAvatarController {
    async create(req: Request, res: Response): Promise<Response> {
        //Receber o arquivo de avatar imagem
        const arquivoAvatar = req.file?.filename as string;
     
        //Verificar se o arquivo de avatar imagem foi fornecido
        if (!arquivoAvatar) {
            throw new AppError('Arquivo de avatar não fornecido.', 401);
        }

        //Instanciar o provider de armazenamento em disco
        const localStorage = new LocalStorage();

        try {
            //Salvar o arquivo no disco
            const filename = await localStorage.saveFile(arquivoAvatar);

            //Atualizar o usuário com o caminho do arquivo de avatar imagem
            const usuario = await prisma.usuario.update({
                where: {
                    id: req.usuario.id
                },
                data: {
                    avatar: filename,
                }
            });

            //Formatar a data de criação do usuário
            const usuarioComDataFormatada = {
                ...usuario,
                criado_em: FormatDate(usuario.criado_em)
            };

            logger.info({
                message: `Usuário ${usuario.nome} (ID: ${usuario.id}) atualizado com sucesso.`,
            });
          
            //Retornar os dados do usuário atualizado
            return res.json(usuarioComDataFormatada);

        } catch (error) {
            // Se ocorrer um erro, remova o arquivo do diretório temporário
            await localStorage.deleteFile(req.file?.path as string);

            if (error instanceof Error) {
                logger.error({
                    message: `Erro ao atualizar usuário: ${error.message}`,
                });
            }

            throw error;
        }
    }
}

