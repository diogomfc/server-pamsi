import { NextFunction, Request, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import * as z from 'zod';

import { FormatDate } from '@/utils/DateUtils';
import { prisma } from '@/database';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/Logger';

import { LocalStorage } from '@/providers/LocalStorageProvider';
import { FuncaoUsuario } from '@prisma/client';

//Schema para validar os dados de input
const schemaCreate = z.object({
    nome: z.string(),
    email: z.string().email(),
    senha_hash: z.string(),
    funcao: z.string(),
    avatar: z.string().optional(),
});

//Schema para o UPDATE 
const schemaUpdate = z.object({
    nome: z.string().optional(),
    email: z.string().email().optional(),
    senha_hash: z.string().optional(),
    senha_antiga: z.string().optional(),
    funcao: z.string().optional(),
    avatar: z.string().optional(),
});


export class UsuarioController {
    //Controlador para criar um novo usuário
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            //Receber os dados do usuário
            const { nome, email, senha_hash, funcao} = schemaCreate.parse(req.body);
  
            //Verificar se os dados de input estão preenchidos
            if (!nome || !email || !senha_hash) {
                throw new AppError('Informe todos os campos de texto (nome, email e senha).');
            }

            //Receber o arquivo de avatar imagem caso fornecido porém não é obrigatório
            const arquivoAvatar = req.file;

            //Instanciar o provider de armazenamento em disco
            const armazenamentoDisco = new LocalStorage();

            //Se o arquivo de avatar imagem for fornecido, salvar o arquivo no disco
            if (arquivoAvatar) {
                await armazenamentoDisco.saveFile(arquivoAvatar.path);
                logger.info({
                    message: `Arquivo de avatar salvo com sucesso: ${arquivoAvatar.path}`,
                    executor: nome
                });
            }

            //Verificar se o email já estão em uso
            const verificaEmailUsuarioExiste = await prisma.usuario.findFirst({
                where: {
                    email
                }
            });

            //Se o email já estiver em uso, deletar o arquivo de avatar imagem e retornar um erro
            if (verificaEmailUsuarioExiste) {
                if (arquivoAvatar) {
                    await armazenamentoDisco.deleteFile(arquivoAvatar.path);
                    logger.info({
                        message: `Arquivo de avatar removido com sucesso: ${arquivoAvatar.path}`,
                        executor: nome
                    });
                }
                throw new AppError('Este e-mail já está em uso.', 401);
            }

            //Aceita somente os perfis "Admin, Analista, Revisor ou Supervisor"
            if (funcao !== 'Admin' && funcao !== 'Analista' && funcao !== 'Revisor' && funcao !== 'Supervisor') {
                throw new AppError('Informe um perfil válido (Admin, Analista, Revisor ou Supervisor).');
            }

            //Criptografar a senha
            const senhaCriptografada = await hash(senha_hash, 8);

            //Criar o usuário com a senha criptografada
            const usuarioCriado = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    senha_hash: senhaCriptografada,
                    funcao,
                    avatar: arquivoAvatar ? arquivoAvatar.path : null,
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
        } catch (error){
            next(error);
        }
    }

    //Controller para carregar o perfil do usuário
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
                throw new AppError('O usuário não foi encontrado.', 404);
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
                message: `Usuário ${usuario.id} visualizado com sucesso`,
                executor: usuario.nome,
            });
  
            res.json(usuarioFormatado);
        } catch (error) {
            next(error);
        }
    }

    // Controller para atualizar o perfil do próprio usuário
    async updatePerfil(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario_id = req.usuario.id;
            const { nome, email, senha_hash, senha_antiga, funcao } = schemaUpdate.parse(req.body);
            const funcaoUsuario = req.usuario.funcao; 
            const avatar = req.file;

            //caso o usuário forneça um avatar, verificar se ele já possui um avatar salvo
            if (avatar) {
                const usuario = await prisma.usuario.findUnique({
                    where: {
                        id: usuario_id,
                    },
                    select: {
                        avatar: true,
                    },
                });

                if (usuario && usuario.avatar) {
                    // Se o usuário já possui um avatar, deletar o avatar antigo
                    const armazenamentoDisco = new LocalStorage();
                    await armazenamentoDisco.deleteFile(usuario.avatar);
                    logger.info({
                        message: `Arquivo de avatar removido com sucesso: ${usuario.avatar}`,
                        executor: nome,
                    });
                }
            }

            //se o usuário fornecer um avatar novo e ja deletado o antigo, salvar o novo avatar
            if (avatar) {
                const armazenamentoDisco = new LocalStorage();
                await armazenamentoDisco.saveFile(avatar.path);
                logger.info({
                    message: `Arquivo de avatar salvo com sucesso: ${avatar.path}`,
                    executor: nome,
                });
            }

            // Verificar se o email já está em uso (exceto se for o email do próprio usuário)
            if (email) {
                const verificaEmailUsuarioExiste = await prisma.usuario.findFirst({
                    where: {
                        email,
                        NOT: {
                            id: usuario_id,
                        },
                    },
                });

                if (verificaEmailUsuarioExiste) {
                    throw new AppError('Este e-mail já está em uso.', 401);
                }
            }

            // Se o usuário informa a senha para atualizar, verificar se a senha antiga foi informada
            if (senha_hash) {
                if (!senha_antiga) {
                    throw new AppError('Você deve fornecer a senha antiga para atualizar a senha.', 400);
                }
                const usuario = await prisma.usuario.findUnique({
                    where: {
                        id: usuario_id,
                    },
                    select: {
                        senha_hash: true,
                    },
                });

                if (!usuario) {
                    throw new AppError('Usuário não encontrado', 404);
                }

                const verificarSenhaAntiga = await compare(senha_antiga, usuario.senha_hash);

                if (!verificarSenhaAntiga) {
                    throw new AppError('A senha antiga está incorreta.', 401);
                }
            }

            // Verificar se o usuário logado é Admin ou Supervisor para permitir a atualização da função
            if (funcaoUsuario === 'Admin' || funcaoUsuario === 'Supervisor') {
                if (funcao && !['Admin', 'Analista', 'Revisor', 'Supervisor'].includes(funcao)) {
                    throw new AppError('Informe um perfil válido (Admin, Analista, Revisor ou Supervisor).');
                }
            } else if (funcao) {
                throw new AppError('Somente um Admin ou Supervisor podem atualizar o perfil do usuário.', 401);
            }

            // Criptografar a senha, se fornecida
            const senhaCriptografada = senha_hash ? await hash(senha_hash, 8) : undefined;
            
            //Atualizar o usuário com as informações fornecidas
            const usuarioUpdate = await prisma.usuario.update({
                where: {
                    id: usuario_id,
                },
                data: {
                    nome,
                    email,
                    senha_hash: senhaCriptografada,
                    avatar: avatar ? avatar.path : undefined,
                    funcao: funcao as FuncaoUsuario | undefined,
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
                message: `Perfil do usuário ${usuario_id} atualizado com sucesso`,
                executor: nome,
            });

            const usuario = {
                id: usuarioUpdate.id,
                nome: usuarioUpdate.nome,
                email: usuarioUpdate.email,
                funcao: usuarioUpdate.funcao,
                avatar: usuarioUpdate.avatar,
                criado_em: FormatDate(usuarioUpdate.criado_em),
            };


            req.usuario = usuario;

            res.sendStatus(204).json(usuario);
           
        } catch (error) {
            next(error);
        }
    }

    // Controller para atualizar um usuário
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario_id = req.params.id || req.usuario.id;
            const { nome, email, senha_hash, senha_antiga, funcao } = schemaUpdate.parse(req.body);
            const funcaoUsuario = req.usuario.funcao; 
            const avatar = req.file;

            //caso o usuário forneça um avatar, verificar se ele já possui um avatar salvo
            if (avatar) {
                const usuario = await prisma.usuario.findUnique({
                    where: {
                        id: usuario_id,
                    },
                    select: {
                        avatar: true,
                    },
                });

                if (usuario && usuario.avatar) {
                    // Se o usuário já possui um avatar, deletar o avatar antigo
                    const armazenamentoDisco = new LocalStorage();
                    await armazenamentoDisco.deleteFile(usuario.avatar);
                    logger.info({
                        message: `Arquivo de avatar removido com sucesso: ${usuario.avatar}`,
                        executor: nome,
                    });
                }
            }

            //se o usuário fornecer um avatar novo e ja deletado o antigo, salvar o novo avatar
            if (avatar) {
                const armazenamentoDisco = new LocalStorage();
                await armazenamentoDisco.saveFile(avatar.path);
                logger.info({
                    message: `Arquivo de avatar salvo com sucesso: ${avatar.path}`,
                    executor: nome,
                });
            }

            // Verificar se o email já está em uso (exceto se for o email do próprio usuário)
            if (email) {
                const verificaEmailUsuarioExiste = await prisma.usuario.findFirst({
                    where: {
                        email,
                        NOT: {
                            id: usuario_id,
                        },
                    },
                });

                if (verificaEmailUsuarioExiste) {
                    throw new AppError('Este e-mail já está em uso.', 401);
                }
            }

            // Se o usuário informa a senha para atualizar, verificar se a senha antiga foi informada
            if (senha_hash) {
                if (!senha_antiga) {
                    throw new AppError('Você deve fornecer a senha antiga para atualizar a senha.', 400);
                }
                const usuario = await prisma.usuario.findUnique({
                    where: {
                        id: usuario_id,
                    },
                    select: {
                        senha_hash: true,
                    },
                });

                if (!usuario) {
                    throw new AppError('Usuário não encontrado', 404);
                }

                const verificarSenhaAntiga = await compare(senha_antiga, usuario.senha_hash);

                if (!verificarSenhaAntiga) {
                    throw new AppError('A senha antiga está incorreta.', 401);
                }
            }

            // Verificar se o usuário logado é Admin ou Supervisor para permitir a atualização da função
            if (funcaoUsuario === 'Admin' || funcaoUsuario === 'Supervisor') {
                if (funcao && !['Admin', 'Analista', 'Revisor', 'Supervisor'].includes(funcao)) {
                    throw new AppError('Informe um perfil válido (Admin, Analista, Revisor ou Supervisor).');
                }
            } else if (funcao) {
                throw new AppError('Somente um Admin ou Supervisor podem atualizar o perfil do usuário.', 401);
            }

            // Criptografar a senha, se fornecida
            const senhaCriptografada = senha_hash ? await hash(senha_hash, 8) : undefined;

            // Atualizar o usuário
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const dataToUpdate: Record<string, any> = {};

            if (nome) dataToUpdate.nome = nome;
            if (email) dataToUpdate.email = email;
            if (senha_hash) dataToUpdate.senha_hash = senhaCriptografada;
            if (avatar) dataToUpdate.avatar = avatar.path;
            if (funcao) dataToUpdate.funcao = funcao;

            await prisma.usuario.update({
                where: {
                    id: usuario_id,
                },
                data: dataToUpdate,
            });

            
            logger.info({
                message: `Usuário ${usuario_id} atualizado com sucesso`,
                executor: nome,
            });

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    // Controller para listar um usuário (por ID) ou todos os usuários
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
                    throw new AppError('O usuário não foi encontrado.', 404);
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
                    message: `Busca realizada por: ${req.usuario.nome} (ID: ${req.usuario.id}) para visualizar o usuário: ${usuario.nome} (ID:${usuario.id}) com sucesso.`,
                });

                res.json(usuarioFormatado);
            } else {
                // Se nenhum ID é fornecido, listamos todos os usuários (restringido por permissão)
                const { funcao } = req.usuario;

                if (funcao !== 'Admin' && funcao !== 'Supervisor') {
                    throw new AppError('Somente um Admin ou Supervisor podem listar todos os usuários.', 401);
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
                    message: `Listagem de todos os usuários realizada por: ${req.usuario.nome} (ID: ${req.usuario.id}) com sucesso.`,
                });

                return res.json(usuarios);
            }
        } catch (error) {
            next(error);
        }
    }

    async updateTeste(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario_id = req.usuario.id;
            const { nome, email, funcao, senha_hash, senha_antiga } = req.body; 
  
            // Verificar se o usuário existe
            const usuario = await prisma.usuario.findUnique({
                where: {
                    id: usuario_id,
                },
            });
  
            if (!usuario) {
                throw new AppError('Usuário não encontrado', 404);
            }

            //Verificar o perfil do usuario
            const funcaoUsuario = req.usuario.funcao;

            //Caso o usuário quera atualizar o função, Verificar se o usuário é um Admin ou Supervisor
            if(funcao  !== funcaoUsuario){
                if(funcaoUsuario !== 'Admin' && funcaoUsuario !== 'Supervisor'){
                    throw new AppError('Somente um Admin ou Supervisor podem atualizar o perfil do usuário.', 401);
                }
            }

            //Aceita somente os perfis "Admin, Analista, Revisor ou Supervisor 
            if (funcao && !['Admin', 'Analista', 'Revisor', 'Supervisor'].includes(funcao)) {
                throw new AppError('Informe um perfil válido (Admin, Analista, Revisor ou Supervisor).');
            }

            // Verificar se o email já está em uso (exceto se for o email do próprio usuário)
            if (email) {
                const verificaEmailUsuarioExiste = await prisma.usuario.findFirst({
                    where: {
                        email,
                        NOT: {
                            id: usuario_id,
                        },
                    },
                });

                if (verificaEmailUsuarioExiste) {
                    throw new AppError('Este e-mail já está em uso.', 401);
                }
            }

            // Se o usuário informa a senha para atualizar, verificar se a senha antiga foi informada

            if (senha_hash && senha_antiga) {
                const validarSenhaAntiga = await compare(senha_antiga, usuario.senha_hash);
  
                if (!validarSenhaAntiga) {
                    throw new AppError('A senha antiga está incorreta.', 401);
                }
            }

            // Criptografar a senha, se fornecida
            const senhaCriptografada = senha_hash ? await hash(senha_hash, 8) : undefined;

            // Atualizar os campos do usuário para os novos valores
            await prisma.usuario.update({
                where: {
                    id: usuario_id,
                },
                data: {
                    nome,
                    email,
                    senha_hash: senhaCriptografada,
                    funcao: funcao as FuncaoUsuario | undefined,
                },
            });

            logger.info({
                message: `Usuário ${usuario_id} atualizado com sucesso`,
                executor: nome,
            });

            return res.status(204).json({
                message: 'Usuário atualizado com sucesso.',
            });
           
        } catch (error) {
            next(error);
        }
    }

}