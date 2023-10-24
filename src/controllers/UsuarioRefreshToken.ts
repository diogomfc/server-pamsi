import { Request, Response } from 'express';
import dayjs from 'dayjs';

import { AppError } from '@/utils/AppError';
import { TokenProvider } from '@/providers/TokenProvider';


import { prisma } from '@/database';

export class UsuarioRefreshToken{
    async create(req: Request, res: Response){
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppError('Token de atualização não informado.', 401);
        }

        const tokenAtualizacao = await prisma.tokenAtualizacao.findFirst({
            where: {
                id: refreshToken
            },
            include: {
                usuario: true
            }
        });

        if(!tokenAtualizacao){
            throw new AppError('Token de atualização inválido.', 401);
        }
       
        // Gerar um novo token de acesso
        const tokenProvider = new TokenProvider();

        // const token = await tokenProvider.execute(usuario.id, usuario.nome, usuario.funcao);

        const token = await tokenProvider.execute(
            tokenAtualizacao.usuario.id,
            tokenAtualizacao.usuario.nome,
            tokenAtualizacao.usuario.funcao
        );

        const tokenProviderExpira_em = dayjs().isAfter(dayjs.unix(Number(tokenAtualizacao.expira_em)));

        if(tokenProviderExpira_em){
            throw new AppError('Token de atualização expirado.', 401);
        }

        return res.json({
            token
        });
    }
}