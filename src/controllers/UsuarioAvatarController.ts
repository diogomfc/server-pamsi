import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';
import { LocalStorage } from '@/providers/LocalStorageProvider';
import path from 'path';

export class UsuarioAvatarController {
   
    //PATCH - Controller para criar um novo usuário
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const arquivoAvatar = req.file?.filename as string;
  
            if (!arquivoAvatar) {
                logger.error({
                    message: 'Arquivo de avatar não fornecido.',
                });
                return next(new AppError('Arquivo de avatar não fornecido.', 401));
            }
  
            const localStorage = new LocalStorage();
  
            try {
                const arquivoAvatarBaseNome = path.basename(arquivoAvatar);
                const filename = await localStorage.saveFile(arquivoAvatarBaseNome);
  
                const usuario = await prisma.usuario.findUnique({
                    where: {
                        id: req.usuario.id,
                    },
                });
  
                let logMessage = '';
  
                if (usuario && usuario.avatar) {
                    // Se o usuário já possui um avatar, remova o avatar antigo do armazenamento no disco
                    const avatarAntigo = path.basename(usuario.avatar);
                    await localStorage.deleteFile(avatarAntigo);
                    logMessage = `Avatar do usuário ${usuario.nome} (ID: ${usuario.id}) atualizado com sucesso.`;
                } else {
                    logMessage = `Avatar adicionado ao usuário ${usuario?.nome} (ID: ${usuario?.id}).`;
                }
  
                // Atualize o usuário com o caminho do novo arquivo de avatar
                const usuarioAtualizado = await prisma.usuario.update({
                    where: {
                        id: req.usuario.id,
                    },
                    data: {
                        avatar: filename,
                    },
                });
  
                const usuarioComDataFormatada = {
                    ...usuarioAtualizado,
                    senha_hash: undefined,
                    criado_em: FormatDate(usuarioAtualizado.criado_em),
                };
  
                logger.info({
                    message: logMessage,
                });
  
                return res.json(usuarioComDataFormatada);
            } catch (error) {
                // Se ocorrer um erro, remova o arquivo do diretório temporário
                await localStorage.deleteFile(req.file?.path as string);
  
                logger.error({
                    message: `Erro ao atualizar o usuário: ${JSON.stringify(error)}`,
                });
  
                return next(error);
            }
        } catch (error) {
            logger.error({
                message: `Erro ao processar a solicitação: ${JSON.stringify(error)}`,
            });
  
            return next(error);
        }
    }
  
    //DELETE - Controller para excluir o avatar do usuário
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario_id = req.usuario.id;

            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: usuario_id,
                },
            });

            if (!usuario || !usuario.avatar) {
                logger.error({
                    message: `Usuário ${usuario_id} não possui um avatar para excluir.`,
                });
                return next(new AppError('O usuário não possui um avatar para excluir.', 404));
            }

            // Extrair o nome do arquivo do avatar
            const avatarAntigo = path.basename(usuario.avatar);

            // Instanciar o provider de armazenamento em disco
            const localStorage = new LocalStorage();

            // Remover o avatar do armazenamento no disco
            await localStorage.deleteFile(avatarAntigo);

            // Atualizar o usuário no banco de dados para remover o avatar
            const usuarioAtualizado = await prisma.usuario.update({
                where: {
                    id: usuario_id,
                },
                data: {
                    avatar: null, // Removendo o caminho do arquivo de avatar
                },
            });

            logger.info({
                message: `Avatar do usuário ${usuario.nome} (ID: ${usuario.id}) excluído com sucesso.`,
            });

            const usuarioComDataFormatada = {
                ...usuarioAtualizado,
                senha_hash: undefined,
                criado_em: FormatDate(usuarioAtualizado.criado_em),
            };

            return res.json(usuarioComDataFormatada);
        } catch (error) {
            logger.error({
                message: `Erro ao excluir o avatar do usuário: ${JSON.stringify(error)}`,
            });

            return next(error);
        }
    }
}
