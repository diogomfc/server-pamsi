import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';
import { Regex } from '@/utils/RegexUtils';

const baseField = (field: string) => z.string().min(3, { message: `O campo ${field} é obrigatório.` }).optional();

const createSchema = z.object({
    numero_processo: z.string().min(7, {message: 'O número do processo é obrigatório e deve exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000'}).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    nome_cliente: baseField('nome_cliente'),
    cnpj: z.string().regex(Regex.cnpj, { message: 'O campo cnpj é obrigatório e deve ter o formato 00.000.000/0000-00.' }).optional(),
    telefone: z.string().regex(Regex.telefone, { message: 'O campo telefone é obrigatório e deve ter o formato (00) 0000-0000.' }).optional(),
    celular: z.string().regex(Regex.celular, { message: 'O campo celular é obrigatório e deve ter o formato (00) 00000-0000.' }).optional(),
    email: z.string().email({ message: 'Por favor, insira um endereço de email válido.' }).optional(),
    representante: baseField('representante'),
    cep: z.string().regex(Regex.cep, { message: 'O campo cep é obrigatório e deve ter o formato 00000-000.' }).optional(),
    endereco: baseField('endereco'),
    numero: z.string().min(1, { message: 'O campo número é obrigatório.' }).optional(),
    complemento: baseField('complemento'),
    bairro: baseField('bairro'),
    cidade: baseField('cidade'),
    uf: z.string().length(2, { message: 'O campo UF é obrigatório e deve ter exatamente 2 letras.' }).optional(),
});

const updateSchema = createSchema.extend({
});

type CreateSchemaType = z.infer<typeof createSchema>;
type UpdateSchemaType = z.infer<typeof updateSchema>;

export const form1ClienteSeguradoSchema = {
    create: createSchema,
    update: updateSchema,
};

export type Form1ClienteSeguradoSchemaType = {
  create: CreateSchemaType,
  update: UpdateSchemaType,
};


