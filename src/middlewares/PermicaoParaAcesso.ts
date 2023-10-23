import { NextFunction, Request, Response, RequestHandler} from 'express';

import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';

import { FuncaoUsuario } from '@prisma/client';

export function permicaoParaAcesso(funcao: FuncaoUsuario[]): RequestHandler{
    return async (request: Request, response: Response, next: NextFunction) => {
        const { funcao: funcaoUsuario } = request.usuario;

        if(!funcao.includes(funcaoUsuario)){
            throw new AppError('Usuário não possui permissão para acessar este recurso.', 403);
        }

        logger.info({
            message: `Usuário ${request.usuario.nome} acessou o recurso ${request.url}.`,
            executor: request.usuario.nome
        });
        return next();
    };
}