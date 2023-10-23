import { NextFunction, Request, Response} from 'express';
import { verify, JwtPayload } from 'jsonwebtoken'; 

import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { env } from '@/env';
import { FormatDate } from '@/utils/DateUtils';



export function verificarAutenticacao(request: Request, response: Response, next: NextFunction){
    const authHeader = request.headers.authorization;

    if(!authHeader){
        throw new AppError('Token de acesso não informado.', 401);
    }

    const [, token] = authHeader.split(' ');
    try {
        const decodedToken = verify(token, env.JWT_SECRET) as JwtPayload;

        const {sub: id, funcao} = decodedToken;
       
        if (typeof id !== 'string' || !funcao) {
            throw new AppError('Token de acesso inválido.', 401);
        }
        request.usuario = {
            id,
            nome: decodedToken.nome,
            email: decodedToken.email,
            funcao,
            avatar: decodedToken.avatar,
            criado_em: FormatDate(decodedToken.data_criacao),
        };

        logger.info({
            message: `Usuário ${id} autenticado com sucesso.`,
            executor: id
        });

        return next();
    } catch (error) {
        throw new AppError('Token de acesso inválido.', 401);
    }
}