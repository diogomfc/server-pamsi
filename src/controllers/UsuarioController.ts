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

const usuarioSchemaUpdate = z.object({
    nome: z.string().optional(),
    email: z.string().email().optional(),
    senha_hash: z.string().optional(),
    funcao: z.nativeEnum(FuncaoUsuario).optional(),
});

export class UsuarioController {
    //POST - Controlador para criar um novo usuário somente admin ou supervisor
    async create(req: Request, res: Response, next: NextFunction) {
        
        const avatarPath = req.file?.path as string;
        const avatarFilename = req.file?.filename as string;
        const armazenamentoDisco = new LocalStorage();

        //buscar o usuário autenticado
        const usuarioAutenticado = req.usuario;

        try {
            //const { nome, email, senha, funcao } = usuarioSchema.parse(req.body);
            const { nome, email, senha, funcao } = req.body;

            if (!nome || !email || !senha) {
                throw new AppError('Informe todos os campos de texto (nome, email e senha).');
            }

            // Verifique se a função do usuário não é válida e gere um AppError
            if (funcao !== 'Admin' && funcao !== 'Analista' && funcao !== 'Revisor' && funcao !== 'Supervisor') {
                throw new AppError('Informe um perfil válido (Admin, Analista, Revisor ou Supervisor)', 401);
            }

            // Verifique se o e-mail já está em uso
            const verificaEmailUsuarioExiste = await prisma.usuario.findFirst({
                where: {
                    email,
                },
            });

            if (verificaEmailUsuarioExiste) {
                throw new AppError('Este e-mail já está em uso.', 401);
            }

            // Criptografe a senha
            const senhaCriptografada = await hash(senha, 8);

            // Salve o arquivo de avatar no disco
            if(avatarFilename){
                const arquivoAvatarPath = await armazenamentoDisco.saveFile(avatarFilename);
                logger.info({
                    message: `Arquivo de avatar salvo com sucesso: ${arquivoAvatarPath}`,
                    method: req.method,
                    url: req.originalUrl,
                });
            }

            const usuarioCriado = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    senha_hash: senhaCriptografada,
                    funcao,
                    avatar: avatarPath ? path.basename(avatarPath) : null,
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

            const usuario = {
                id: usuarioCriado.id,
                nome: usuarioCriado.nome,
                email: usuarioCriado.email,
                funcao: usuarioCriado.funcao,
                avatar: usuarioCriado.avatar,
                criado_em: FormatDate(usuarioCriado.criado_em),
            };

            req.usuario = usuario;
            
            res.status(201).json({ message: 'Usuário criado com sucesso', usuario });

            logger.info({
                message: `Usuário criado com sucesso. Detalhes: ID - ${usuarioCriado.id}, Nome - ${usuarioCriado.nome}. Criado por: Nome - ${usuarioAutenticado.nome}, Função - ${usuarioAutenticado.funcao}.`,
                method: req.method,
                url: req.originalUrl,
            });

        } catch (error) {
            //Se o arquivo de avatar foi salvo com sucesso e ocorreu um erro, exclua o arquivo de avatar
            if (avatarFilename) {
                await armazenamentoDisco.deleteFile(avatarPath);
            }

            logger.error({
                message: `Ocorreu um erro ao tentar criar o usuário por ${
                    usuarioAutenticado ? usuarioAutenticado.nome : 'usuário não autenticado'
                }. Detalhes do erro: ${JSON.stringify(error)}.`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    //GET - Controller para carregar o perfil do usuário
    async perfil(req: Request, res: Response, next: NextFunction) {
        
        const usuarioAutenticado = req.usuario;
      
        try {
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: usuarioAutenticado.id
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
                    message: `O usuário ID: ${usuarioAutenticado.id} não foi encontrado.`,
                    method: req.method,
                    url: req.originalUrl,
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
                message: `Ação de visualização de perfil realizada. Usuário: ${usuarioAutenticado.nome} - ID: ${usuarioAutenticado.id}.`,
                method: req.method,
                url: req.originalUrl,
            });
  
            res.json(usuarioFormatado);
        } catch (error) {
            logger.error({
                message: `Ocorreu um erro ao tentar visualizar o perfil. Usuário: ${usuarioAutenticado.nome} - ID: ${usuarioAutenticado.id}. Detalhes do erro: ${JSON.stringify(error)}.`,
                method: req.method,
                url: req.originalUrl,
            });
            return next(error);
        }
    }
  
    //GET - Controller para listar um usuário (por ID) ou todos os usuários
    async index(req: Request, res: Response, next: NextFunction) {
     
        const usuarioAutenticado = req.usuario;
      
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
                        message: `O usuário com ID ${id} não foi encontrado. Ação realizada por: ${usuarioAutenticado.nome}.`,
                        method: req.method,
                        url: req.originalUrl,
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
                    message: `O usuário ${usuarioAutenticado.nome} realizou uma busca bem-sucedida para visualizar o perfil do usuário ${usuario.nome}.`,
                    method: req.method,
                    url: req.originalUrl,
                });
  
                res.json(usuarioFormatado);

            } else {
                // Se nenhum ID é fornecido, listamos todos os usuários (restringido por permissão)
                //const { funcao } = req.usuario;
  
                if (usuarioAutenticado.funcao !== 'Admin' && usuarioAutenticado.funcao !== 'Supervisor') {

                    logger.error({
                        message: `Ação não autorizada: O usuário ${usuarioAutenticado.nome} tentou listar todos os usuários sem a permissão adequada.`,
                        method: req.method,
                        url: req.originalUrl,
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

                const usuariosFormatados = usuarios.map((usuario) => {
                    return {
                        id: usuario.id,
                        nome: usuario.nome,
                        email: usuario.email,
                        funcao: usuario.funcao,
                        avatar: usuario.avatar,
                        criado_em: usuario.criado_em ? FormatDate(usuario.criado_em) : undefined,
                    };
                });
  
                logger.info({
                    message: `O usuário ${usuarioAutenticado.nome} realizou com sucesso a listagem de todos os usuários.`,
                    method: req.method,
                    url: req.originalUrl,
                });
  
                return res.json(usuariosFormatados);
            }
        } catch (error) {
            logger.error({
                message: `Ocorreu um erro ao tentar listar os usuários por ${usuarioAutenticado.nome}. Detalhes do erro: ${JSON.stringify(error)}.`,
                method: req.method,
                url: req.originalUrl,
            });
            return next(error);
        }
    }
    
    //PUT- Controller para atualizar a senha - OK
    async alterarSenha(req: Request, res: Response, next: NextFunction) {
        const usuarioAutenticado = req.usuario;
        try {
            const { senhaAtual, novaSenha, confirmarSenha } = req.body;
           

            if (!senhaAtual || !novaSenha || !confirmarSenha) {
                logger.error({
                    message: 'Informe todos os campos (senha atual, nova senha e confirmar senha).',
                    method: req.method,
                    url: req.originalUrl,
                });
                return next(new AppError('Informe todos os campos (senha atual, nova senha e confirmar senha).'));
            }

            if (novaSenha.length < 6) {
                logger.error({
                    message: 'A nova senha deve ter pelo menos 6 caracteres.',
                    method: req.method,
                    url: req.originalUrl,
                });
                return next(new AppError('A nova senha deve ter pelo menos 6 caracteres.'));
            }

            if (novaSenha !== confirmarSenha) {
                logger.error({
                    message: 'A nova senha e a confirmação de senha não correspondem.',
                    method: req.method,
                    url: req.originalUrl,
                });
                return next(new AppError('A nova senha e a confirmação de senha não correspondem.'));
            }

            // Verifique se a senha atual corresponde à senha registrada no banco de dados
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: usuarioAutenticado.id
                },
            });

