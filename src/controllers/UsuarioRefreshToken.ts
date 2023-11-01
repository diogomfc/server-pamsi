import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';
import * as z from 'zod';

import { AppError } from '@/utils/AppError';
import { TokenProvider } from '@/providers/TokenProvider';
import { prisma } from '@/database';

const refreshTokenSchema = z.object({
    refreshToken: z.string(),
});

export class UsuarioRefreshToken {
    //POST- /token/refresh
    async create(req: Request, res: Response, next: NextFunction) {

        const { refreshToken } = refreshTokenSchema.parse(req.body);
     
        try {
         
            // 1 - Verificar se o token de atualização foi fornecido
            if (!refreshToken) {
                throw new AppError('Token de atualização não informado.', 401);
            }

            // 2 - localizar o token de atualização no banco de dados
            const tokenAtualizacao = await prisma.tokenAtualizacao.findFirst({
                where: {
                    id: refreshToken
                },
                include: {
                    usuario: true
                }
            });

            if (!tokenAtualizacao) {
                throw new AppError('Token de atualização inválido.', 401);
            }

            const tokenProvider = new TokenProvider();

            // 4 - Gerar um novo token de acesso
            const token = await tokenProvider.execute(
                tokenAtualizacao.usuario.id,
                tokenAtualizacao.usuario.nome,
                tokenAtualizacao.usuario.funcao
            );

            // 5 - Verificar se o token de atualização expirou
            const tokenProviderExpira_em = dayjs().isAfter(dayjs.unix(Number(tokenAtualizacao.expira_em)));

            if (tokenProviderExpira_em) {
                throw new AppError('Token de atualização expirado.', 401);
            }

            // 6 - Retornar o novo token de acesso
            return res.json({
                token
            });

        } catch (error) {
            return next(error);
        }
    }
}

