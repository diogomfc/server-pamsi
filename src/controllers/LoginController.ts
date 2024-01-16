import { NextFunction, Request, Response } from 'express';
import { compare } from 'bcryptjs';
import * as z from 'zod';

import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';
import { TokenProvider } from '@/providers/TokenProvider';
import { RefreshTokenProvider } from '@/providers/RefreshTokenProvider';

// Defina o esquema Zod para validar o corpo da solicitação
const LoginSchema = z.object({
    email: z.string().email().min(1, { message: 'Favor informa o email do usuário.' }),
    senha: z.string().min(1, { message: 'Favor informa a senha do usuário.' })
});

type LoginSchema = z.infer<typeof LoginSchema>;

export class LoginController {
    //POST - /login/
    async create(req: Request, res: Response, next: NextFunction) {
        const { email, senha } = LoginSchema.parse(req.body);
        let usuario;

        try {
            logger.info({
                message: `Tentativa de login realizada. Email: ${email}.`,
                method: req.method,
                url: req.originalUrl,
            });

            try {
                // 1 - Verificar se o login é válido
                usuario = await prisma.usuario.findUnique({
                    where: {
                        email,
                    },
                });

                if (!usuario) {
                    throw new AppError('Email ou senha incorretos.', 401);
                }

                // 2 - Verificar se a senha está correta
                const senhaCorreta = await compare(senha, usuario.senha_hash);

                if (!senhaCorreta) {
                    throw new AppError('Email ou senha incorretos.', 401);
                }

                // 3 - Gerar um novo token de acesso
                const tokenProvider = new TokenProvider();
                const token = await tokenProvider.execute(usuario.id, usuario.nome, usuario.funcao);

                // 4 - Gerar um novo token de atualização
                const refreshTokenProvider = new RefreshTokenProvider();
                const refreshToken = await refreshTokenProvider.execute(usuario.id);
                const expira_em = FormatDate(new Date(refreshToken.expira_em * 1000));

                // 5 - Retorna os dados do usuário sem a senha
                const usuarioSemSenha = {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    telefone: usuario.telefone,
                    avatar: usuario.avatar,
                    funcao: usuario.funcao,
                    criado_em: FormatDate(usuario.criado_em),
                    senha_hash: undefined,
                };

                logger.info({
                    message: `Ação de login realizada. Usuário: ${usuario.nome} - ID: ${usuario.id}.`,
                    method: req.method,
                    url: req.originalUrl,
                });

                // 6 - Retorna os dados do usuário e os tokens
                return res.status(201).json({
                    message: 'Login realizado com sucesso.',
                    usuario: usuarioSemSenha,
                    token,
                    refreshToken: {
                        id: refreshToken.id,
                        gerado_em: FormatDate(refreshToken.criado_em),
                        expira_em: expira_em,
                    },
                });

            } catch (error) {

                if (usuario) {
                    logger.error({
                        message: `Erro ao realizar login. Usuário: ${usuario.nome} - ID: ${usuario.id}. Motivo: ${JSON.stringify(error)}.`,
                        method: req.method,
                        url: req.originalUrl,
                    });
                } else {
                    logger.error({
                        message: `Erro ao realizar login. Email: ${email}. Motivo: ${JSON.stringify(error)}.`,
                        method: req.method,
                        url: req.originalUrl,
                    });
                }
                return next(error);
            }
        } catch (error) {
            return next(error);
        }
    }
}
