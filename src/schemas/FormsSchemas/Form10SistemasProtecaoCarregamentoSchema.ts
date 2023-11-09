import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const createForm10Schema = z.object({
    numero_processo: z.string()
        .min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' })
        .optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    protecao_escolta: z.boolean().optional().default(false),
    protecao_comboio: z.boolean().optional().default(false),
    protecao_velada: z.boolean().optional().default(false),
    protecao_outros: z.boolean().optional().default(false),
    protecao_veiculos: z.string().optional(),
});

const updateForm10Schema = createForm10Schema.extend({});

type CreateForm10SchemaType = z.infer<typeof createForm10Schema>;
type UpdateForm10SchemaType = z.infer<typeof updateForm10Schema>;

export const form10SistemasProtecaoCarregamentoSchema = {
    create: createForm10Schema,
    update: updateForm10Schema,
};

export type Form10SistemasProtecaoCarregamentoSchemaType = {
    create: CreateForm10SchemaType,
    update: UpdateForm10SchemaType,
};
