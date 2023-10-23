import { NextFunction, Request, Response } from 'express';
import { hash } from 'bcryptjs';
import * as z from 'zod';

import { prisma } from '@/database';
import { AppError } from '@/utils/AppError';
import { LocalStorage } from '@/providers/LocalStorage';
import { logger } from '@/utils/Logger';

//Schema para validar os dados de input
const schema = z.object({
    nome: z.string(),
    email: z.string().email(),
    senha_hash: z.string(),
    funcao: z.string(),
});


export class UsuarioController {
    //Controlador para criar um novo usuário
    async create(req: Request, res: Response, next: NextFunction) {
        //Receber os dados do usuário
        const { nome, email, senha_hash, funcao} = schema.parse(req.body);
  
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
                user: nome
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
                    user: nome
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
        const usuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha_hash: senhaCriptografada,
                funcao,
                avatar: arquivoAvatar ? arquivoAvatar.path : null,
            }
        });

        logger.info({
            message: `Usuário criado com sucesso: ${usuario.id}`,
            user: nome
        });
      

        req.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            funcao: usuario.funcao,
            avatar: usuario.avatar,
        };
      
        //Só prosseguir caso tudo esteja correto
        return next();
  
        //return resposta.json(usuario);   
    }
    // // Controller para listar um usuário
    // async show(request: Request, response: Response) {
    //     const user_id = request.user.id;

    //     const user = await prisma.user.findUnique({
    //         where: {
    //             id: user_id
    //         },
    //         select: {
    //             id: true,
    //             name: true,
    //             email: true,
    //             role: true,
    //             avatar: true,
    //             created_at: true,
    //         }
    //     });

    //     //Se o usuário não for encontrado, retornar um erro
    //     if (!user) {
    //         throw new AppError('O usuário não foi encontrado.', 404);
    //     }

    //     //Se o usuário for encontrado, retornar os dados do usuário
    //     return response.json(user);
    // }
    // // Controller para listar todos os usuários
    // async index(request: Request, response: Response) {
    //     const users = await prisma.user.findMany({
    //         select: {
    //             id: true,
    //             name: true,
    //             avatar: true,
    //             email: true,
    //             role: true,
    //             created_at: true,
    //             updated_at: true
    //         }
    //     });

    //     return response.json(users);
    // }

    // // Controller para atualizar o perfil do usuário
    // async update(request: Request, response: Response) {
    //     const user_id = request.user.id;
    //     const { name, email, role, password, old_password} = request.body;
      
    //     //Verificar se o usuário existe
    //     const user = await prisma.user.findUnique({
    //         where: {
    //             id: user_id,
    //         },
    //     });

    //     // Se o usuário não for encontrado, retornar um erro
    //     if (!user) {
    //         throw new AppError('O usuário não foi encontrado.', 404);
    //     }

    //     //Verificar o perfil do usuário
    //     const userRole = user.role;
      

    //     //Caso o usuário quera atualizar o role, Verificar se o usuário é um Admin ou Supervisor
    //     if (role !== userRole) {
    //         if (userRole !== 'Admin' && userRole !== 'Supervisor') {
    //             throw new AppError('Somente um Admin ou Supervisor podem atualizar o perfil do usuário.', 401);
    //         }
    //     }

    //     //Aceita somente os perfis "Admin, Analista, Revisor ou Supervisor"
    //     if (role !== 'Admin' && role !== 'Analista' && role !== 'Revisor' && role !== 'Supervisor') {
    //         throw new AppError('Informe um perfil válido (Admin, Analista, Revisor ou Supervisor).');
    //     }

    //     //Verificar se o email já estão em uso 
    //     if (email) {
    //         const checkUserEmailExists = await prisma.user.findFirst({
    //             where: {
    //                 email
    //             }
    //         });

    //         //Se o email já estiver em uso, retornar um erro
    //         if (checkUserEmailExists) {
    //             throw new AppError('Este e-mail já está em uso.', 401);
    //         }
    //     }

    //     //Verificar se a senha antiga foi informada
    //     if (password && !old_password) {
    //         throw new AppError('Informe a senha antiga para atualizar a senha.', 401);
    //     }

    //     //Verificar se a senha antiga está correta
    //     if (password && old_password) {
    //         const checkOldPassword = await compare(old_password, user.password_hash);

    //         if (!checkOldPassword) {
    //             throw new AppError('A senha antiga está incorreta.', 401);
    //         }
    //     }

    //     //Criptografar a senha
    //     const hashedPassword = await hash(password, 8);

    //     // Atualizar os campos do usuário para os novos valores
    //     await prisma.user.update({
    //         where: {
    //             id: user_id,
    //         },
    //         data: {
    //             name,
    //             email,
    //             role,
    //             password_hash: hashedPassword,
    //             updated_at: new Date(),
    //         },
    //     });

    //     return response.status(204).json({
    //         message: 'Usuário atualizado com sucesso.',
    //     });
      
    // }

    // // Controller para atualizar um usuário pelo ID
    // async updateById(request: Request, response: Response) {
    //     const user_Id = request.params.id;
    //     const { name, email, role} = request.body;
      
    //     //Verificar se o usuário existe
    //     const user = await prisma.user.findUnique({
    //         where: {
    //             id: user_Id,
    //         },
    //     });

    //     // Se o usuário não for encontrado, retornar um erro
    //     if (!user) {
    //         throw new AppError('O usuário não foi encontrado.', 404);
    //     }

    //     // Atualizar os campos do usuário para os novos valores
    //     await prisma.user.update({
    //         where: {
    //             id: user_Id,
    //         },
    //         data: {
    //             name,
    //             email,
    //             role,
    //             updated_at: new Date(),
    //         },
    //     });

    //     return response.status(204).json({
    //         message: 'Usuário atualizado com sucesso.',
    //     });

      
    // }

    // // Controller para deletar um usuário pelo ID
    // async delete(request: Request, response: Response) {
    //     const user_Id = request.params.id;

    //     // Verificar se o usuário existe
    //     const user = await prisma.user.findUnique({
    //         where: {
    //             id: user_Id,
    //         },
    //     });

    //     // Se o usuário não for encontrado, retornar um erro
    //     if (!user) {
    //         throw new AppError('O usuário não foi encontrado.', 404);
    //     }

    //     // Deletar o usuário
    //     await prisma.user.delete({
    //         where: {
    //             id: user_Id,
    //         },
    //     });

    //     return response.status(204).json({
    //         message: 'Usuário deletado com sucesso.',
    //     });
    // }
}
