import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { compare, hash } from 'bcryptjs';
import * as z from 'zod';

import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import { LocalStorage } from '@/providers/LocalStorageProvider';
import { FuncaoUsuario } from '@prisma/client';

const usuarioSchema = z.object({
    nome: z.string(),
    email: z.string().email(),
    senha_hash: z.string().optional(),
    funcao: z.nativeEnum(FuncaoUsuario).optional(),
});

const usuarioSchemaUpdate = z.object({
    nome: z.string().optional(),
    email: z.string().email().optional(),
    senha_hash: z.string().optional(),
    funcao: z.nativeEnum(FuncaoUsuario).optional(),
});

export class UsuarioController {
    //POST - Controlador para criar um novo usuário somente admin ou supervisor
    async create(req: Request, res: Response, next: NextFunction) {
        
        let arquivoAvatarPath;
        const armazenamentoDisco = new LocalStorage();

        try {
            const { nome, email, senha_hash, funcao } = usuarioSchema.parse(req.body);
  
            if (!nome || !email || !senha_hash) {
                throw new AppError('Informe todos os campos de texto (nome, email e senha).');
            }
  
            //const arquivoAvatar = req.file;
            const arquivoAvatar = req.file?.filename as string;

            if (arquivoAvatar) {
                await armazenamentoDisco.saveFile(arquivoAvatar);
                arquivoAvatarPath = arquivoAvatar;
                logger.info({
                    message: `Arquivo de avatar salvo com sucesso: ${arquivoAvatar}`,
                });
            }
  
            const verificaEmailUsuarioExiste = await prisma.usuario.findFirst({
                where: {
                    email,
                },
            });
  
            if (verificaEmailUsuarioExiste) {
                if (arquivoAvatar) {
                    await armazenamentoDisco.deleteFile(arquivoAvatar);
                    logger.info({
                        message: `Arquivo de avatar removido com sucesso: ${arquivoAvatar}`,
                    });
                }
                throw new AppError('Este e-mail já está em uso.', 401);
            }
  
            //Aceita somente os perfis "Admin, Analista, Revisor ou Supervisor"
            if (funcao !== 'Admin' && funcao !== 'Analista' && funcao !== 'Revisor' && funcao !== 'Supervisor') {
                throw new AppError('Informe um perfil válido (Admin, Analista, Revisor ou Supervisor).');
            }
  
            const senhaCriptografada = await hash(senha_hash, 8);
  
            const usuarioCriado = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    senha_hash: senhaCriptografada,
                    funcao,
                    avatar: arquivoAvatarPath ? path.basename(arquivoAvatarPath) : null,
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    funcao: true,
                    avatar: true,
                    criado_em: true,
                },
            });
  
            logger.info({
                message: `Usuário criado com sucesso: ${usuarioCriado.id}`,
                executor: nome,
            });
  
            const usuario = {
                id: usuarioCriado.id,
                nome: usuarioCriado.nome,
                email: usuarioCriado.email,
                funcao: usuarioCriado.funcao,
                avatar: usuarioCriado.avatar,
                criado_em: FormatDate(usuarioCriado.criado_em),
            };
  
            req.usuario = usuario;
  
            // Envie uma resposta de sucesso para o cliente
            res.status(201).json({ message: 'Usuário criado com sucesso', usuario });
        } catch (error) {
            if (arquivoAvatarPath) {
                // Se um erro ocorreu e o arquivo de avatar foi salvo, exclua-o
                await armazenamentoDisco.deleteFile(arquivoAvatarPath);
                logger.info({
                    message: `Arquivo de avatar removido devido a um erro: ${arquivoAvatarPath}`,
                });
            }
  
            logger.error({
                message: `Erro ao criar o usuário por ${req.usuario?.nome || 'anônimo'}:  ${JSON.stringify(error)}`,
            });
            return next(error);
        }
    }
  
    //GET - Controller para carregar o perfil do usuário
    async perfil(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.usuario;
  
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    funcao: true,
                    avatar: true,
                    criado_em: true,
                },
            });
  
            if (!usuario) {
                logger.error({
                    message: `O usuário ${id} não foi encontrado.`,
                });
                return next(new AppError('O usuário não foi encontrado.', 404));
            }
  
            const usuarioFormatado = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                funcao: usuario.funcao,
                avatar: usuario.avatar,
                criado_em: usuario.criado_em ? FormatDate(usuario.criado_em) : undefined,
            };
  
            logger.info({
                message: `Usuário ${usuario.id} visualizado com sucesso por ${req.usuario.nome}`,
            });
  
            res.json(usuarioFormatado);
        } catch (error) {
            logger.error({
                message:`Erro ao visualizar perfil do usuário por ${req.usuario.nome} ${JSON.stringify(error)}`,
            });
            return next(error);
        }
    }
  
    //GET - Controller para listar um usuário (por ID) ou todos os usuários
    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
  
            if (id) {
                // Se o ID é fornecido, listamos um único usuário
                const usuario = await prisma.usuario.findUnique({
                    where: {
                        id
                    },
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        funcao: true,
                        avatar: true,
                        criado_em: true,
                    },
                });
  
                if (!usuario) {
                    logger.error({
                        message: `O usuário ${id} não foi encontrado por ${req.usuario.nome}.`,
                    });
                    return next(new AppError('O usuário não foi encontrado.', 404));
                }
  
                const usuarioFormatado = {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    funcao: usuario.funcao,
                    avatar: usuario.avatar,
                    criado_em: usuario.criado_em ? FormatDate(usuario.criado_em) : undefined,
                };
  
                logger.info({
                    message: `Busca realizada por ${req.usuario.nome} para visualizar o usuário ${usuario.nome} com sucesso.`,
                });
  
                res.json(usuarioFormatado);
            } else {
                // Se nenhum ID é fornecido, listamos todos os usuários (restringido por permissão)
                const { funcao } = req.usuario;
  
                if (funcao !== 'Admin' && funcao !== 'Supervisor') {
                    logger.error({
                        message: `${req.usuario.nome} tentou listar todos os usuários sem permissão adequada.`,
                    });
                    return next(new AppError('Somente um Admin ou Supervisor podem listar todos os usuários.', 401));
                }
  
                const usuarios = await prisma.usuario.findMany({
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        funcao: true,
                        avatar: true,
                        criado_em: true,
                    }
                });
  
                logger.info({
                    message: `Listagem de todos os usuários realizada por ${req.usuario.nome} com sucesso.`,
                });
  
                return res.json(usuarios);
            }
        } catch (error) {
            logger.error({
                message:`Erro ao listar usuários por ${req.usuario.nome} ${JSON.stringify(error)}`,
            });
            return next(error);
        }
    }
    
    //PUT- Controller para atualizar a senha - OK
    async alterarSenha(req: Request, res: Response, next: NextFunction) {
        try {
            const { senhaAtual, novaSenha, confirmarSenha } = req.body;
            const usuario_id = req.usuario.id;

            if (!senhaAtual || !novaSenha || !confirmarSenha) {
                logger.error({
                    message: 'Informe todos os campos (senha atual, nova senha e confirmar senha).',
                });
                return next(new AppError('Informe todos os campos (senha atual, nova senha e confirmar senha).'));
            }

            if (novaSenha.length < 6) {
                logger.error({
                    message: 'A nova senha deve ter pelo menos 6 caracteres.',
                });
                return next(new AppError('A nova senha deve ter pelo menos 6 caracteres.'));
            }

            if (novaSenha !== confirmarSenha) {
                logger.error({
                    message: 'A nova senha e a confirmação de senha não correspondem.',
                });
                return next(new AppError('A nova senha e a confirmação de senha não correspondem.'));
            }

            // Verifique se a senha atual corresponde à senha registrada no banco de dados
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: usuario_id
                },
            });

            if (!usuario) {
                logger.error({
                    message: `O usuário ${usuario_id} não foi encontrado.`,
                });
                return next(new AppError('O usuário não foi encontrado.', 404));
            }

            const senhaCorreta = await compare(senhaAtual, usuario.senha_hash);

            if (!senhaCorreta) {
                logger.error({
                    message: 'A senha atual está incorreta.',
                });
                return next(new AppError('A senha atual está incorreta.'));
            }

            // Prosseguir com a alteração da senha
            const novaSenhaCriptografada = await hash(novaSenha, 8);

            await prisma.usuario.update({
                where: {
                    id: usuario_id
                },
                data: {
                    senha_hash: novaSenhaCriptografada,
                },
            });

            logger.info({
                message: `Usuário ${req.usuario.nome} alterou a senha com sucesso.`,
            });

            res.status(201).json({
                message: 'Senha alterada com sucesso.',
            });

        } catch (error) {
            logger.error({
                message: `Erro ao alterar a senha do usuário por ${req.usuario.nome} ${JSON.stringify(error)}`,
            });
            return next(error);
        }
    }

    //PUT- Controller para editar o perfil do usuário - OK
    async editarPerfil(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarioAtual = req.usuario;
  
            if (!usuarioAtual) {
                logger.error({
                    message: 'O usuário não foi encontrado.',
                });
                return next(new AppError('O usuário não foi encontrado.', 404));
            }
  
            const dadosAtualizados = usuarioSchemaUpdate.parse(req.body);

            if (dadosAtualizados.funcao && (usuarioAtual.funcao !== 'Admin' && usuarioAtual.funcao !== 'Supervisor')) {
                logger.error({
                    message: 'O usuário não tem permissão para alterar a função.',
                });
                return next(new AppError('Você não tem permissão para alterar a função.', 403));
            }

            const usuarioAtualizado = await prisma.usuario.update({
                where: {
                    id: usuarioAtual.id
                },
                data: {
                    nome: dadosAtualizados.nome || usuarioAtual.nome,
                    email: dadosAtualizados.email || usuarioAtual.email,
                    funcao: dadosAtualizados.funcao || usuarioAtual.funcao,
                },
            });

            logger.info({
                message: `Usuário ${usuarioAtualizado.id} editou o perfil com sucesso.`,
            });

            res.json({
                ...usuarioAtualizado,
                senha_hash: undefined,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Trate os erros de validação aqui
                return res.status(400).json({ error: error.errors });
            }
  
            logger.error({
                message:`Erro ao editar perfil do usuário por ${req.usuario.nome} ${JSON.stringify(error)}`,
            });
            return next(error);
        }
    }
}