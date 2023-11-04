import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const baseField = (field: string) => z.string().min(3, { message: `O campo ${field} é obrigatório.` }).optional();
const cepField = (field: string) => z.string().length(9, { message: `O campo ${field} é obrigatório e deve ter 9 dígitos. (00000-000)` }).optional();
const ufField = (field: string) => z.string().length(2, { message: `O campo ${field} é obrigatório e deve ter exatamente 2 letras.` }).optional();

const createSchema = z.object({
    numero_processo: z.string().min(7, {message: 'O número do processo é obrigatório e deve exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000'}).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    nome_motorista: baseField('nome_motorista'),
    cpf_motorista: baseField('cpf_motorista'),
    data_nascimento_motorista: z.date().optional(),
    local_nascimento_motorista: baseField('local_nascimento_motorista'),
    cnh_motorista: baseField('cnh_motorista'),
    tipo_cnh_motorista: baseField('tipo_cnh_motorista'),
    validade_cnh_motorista: baseField('validade_cnh_motorista'),
    cep_motorista: cepField('cep_motorista'),
    endereco_motorista: baseField('endereco_motorista'),
    numero_motorista: baseField('numero_motorista'),
    complemento_motorista: baseField('complemento_motorista'),
    bairro_motorista: baseField('bairro_motorista'),
    cidade_motorista: baseField('cidade_motorista'),
    uf_motorista: ufField('uf_motorista'),
    telefone_motorista: baseField('telefone_motorista'),
    celular_motorista: baseField('celular_motorista'),
    email_motorista: baseField('email_motorista'),
    consulta_telerisco_motorista: baseField('consulta_telerisco_motorista'),
    numero_consulta_telerisco_motorista: baseField('numero_consulta_telerisco_motorista'),
    data_consulta_telerisco_motorista: baseField('data_consulta_telerisco_motorista')
});

const updateSchema = createSchema.extend({
});

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
