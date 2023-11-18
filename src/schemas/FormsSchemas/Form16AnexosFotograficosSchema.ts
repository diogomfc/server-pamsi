import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const createForm16Schema = z.object({
    numero_processo: z.string()
        .min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' })
        .optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
});

const updateForm16Schema = createForm16Schema.extend({});

type CreateForm16SchemaType = z.infer<typeof createForm16Schema>;
type UpdateForm16SchemaType = z.infer<typeof updateForm16Schema>;

export const form16AnexosFotograficosSchema = {
    create: createForm16Schema,
    update: updateForm16Schema,
};

export type Form16AnexosFotograficosSchemaType = {
    create: CreateForm16SchemaType,
    update: UpdateForm16SchemaType,
};
