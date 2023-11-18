import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const createForm15RecuperacaoCargaSchema = z.object({
    numero_processo: z.string().min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' }).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),

    recuperacao_carga_recuperada: z.boolean().optional().default(false),
    recuperacao_carga_parcial: z.boolean().optional().default(false),
    fato_gerador_recuperacao_carga: z.string().optional(),
});

const updateForm15RecuperacaoCargaSchema = createForm15RecuperacaoCargaSchema.extend({});

export const form15RecuperacaoCargaSchema = {
    create: createForm15RecuperacaoCargaSchema,
    update: updateForm15RecuperacaoCargaSchema,
};

export type Form15RecuperacaoCargaSchema = {
    create: z.infer<typeof createForm15RecuperacaoCargaSchema>;
    update: z.infer<typeof updateForm15RecuperacaoCargaSchema>;
}
