import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const cepRegex = /^\d{5}-\d{3}$/;
const telefoneRegex = /^\(\d{2}\) \d{4}-\d{4}$/;
const celularRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

const cepField = (field: string) => z.string().refine(value => cepRegex.test(value), {
    message: `O campo ${field} é obrigatório e deve estar no formato 00000-000.`,
}).optional();

const telefoneField = (field: string) => z.string().refine(value => telefoneRegex.test(value), {
    message: `O campo ${field} é obrigatório e deve estar no formato (00) 0000-0000.`,
}).optional();

const celularField = (field: string) => z.string().refine(value => celularRegex.test(value), {
    message: `O campo ${field} é obrigatório e deve estar no formato (00) 00000-0000.`,
}).optional();

const baseField = (field: string) => z.string().min(3, { message: `O campo ${field} é obrigatório.` }).optional();
const ufField = (field: string) => z.string().length(2, { message: `O campo ${field} é obrigatório e deve ter exatamente 2 letras.` }).optional();
const cnpjField = (field: string) => z.string().refine(value => cnpjRegex.test(value), {
    message: `O campo ${field} é obrigatório e deve estar no formato 00.000.000/0000-00.`,
}).optional();


const createSchema = z.object({
    numero_processo: z.string().min(7, {message: 'O número do processo é obrigatório e deve exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000'}).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    nome_cliente: baseField('nome_cliente'),
    cnpj: cnpjField('cnpj'),
    telefone:  telefoneField('telefone'),
    celular:  celularField('celular'),
    email: z.string().email({ message: 'Por favor, insira um endereço de email válido.' }).optional(),
    representante: baseField('representante'),
    cep: cepField('cep'),
    endereco: baseField('endereco'),
    numero: z.string().min(1, { message: 'O campo número é obrigatório.' }).optional(),
    complemento: baseField('complemento'),
    bairro: baseField('bairro'),
    cidade: baseField('cidade'),
    uf: ufField('uf'),
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


