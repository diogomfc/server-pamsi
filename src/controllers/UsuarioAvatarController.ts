import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';
import { LocalStorage } from '@/providers/LocalStorageProvider';


export class UsuarioAvatarController {
    //PATCH - Controller para criar um novo usuário
    async create(req: Request, res: Response, next: NextFunction) {
        
        const avatarPath = req.file?.path as string;
        const avatarFilename = req.file?.filename as string;
        const armazenamentoDisco = new LocalStorage();

        //buscar o usuário autenticado
        const usuarioAutenticado = req.usuario;
      
        try {
            if (!avatarFilename) {
                return next(new AppError('Arquivo de avatar não fornecido.', 401));
            }
            try {
                const avatarNovo = await armazenamentoDisco.saveFile(avatarFilename);
                const usuario = await prisma.usuario.findUnique({
                    where: {
                        id:  usuarioAutenticado.id,
                    },
                });
  
                let logMessage = '';

                // Se o usuário já possui um avatar, remova o avatar antigo do armazenamento no disco
                if (usuario && usuario.avatar) {

                    const avatarAntigo = usuario.avatar;
                    await armazenamentoDisco.deleteFile(avatarAntigo);
                    
                    logMessage = `Avatar do usuário ${usuario.nome} - ID: ${usuario.id} atualizado com sucesso.`;
                } else {
                    logMessage = `Avatar adicionado ao usuário ${usuario?.nome} - ID: ${usuario?.id}.`;
                }
  
                // Atualize o usuário com o caminho do novo arquivo de avatar
                const usuarioAtualizado = await prisma.usuario.update({
                    where: {
                        id:  usuarioAutenticado.id,
                    },
                    data: {
                        avatar: avatarNovo,
                    },
                });
  
                const usuarioComDataFormatada = {
                    ...usuarioAtualizado,
                    senha_hash: undefined,
                    criado_em: FormatDate(usuarioAtualizado.criado_em),
                };
  
                logger.info({
                    message: logMessage,
                    method: req.method,
                    url: req.originalUrl,
                });
  
                return res.json(usuarioComDataFormatada);
            } catch (error) {
                // Se ocorrer um erro, remova o arquivo do diretório temporário
                await localStorage.deleteFile(avatarPath);
  
                logger.error({
                    message: `Erro ao atualizar o usuário. Detalhes do erro: ${JSON.stringify(error)}.`,
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
  
    //DELETE - Controller para excluir o avatar do usuário
    async delete(req: Request, res: Response, next: NextFunction) {

        const armazenamentoDisco = new LocalStorage();
        const usuarioAutenticado = req.usuario;
      
        try {
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: usuarioAutenticado.id,
                },
            });

            if (!usuario || !usuario.avatar) {
                logger.error({
                    message: `Não foi possível encontrar o usuário ou o usuário não possui um avatar. Usuário: ${usuarioAutenticado.nome} - ID: ${usuarioAutenticado.id}.`,
                    method: req.method,
                    url: req.originalUrl,
                });
            
                return next(new AppError('O usuário não possui um avatar para excluir.', 404));
            }
            // Remover o avatar do armazenamento no disco
            await armazenamentoDisco.deleteFile(usuario.avatar);

            // Atualizar o usuário no banco de dados para remover o avatar
            const usuarioAtualizado = await prisma.usuario.update({
                where: {
                    id: usuarioAutenticado.id,
                },
                data: {
                    avatar: null, // Removendo o caminho do arquivo de avatar
                },
            });

            logger.info({
                message: `Avatar excluído com sucesso. Usuário: ${usuario.nome} - ID: ${usuario.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            const usuarioComDataFormatada = {
                ...usuarioAtualizado,
                senha_hash: undefined,
                criado_em: FormatDate(usuarioAtualizado.criado_em),
            };

            return res.json(usuarioComDataFormatada);
        } catch (error) {
            logger.error({
                message: `Erro ao excluir o avatar. Usuário: ${usuarioAutenticado.nome} - ID: ${usuarioAutenticado.id}. Detalhes do erro: ${JSON.stringify(error)}.`,
                method: req.method,
                url: req.originalUrl,
            });
            return next(error);
        }
    }
}
