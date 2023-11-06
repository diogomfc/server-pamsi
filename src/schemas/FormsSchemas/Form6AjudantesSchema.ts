import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';
import { Regex } from '@/utils/RegexUtils';

const baseField = (field: string) =>
    z.string().min(3, { message: `O campo ${field} é obrigatório.` }).optional();

const createSchema = z.object({
    numero_processo: z.string().min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' }).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    nome_ajudante: baseField('nome_ajudante'),
    cpf_ajudante: z.string().regex(Regex.cpf, { message: 'O campo cpf_ajudante é obrigatório e deve ter o formato 000.000.000-00.' }).optional(),
    data_nascimento_ajudante: z.string().optional(),
    local_nascimento_ajudante: baseField('local_nascimento_ajudante'),
    cnh_ajudante: baseField('cnh_ajudante'),
    tipo_cnh_ajudante:  z.string().max(3, { message: 'O campo tipo_cnh_ajudante é obrigatório e deve ter no máximo 3 letras.' }).optional(),
    validade_cnh_ajudante: baseField('validade_cnh_ajudante'),
    cep_ajudante: z.string().regex(Regex.cep, { message: 'O campo cep_ajudante é obrigatório e deve ter o formato 00000-000.' }).optional(),
    endereco_ajudante: baseField('endereco_ajudante'),
    numero_ajudante: baseField('numero_ajudante'),
    complemento_ajudante: baseField('complemento_ajudante'),
    bairro_ajudante: baseField('bairro_ajudante'),
    cidade_ajudante: baseField('cidade_ajudante'),
    uf_ajudante: z.string().length(2, { message: 'O campo UF é obrigatório e deve ter exatamente 2 letras.' }).optional(),
    telefone_ajudante: z.string().regex(Regex.telefone, { message: 'O campo telefone_ajudante é obrigatório e deve ter o formato (00) 0000-0000.' }).optional(),
    celular_ajudante: z.string().regex(Regex.celular, { message: 'O campo celular_ajudante é obrigatório e deve ter o formato (00) 00000-0000.' }).optional(),
    email_ajudante: baseField('email_ajudante'),
    vinculo_ajudante_empresa: baseField('vinculo_ajudante_empresa'),
});

const updateSchema = createSchema.extend({});

type CreateSchemaType = z.infer<typeof createSchema>;
type UpdateSchemaType = z.infer<typeof updateSchema>;

export const form6AjudantesSchema = {
    create: createSchema,
    update: updateSchema,
};

export type Form6AjudantesSchemaType = {
    create: CreateSchemaType,
    update: UpdateSchemaType,
};
