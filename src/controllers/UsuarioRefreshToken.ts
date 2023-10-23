import { Request, Response } from 'express';
import dayjs from 'dayjs';

import { AppError } from '@/utils/AppError';
import { TokenProvider } from '@/providers/TokenProvider';


import { prisma } from '@/database';

export class UsuarioRefreshToken{
    async create(request: Request, response: Response){
        const { refreshToken } = request.body;

        if (!refreshToken) {
            throw new AppError('Token de atualização não informado.', 401);
        }

        const tokenAtualizacao = await prisma.tokenAtualizacao.findFirst({
            where: {
                id: refreshToken
            }
        });

        if(!tokenAtualizacao){
            throw new AppError('Token de atualização inválido.', 401);
        }
       
        // Gerar um novo token de acesso
        const tokenProvider = new TokenProvider();
        const token = await tokenProvider.execute(
            tokenAtualizacao.usuario_id,
            String(tokenAtualizacao.expira_em)
        );

        const tokenProviderExpira_em = dayjs().isAfter(dayjs.unix(Number(tokenAtualizacao.expira_em)));

        if(tokenProviderExpira_em){
            throw new AppError('Token de atualização expirado.', 401);
        }

        return response.json({
            token
        });
    }
}