import { Request, Response, NextFunction } from 'express';
import dayjs from 'dayjs';
import * as z from 'zod';

import { AppError } from '@/utils/AppError';
import { TokenProvider } from '@/providers/TokenProvider';
import { prisma } from '@/database';

// Defina o esquema Zod para validar o corpo da solicitação
const refreshTokenSchema = z.object({
    refreshToken: z.string(),
});

export class UsuarioRefreshToken {
    //POST- Controller para criar um novo token de acesso usando um token de atualização
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            // Validar o corpo da solicitação com o schema Zod
            const { refreshToken } = refreshTokenSchema.parse(req.body);

            // Verificar se o token de atualização foi fornecido
            if (!refreshToken) {
                throw new AppError('Token de atualização não informado.', 401);
            }

            // Procurar o token de atualização no banco de dados
            const tokenAtualizacao = await prisma.tokenAtualizacao.findFirst({
                where: {
                    id: refreshToken
                },
                include: {
                    usuario: true
                }
            });

            // Verificar se o token de atualização é válido
            if (!tokenAtualizacao) {
                throw new AppError('Token de atualização inválido.', 401);
            }

            // Gerar um novo token de acesso
            const tokenProvider = new TokenProvider();

            const token = await tokenProvider.execute(
                tokenAtualizacao.usuario.id,
                tokenAtualizacao.usuario.nome,
                tokenAtualizacao.usuario.funcao
            );

            // Verificar se o token de atualização expirou
            const tokenProviderExpira_em = dayjs().isAfter(dayjs.unix(Number(tokenAtualizacao.expira_em)));

            if (tokenProviderExpira_em) {
                throw new AppError('Token de atualização expirado.', 401);
            }

            // Retornar o novo token de acesso
            return res.json({
                token
            });
        } catch (error) {
            // Lidar com erros durante o processo de atualização do token
            return next(error);
        }
    }
}

