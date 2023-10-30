import { NextFunction, Request, Response} from 'express';
import { verify, JwtPayload } from 'jsonwebtoken'; 

import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { env } from '@/env';

export function verificarAutenticacao(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;
    

    if(!authHeader){
        throw new AppError('Token de acesso não informado.', 401);
    }

    const [, token] = authHeader.split(' ');
    try {
        const decodedToken = verify(token, env.JWT_SECRET) as JwtPayload;

        const {sub: id, nome, email, funcao, avatar } = decodedToken;
       
        if (typeof id !== 'string' || !funcao) {
            throw new AppError('Token de acesso inválido.', 401);
        }

        req.usuario = {
            id,
            nome,
            email,
            avatar,
            funcao,
        };
        
        logger.info({
            message: `Autenticação bem-sucedida: Usuário ${nome} (ID: ${id}) se autenticou com sucesso.`,
        });

        return next();
    } catch (error) {
        throw new AppError('Token de acesso inválido.', 401);
    }
}