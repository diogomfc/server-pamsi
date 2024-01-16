import { FuncaoUsuario } from '@prisma/client';
import { z } from 'zod';

const UsuarioSchema = z.object({
    nome: z.string().min(3, { message: 'O campo [nome] deve ter pelo menos 3 caractere.' }),
    email: z.string().email({ message: 'O campo [email] deve ser um endereço de e-mail válido.' }),
    telefone: z.string().optional(),
    senha: z.string().min(6, { message: 'A [senha] deve ter pelo menos 6 caracteres.' }),
    funcao: z.nativeEnum(FuncaoUsuario).optional(),
    avatar: z.unknown().optional(),
});

const UsuarioUpdateSchema = z.object({
    nome: z.string().min(3, { message: 'O campo [nome] deve ter pelo menos 3 caractere.' }).optional(),
    email: z.string().email({ message: 'O campo [email] deve ser um endereço de e-mail válido.' }).optional(),
    telefone: z.string().optional(),
    senha: z.string().min(6, { message: 'A [senha] deve ter pelo menos 6 caracteres.' }).optional(),
    funcao: z.nativeEnum(FuncaoUsuario).optional(),
    avatar: z.unknown().optional(),
});

const AlterarSenhaSchema = z.object({
    senha_atual: z.string().min(6, { message: 'A [senha] deve ter pelo menos 6 caracteres.' }),
    nova_senha: z.string().min(6, { message: 'A [senha] deve ter pelo menos 6 caracteres.' }),
    confirmar_senha: z.string().min(6, { message: 'A [senha] deve ter pelo menos 6 caracteres.' }),
});

export type UsuarioSchema = z.infer<typeof UsuarioSchema>;

export const usuarioSchema = {
    create: UsuarioSchema,
    update: UsuarioUpdateSchema,
    alterarSenha: AlterarSenhaSchema,
};