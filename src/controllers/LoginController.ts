import { compare } from 'bcryptjs';
import { Request, Response } from 'express';

import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { TokenProvider } from '@/providers/TokenProvider';
import { RefreshTokenProvider } from '@/providers/RefreshTokenProvider';

import { prisma } from '@/database';

export class LoginController{
    async create(request: Request, response: Response){
        const { email, senha } = request.body;

        const usuario = await prisma.usuario.findUnique({
            where: {
                email
            }
        });

        if(!usuario){
            throw new AppError('Email ou senha incorretos.', 401);
        }

        const senhaCorreta = await compare(senha, usuario.senha_hash);

        if(!senhaCorreta){
            throw new AppError('Email ou senha incorretos.', 401);
        }

        // Gerar um novo token de acesso
        const tokenProvider = new TokenProvider();
        const token = await tokenProvider.execute(usuario.id, usuario.funcao);

        // Gerar um novo token de atualização
        const refreshTokenProvider = new RefreshTokenProvider();
        const refreshToken = await refreshTokenProvider.execute(usuario.id);

        const expira_em = FormatDate(new Date(refreshToken.expira_em * 1000));

        // Hide the generated password
        const usuarioSemSenha = {
            ...usuario,
            senha_hash: undefined
        };

        logger.info(`Usuário ${usuario.id} logou no sistema.`);

        return response.json({
            usuario: usuarioSemSenha,
            token,
            refreshToken: {
                id: refreshToken.id,
                criado_em: FormatDate(refreshToken.criado_em),
                expira_em: expira_em
            },
        });

    }
}