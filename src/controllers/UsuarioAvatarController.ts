import { NextFunction, Request, Response } from 'express';
import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';
import { LocalStorage } from '@/providers/LocalStorageProvider';


export class UsuarioAvatarController {
    //PATCH - /usuarios/avatar - Controller para atualizar o avatar do usuário
    async create(req: Request, res: Response, next: NextFunction) {
        
        const avatarPath = req.file?.path as string;
        const avatarFilename = req.file?.filename as string;
        const armazenamentoDisco = new LocalStorage();
        const usuarioAutenticado = req.usuario;
      
        try {
            logger.info({
                message: `Tentativa de atualização do avatar do usuário ${usuarioAutenticado.nome} - ID: ${usuarioAutenticado.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
            
            // 1 - Verificar se o arquivo de avatar foi fornecido
            if (!avatarFilename) {
                return next(new AppError('Arquivo de avatar não fornecido.', 401));
            }

            try {
                // 2 - Salve o arquivo no armazenamento local
                const avatarNovo = await armazenamentoDisco.saveFile(avatarFilename);

                // 3 - Verifica se o usuário existe
                const usuario = await prisma.usuario.findUnique({
                    where: {
                        id:  usuarioAutenticado.id,
                    },
                });
  
                let logMessage = '';

                // 4 - Se o usuário já tiver um avatar, exclua o avatar antigo
                if (usuario && usuario.avatar) {

                    const avatarAntigo = usuario.avatar;
                    await armazenamentoDisco.deleteFile(avatarAntigo);
                    
                    logMessage = `Avatar do usuário ${usuario.nome} - ID: ${usuario.id} atualizado com sucesso.`;
                } else {
                    logMessage = `Avatar adicionado ao usuário ${usuario?.nome} - ID: ${usuario?.id}.`;
                }
  
                // 5 - Atualize o usuário no banco de dados com o caminho do novo arquivo de avatar
                const usuarioAtualizado = await prisma.usuario.update({
                    where: {
                        id:  usuarioAutenticado.id,
                    },
                    data: {
                        avatar: avatarNovo,
                    },
                });
                
                // 6 - Retorne o usuário atualizado com a data formatada
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
                
                // 7 - Retorne o usuário atualizado
                return res.json(usuarioComDataFormatada);
                
            } catch (error) {
                // 8 - Se houver um erro, exclua o arquivo de avatar do armazenamento local
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
  
    //DELETE - /usuarios/avatar - Controller para deletar o avatar do usuário
    async delete(req: Request, res: Response, next: NextFunction) {
        const armazenamentoDisco = new LocalStorage();
        const usuarioAutenticado = req.usuario;
      
        try {
           
            logger.info({
                message: `Tentativa de exclusão do avatar do usuário ${usuarioAutenticado.nome} - ID: ${usuarioAutenticado.id}.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 1 - Verificar se o relatório existe
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: usuarioAutenticado.id,
                },
            });

            // 2 - Se o usuário não existir ou não tiver um avatar, retorne um erro e excluir o avatar do armazenamento local
            if (!usuario || !usuario.avatar) {
                return next(new AppError('O usuário não possui um avatar para excluir.', 404));
            }
            await armazenamentoDisco.deleteFile(usuario.avatar);

            // 3 - Atualize o usuário no banco de dados com o caminho do novo arquivo de avatar
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
            
            // 4 - Retorne o usuário atualizado com a data formatada
            const usuarioComDataFormatada = {
                ...usuarioAtualizado,
                senha_hash: undefined,
                criado_em: FormatDate(usuarioAtualizado.criado_em),
            };

            // 5 - Retorne o usuário atualizado
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
