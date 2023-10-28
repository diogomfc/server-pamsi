import { z } from 'zod';
import { Tipo_Formulario, Status_Relatorio } from '@prisma/client';

// Esquema para a operação 'create'
const CreateRelatorioSchema = z.object({
    numero_processo: z.string(),
    cliente: z.string(),
    cnpj: z.string(),
    data_entrada: z.date().optional(),
    data_emissao: z.date().optional(),
    usuarios_permitidos: z.array(z.string()).optional(),
    formularios_selecionados: z.array(z.nativeEnum(Tipo_Formulario)).optional(),
});

// Esquema para a operação 'update'
const UpdateRelatorioSchema = z.object({
    numero_processo: z.string().optional(),
    cliente: z.string().optional(),
    cnpj: z.string().optional(),
    data_entrada: z.date().optional(),
    data_emissao: z.date().optional(),
    status: z.nativeEnum(Status_Relatorio).optional(),
    usuario_responsavel_id: z.string().optional(),
    usuarios_permitidos: z.array(z.string()).optional(),
    formularios_selecionados: z.array(z.nativeEnum(Tipo_Formulario)).optional(),
});

export const relatorioSchema = {
    create: CreateRelatorioSchema,
    update: UpdateRelatorioSchema,
};
