import { NextFunction, Request, Response, RequestHandler } from 'express';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { FuncaoUsuario } from '@prisma/client';

export function permicaoParaAcesso(funcao: FuncaoUsuario[]): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { funcao: funcaoUsuario } = req.usuario;

        if (!funcao.includes(funcaoUsuario)) {
            logger.info({
                message: `Tentativa de acesso não autorizado: Usuário ${req.usuario.nome} (${req.usuario.id}) com função ${req.usuario.funcao} tentou acessar o recurso ${req.url}.`,
            });
            throw new AppError('Usuário não possui permissão para acessar este recurso.', 403);
        }

        logger.info({
            message: `Acesso autorizado: Usuário ${req.usuario.nome} (${req.usuario.id}) com função ${req.usuario.funcao} acessou o recurso ${req.url}.`,
        });

        return next();
    };
}
