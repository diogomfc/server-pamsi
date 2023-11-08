import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const baseField = (field: string) =>
    z.string().min(3, { message: `O campo ${field} é obrigatório.` }).optional();

const createSchema = z.object({
    numero_processo: z.string()
        .min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' })
        .optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    delegacia: baseField('delegacia'),
    endereco_delegacia: baseField('endereco_delegacia'),
    numero_delegacia: baseField('numero_delegacia'),
    bairro_delegacia: baseField('bairro_delegacia'),
    cidade_delegacia: baseField('cidade_delegacia'),
    uf_delegacia: z.string().length(2, { message: 'O campo UF é obrigatório e deve ter exatamente 2 letras.' }).optional(),
    cep_delegacia: baseField('cep_delegacia'),
    telefone_delegacia: baseField('telefone_delegacia'),
    numero_bo: baseField('numero_bo'),
    data_bo: baseField('data_bo'),
    numero_ip: baseField('numero_ip'),
    data_ip: baseField('data_ip'),
});

const updateSchema = createSchema.extend({});

type CreateSchemaType = z.infer<typeof createSchema>;
type UpdateSchemaType = z.infer<typeof updateSchema>;

export const form8OrgaoPolicialSchema = {
    create: createSchema,
    update: updateSchema,
};

export type Form8OrgaoPolicialSchemaType = {
  create: CreateSchemaType,
  update: UpdateSchemaType,
};