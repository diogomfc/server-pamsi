import { compare } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';

import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { TokenProvider } from '@/providers/TokenProvider';
import { RefreshTokenProvider } from '@/providers/RefreshTokenProvider';

import { prisma } from '@/database';

export class LoginController{
    async create(req: Request, res: Response, next: NextFunction) {
        const { email, senha } = req.body;
        let usuario;

        try {
            usuario = await prisma.usuario.findUnique({
                where: {
                    email,
                },
            });

            if (!usuario) {
                throw new AppError('Email ou senha incorretos.', 401);
            }

            const senhaCorreta = await compare(senha, usuario.senha_hash);

            if (!senhaCorreta) {
                throw new AppError('Email ou senha incorretos.', 401);
            }

            // Gerar um novo token de acesso
            const tokenProvider = new TokenProvider();
            const token = await tokenProvider.execute(usuario.id, usuario.nome, usuario.funcao);

            // Gerar um novo token de atualização
            const refreshTokenProvider = new RefreshTokenProvider();
            const refreshToken = await refreshTokenProvider.execute(usuario.id);
            const expira_em = FormatDate(new Date(refreshToken.expira_em * 1000));

            // Esconder a senha gerada
            const usuarioSemSenha = {
                ...usuario,
                senha_hash: undefined,
            };

            logger.info({
                message: `Login realizado por: ${usuario.nome} (ID: ${usuario.id}).`,
            });

            return res.json({
                usuario: usuarioSemSenha,
                token,
                refreshToken: {
                    id: refreshToken.id,
                    criado_em: FormatDate(refreshToken.criado_em),
                    expira_em: expira_em,
                },
            });
        } catch (error) {
            if (usuario) {
                logger.error({
                    message: `Erro ao realizar login para: ${usuario.nome} (ID: ${usuario.id}). Motivo: ${JSON.stringify(error)}`,
                });
            } else {
                logger.error({
                    message: `Erro ao realizar login para: ${email}. Motivo: ${JSON.stringify(error)}`,
                });
            }
            next(error);
        }
    }
}