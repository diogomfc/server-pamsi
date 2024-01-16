import { NextFunction, Request, Response } from 'express';
import path from 'path';
import { compare, hash } from 'bcryptjs';

import { FormatDate } from '@/utils/DateUtils';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';
import { prisma } from '@/database';

import { LocalStorage } from '@/providers/LocalStorageProvider';
import { usuarioSchema } from '@/schemas/UsuarioSchema';


export class UsuarioController {
    //POST - /usuarios
    async create(req: Request, res: Response, next: NextFunction) {

        const avatarPath = req.file?.path as string;
        const avatarFilename = req.file?.filename as string;
        const armazenamentoDisco = new LocalStorage();
        const usuarioAutenticado = req.usuario;

        try {
            logger.info({
                message: `Usuário ${usuarioAutenticado.nome} está tentando criar um novo usuário.`,
                method: req.method,
                url: req.originalUrl,
            });

            const { nome, email, telefone, senha, funcao } = usuarioSchema.create.parse(req.body);

            // 1 - Verifique se o usuário já existe
            const verificaEmailUsuarioExiste = await prisma.usuario.findFirst({
                where: {
                    email,
                },
            });

            if (verificaEmailUsuarioExiste) {
                throw new AppError('Este e-mail já está em uso.', 401);
            }

            // 2 - Criptografe a senha
            const senhaCriptografada = await hash(senha, 8);

            // 3 - Salve o arquivo de avatar no disco local
            if (avatarFilename) {
                const arquivoAvatarPath = await armazenamentoDisco.saveFile(avatarFilename);

                logger.info({
                    message: `Arquivo de avatar salvo com sucesso: ${arquivoAvatarPath}`,
                    method: req.method,
                    url: req.originalUrl,
                });
            }

            // 4 - Crie o usuário no banco de dados com a senha criptografada e o caminho do avatar
            const usuarioCriado = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    telefone,
                    senha_hash: senhaCriptografada,
                    funcao,
                    avatar: avatarPath ? path.basename(avatarPath) : null,
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    telefone: true,
                    funcao: true,
                    avatar: true,
                    criado_em: true,
                },
            });

            // 5 - Formate a resposta do usuário
            const usuario = {
                id: usuarioCriado.id,
                nome: usuarioCriado.nome,
                email: usuarioCriado.email,
                telefone: usuarioCriado.telefone,
                funcao: usuarioCriado.funcao,
                avatar: usuarioCriado.avatar,
                criado_em: FormatDate(usuarioCriado.criado_em),
            };

            // 6 - Salve o usuário na requisição para uso posterior
            req.usuario = usuario;

            // 7 - Retorne a resposta
            res.status(201).json({
                message: 'Usuário criado com sucesso',
                usuario
            });

            logger.info({
                message: `Usuário criado com sucesso. Detalhes: ID - ${usuarioCriado.id}, Nome - ${usuarioCriado.nome}. Criado por: Nome - ${usuarioAutenticado.nome}, Função - ${usuarioAutenticado.funcao}.`,
                method: req.method,
                url: req.originalUrl,
            });

        } catch (error) {
            // 8 - Se o arquivo de avatar foi salvo com sucesso e ocorreu um erro, exclua o arquivo de avatar
            if (avatarFilename) {
                await armazenamentoDisco.deleteFile(avatarPath);
            }

            logger.error({
                message: `Ocorreu um erro ao tentar criar o usuário por ${usuarioAutenticado ? usuarioAutenticado.nome : 'usuário não autenticado'}. Detalhes do erro: ${JSON.stringify(error)}.`,
                method: req.method,
                url: req.originalUrl,
            });

            return next(error);
        }
    }

    //GET - /usuarios/perfil
    async perfil(req: Request, res: Response, next: NextFunction) {
        const usuarioAutenticado = req.usuario;

        try {

            //1 - Verifique se o usuário existe
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: usuarioAutenticado.id
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    funcao: true,
                    telefone: true,
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

            //2 - Formate a resposta do usuário carregando os dados para o perfil
            const usuarioFormatado = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                funcao: usuario.funcao,
                avatar: usuario.avatar,
                criado_em: usuario.criado_em ? FormatDate(usuario.criado_em) : undefined,
            };

            //3 - Retorne a resposta
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

    //GET - /usuarios:id?
    async index(req: Request, res: Response, next: NextFunction) {
        const usuarioAutenticado = req.usuario;

        try {
            const { id } = req.params;
            // 1 - Se um ID é fornecido, retorne o usuário com esse ID
            if (id) {

                // 1.1 - Verifique se o usuário existe
                const usuario = await prisma.usuario.findUnique({
                    where: {
                        id
                    },
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        telefone: true,
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
                // 1.2 - Formate a resposta do usuário carregando os dados para o perfil
                const usuarioFormatado = {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    telefone: usuario.telefone,
                    funcao: usuario.funcao,
                    avatar: usuario.avatar,
                    criado_em: usuario.criado_em ? FormatDate(usuario.criado_em) : undefined,
                };

                logger.info({
                    message: `O usuário ${usuarioAutenticado.nome} realizou uma busca bem-sucedida para visualizar o perfil do usuário ${usuario.nome}.`,
                    method: req.method,
                    url: req.originalUrl,
                });

                // 1.3 - Retorne a resposta
                res.json(usuarioFormatado);


                // 2 - Se nenhum ID for fornecido, retorne todos os usuários (somente Admin e Supervisor)
            } else {

                // 2.1 - Verifique se o usuário tem permissão para listar todos os usuários
                if (usuarioAutenticado.funcao !== 'Admin' && usuarioAutenticado.funcao !== 'Supervisor') {

                    logger.error({
                        message: `Ação não autorizada: O usuário ${usuarioAutenticado.nome} tentou listar todos os usuários sem a permissão adequada.`,
                        method: req.method,
                        url: req.originalUrl,
                    });

                    return next(new AppError('Somente um Admin ou Supervisor podem listar todos os usuários.', 401));
                }
                // 2.2 - buscar todos os usuários
                const usuarios = await prisma.usuario.findMany({
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        telefone: true,
                        funcao: true,
                        avatar: true,
                        criado_em: true,
                    }
                });

                //2.3 - Formate a resposta do usuário carregando os dados para o perfil
                const usuariosFormatados = usuarios.map((usuario) => {
                    return {
                        id: usuario.id,
                        nome: usuario.nome,
                        email: usuario.email,
                        funcao: usuario.funcao,
                        telefone: usuario.telefone,
                        avatar: usuario.avatar,
                        criado_em: usuario.criado_em ? FormatDate(usuario.criado_em) : undefined,
                    };
                });

                logger.info({
                    message: `O usuário ${usuarioAutenticado.nome} realizou com sucesso a listagem de todos os usuários.`,
                    method: req.method,
                    url: req.originalUrl,
                });

                //2.4 - Retorne a resposta
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

    //PUT- /usuarios/alterar-senha
    async alterarSenha(req: Request, res: Response, next: NextFunction) {
        const usuarioAutenticado = req.usuario;
        const { senha_atual, nova_senha, confirmar_senha } = usuarioSchema.alterarSenha.parse(req.body);

        try {

            logger.info({
                message: `Usuário ${usuarioAutenticado.nome} está tentando alterar a senha.`,
                method: req.method,
                url: req.originalUrl,
            });

            //1 - Verifique se o usuário existe
            const usuarioExiste = await prisma.usuario.findUnique({
                where: {
                    id: usuarioAutenticado.id
                },
            });

            if (!usuarioExiste) {
                logger.error({
                    message: `O usuário ID: ${usuarioAutenticado.id} não foi encontrado.`,
                    method: req.method,
                    url: req.originalUrl,
                });
                return next(new AppError('O usuário não foi encontrado.', 404));
            }

            // 2 - Verifique se a nova senha e a confirmação da senha correspondem
            if (nova_senha !== confirmar_senha) {
                new AppError('A nova senha e a confirmação da senha não correspondem.', 400);
            }

            // 3 - Comparar a senha atual com a senha criptografada
            const senhaCorreta = await compare(senha_atual, usuarioExiste.senha_hash);

            if (!senhaCorreta) {
                new AppError('A senha atual está incorreta.');
            }

            // 4 - Criptografe a nova senha
            const novaSenhaCriptografada = await hash(nova_senha, 8);

            // 5 - Atualize a senha do usuário
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

            // 6 - Retorne a resposta
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

    //PUT- /usuarios/editar-perfil
    async editarPerfil(req: Request, res: Response, next: NextFunction) {

        const usuarioAutenticado = req.usuario;
        const dadosAtualizados = usuarioSchema.update.parse(req.body);

        try {
            // 1 - Verifique se o usuário existe e está autenticado
            if (!usuarioAutenticado) {
                logger.error({
                    message: 'O usuário não foi encontrado.',
                    method: req.method,
                    url: req.originalUrl,
                });
                return next(new AppError('O usuário não foi encontrado.', 404));
            }


            // 2 - Verifique se o usuário tem permissão para alterar a função (somente Admin e Supervisor)
            if (dadosAtualizados.funcao && (usuarioAutenticado.funcao !== 'Admin' && usuarioAutenticado.funcao !== 'Supervisor')) {
                logger.error({
                    message: 'O usuário não tem permissão para alterar a função.',
                    method: req.method,
                    url: req.originalUrl,
                });
                return next(new AppError('Você não tem permissão para alterar a função.', 403));
            }

            // 3 -  Atualize o perfil do usuário
            const usuarioAtualizado = await prisma.usuario.update({
                where: {
                    id: usuarioAutenticado.id
                },
                data: {
                    nome: dadosAtualizados.nome || usuarioAutenticado.nome,
                    email: dadosAtualizados.email || usuarioAutenticado.email,
                    funcao: dadosAtualizados.funcao || usuarioAutenticado.funcao,
                    telefone: dadosAtualizados.telefone || usuarioAutenticado.telefone,
                },
            });


            logger.info({
                message: `Usuário ${usuarioAtualizado.id} editou o perfil com sucesso.`,
                method: req.method,
                url: req.originalUrl,
            });

            // 4 - Retorne a resposta
            res.status(201).json({
                message: 'Perfil editado com sucesso.',
                ...usuarioAtualizado,
                senha_hash: undefined,
                criado_em: usuarioAtualizado.criado_em ? FormatDate(usuarioAtualizado.criado_em) : undefined,
            });

        } catch (error) {
            logger.error({
                message: `Erro ao editar perfil do usuário por ${usuarioAutenticado.nome} ${JSON.stringify(error)}`,
                method: req.method,
                url: req.originalUrl,
            });
            return next(error);
        }
    }
}