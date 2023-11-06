import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';
import { Regex } from '@/utils/RegexUtils';

const baseField = (field: string) => 
    z.string().min(3, { message: `O campo ${field} é obrigatório.` }).optional();

const createSchema = z.object({
    numero_processo: z.string().min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' }).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    nome_motorista: baseField('nome_motorista'),
    cpf_motorista: z.string().regex(Regex.cpf, { message: 'O campo cpf_motorista é obrigatório e deve ter o formato 000.000.000-00.' }).optional(), // 000.000.000-00
    data_nascimento_motorista: z.string().optional(),
    local_nascimento_motorista: baseField('local_nascimento_motorista'),
    cnh_motorista: baseField('cnh_motorista'),
    tipo_cnh_motorista:  z.string().max(3, { message: 'O campo tipo_cnh_motorista é obrigatório e deve ter no máximo 3 letras.' }).optional(),
    validade_cnh_motorista: baseField('validade_cnh_motorista'),
    cep_motorista: z.string().regex(Regex.cep, { message: 'O campo cep_motorista é obrigatório e deve ter o formato 00000-000.' }).optional(), // 00000-000
    endereco_motorista: baseField('endereco_motorista'),
    numero_motorista: baseField('numero_motorista'),
    complemento_motorista: baseField('complemento_motorista'),
    bairro_motorista: baseField('bairro_motorista'),
    cidade_motorista: baseField('cidade_motorista'),
    uf_motorista: z.string().length(2, { message: 'O campo UF é obrigatório e deve ter exatamente 2 letras.' }).optional(),
    telefone_motorista: z.string().regex(Regex.telefone, { message: 'O campo telefone_motorista é obrigatório e deve ter o formato (00) 0000-0000.' }).optional(), // (00) 0000-0000
    celular_motorista: z.string().regex(Regex.celular, { message: 'O campo celular_motorista é obrigatório e deve ter o formato (00) 00000-0000.' }).optional(), // (00) 00000-0000
    email_motorista: baseField('email_motorista'),
    vinculo_motorista_empresa: baseField('vinculo_motorista_empresa'),
    consulta_telerisco_motorista: baseField('consulta_telerisco_motorista'),
    numero_consulta_telerisco_motorista: baseField('numero_consulta_telerisco_motorista'),
    data_consulta_telerisco_motorista: z.string().optional(),
});

const updateSchema = createSchema.extend({});

type CreateSchemaType = z.infer<typeof createSchema>;
type UpdateSchemaType = z.infer<typeof updateSchema>;

export const form5MotoristaSchema = {
    create: createSchema,
    update: updateSchema,
};

export type Form5MotoristaSchemaType = {
  create: CreateSchemaType,
  update: UpdateSchemaType,
};