            if (!usuario) {
                logger.error({
                    message: `Nenhum usuário com o ID fornecido (${usuarioAutenticado.id}) foi encontrado para alteração de senha.`,
                    method: req.method,
                    url: req.originalUrl,
                });
                return next(new AppError('O usuário não foi encontrado.', 404));
            }

            const senhaCorreta = await compare(senhaAtual, usuario.senha_hash);

            if (!senhaCorreta) {
                logger.error({
                    message: 'A senha atual está incorreta.',
                    method: req.method,
                    url: req.originalUrl,
                });
                return next(new AppError('A senha atual está incorreta.'));
            }

            // Prosseguir com a alteração da senha
            const novaSenhaCriptografada = await hash(novaSenha, 8);

            await prisma.usuario.update({
                where: {
                    id: usuarioAutenticado.id
                },
                data: {
                    senha_hash: novaSenhaCriptografada,
                },
            });

            logger.info({
                message: `Usuário ${usuarioAutenticado.nome} alterou a senha com sucesso.`,
                method: req.method,
                url: req.originalUrl,
            });

            res.status(201).json({
                message: 'Senha alterada com sucesso.',
            });

        } catch (error) {
            logger.error({
                message: `Erro ao alterar a senha do usuário por ${usuarioAutenticado.nome} ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });
            return next(error);
        }
    }

    //PUT- Controller para editar o perfil do usuário - OK
    async editarPerfil(req: Request, res: Response, next: NextFunction) {
      
        const usuarioAutenticado = req.usuario;
      
        try {
            if (!usuarioAutenticado) {
                logger.error({
                    message: 'O usuário não foi encontrado.',
                    method: req.method,
                    url: req.originalUrl,
                });
                return next(new AppError('O usuário não foi encontrado.', 404));
            }
  
            const dadosAtualizados = usuarioSchemaUpdate.parse(req.body);

            if (dadosAtualizados.funcao && (usuarioAutenticado.funcao !== 'Admin' && usuarioAutenticado.funcao !== 'Supervisor')) {
                logger.error({
                    message: 'O usuário não tem permissão para alterar a função.',
                    method: req.method,
                    url: req.originalUrl,
                });
                return next(new AppError('Você não tem permissão para alterar a função.', 403));
            }

            const usuarioAtualizado = await prisma.usuario.update({
                where: {
                    id: usuarioAutenticado.id
                },
                data: {
                    nome: dadosAtualizados.nome || usuarioAutenticado.nome,
                    email: dadosAtualizados.email || usuarioAutenticado.email,
                    funcao: dadosAtualizados.funcao || usuarioAutenticado.funcao,
                },
            });

       
            logger.info({
                message: `Usuário ${usuarioAtualizado.id} editou o perfil com sucesso.`,
                method: req.method,
                url: req.originalUrl,
            });

            res.json({
                'message': 'Perfil atualizado com sucesso.',
                ...usuarioAtualizado,
                senha_hash: undefined,
                criado_em: usuarioAtualizado.criado_em ? FormatDate(usuarioAtualizado.criado_em) : undefined,
            });
        } catch (error) {
            logger.error({
                message:`Erro ao editar perfil do usuário por ${usuarioAutenticado.nome} ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });
            return next(error);
        }
    }
}