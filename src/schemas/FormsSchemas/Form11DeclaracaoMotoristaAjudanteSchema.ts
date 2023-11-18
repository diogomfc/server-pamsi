import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const createForm11Schema = z.object({
    numero_processo: z.string()
        .min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' })
        .optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
});

const updateForm11Schema = createForm11Schema.extend({});

type CreateForm11SchemaType = z.infer<typeof createForm11Schema>;
type UpdateForm11SchemaType = z.infer<typeof updateForm11Schema>;

export const form11DeclaracaoMotoristaAjudanteSchema = {
    create: createForm11Schema,
    update: updateForm11Schema,
};

export type Form11DeclaracaoMotoristaAjudanteSchemaType = {
    create: CreateForm11SchemaType,
    update: UpdateForm11SchemaType,
};
