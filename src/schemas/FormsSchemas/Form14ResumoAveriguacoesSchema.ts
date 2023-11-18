import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const baseField = (field: string) =>
    z.string().min(3, { message: `O campo ${field} é obrigatório.` }).optional();

const createForm14ResumoAveriguacoesSchema = z.object({
    numero_processo: z.string().min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' }).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),

    resumo_averiguacoes: baseField('resumo_averiguacoes'),
});   

const updateForm14ResumoAveriguacoesSchema = createForm14ResumoAveriguacoesSchema.extend({});

export const form14ResumoAveriguacoesSchema = {
    create: createForm14ResumoAveriguacoesSchema,
    update: updateForm14ResumoAveriguacoesSchema,
};

export type Form14ResumoAveriguacoesSchema = {
    create: z.infer<typeof createForm14ResumoAveriguacoesSchema>;
    update: z.infer<typeof updateForm14ResumoAveriguacoesSchema>;
}