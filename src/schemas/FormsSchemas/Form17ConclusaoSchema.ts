import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const baseField = (field: string) =>
    z.string().min(3, { message: `O campo ${field} é obrigatório.` }).optional();

const createForm17ConclusaoSchema = z.object({
    numero_processo: z.string().min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' }).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),

    conclusao_averiguacoes: baseField('conclusao_averiguacoes'),
});   

const updateForm17ConclusaoSchema = createForm17ConclusaoSchema.extend({});

export const form17ConclusaoSchema = {
    create: createForm17ConclusaoSchema,
    update: updateForm17ConclusaoSchema,
};

export type Form17ConclusaoSchema = {
    create: z.infer<typeof createForm17ConclusaoSchema>;
    update: z.infer<typeof updateForm17ConclusaoSchema>;
}