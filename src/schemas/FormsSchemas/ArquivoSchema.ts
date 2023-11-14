import { z } from 'zod';

const createSchema = z.object({
    numero_processo: z.string()
        .min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' })
        .optional(),
    form_id: z.string().optional(),
    form_nome: z.string().optional(),
    arquivo_nome: z.string().optional(),
    arquivo_tamanho: z.number().optional(),
    arquivo_chave: z.string().optional(),
    arquivo_localizacao: z.string().optional(),
});

const updateSchema = createSchema.extend({});

type CreateSchemaType = z.infer<typeof createSchema>;
type UpdateSchemaType = z.infer<typeof updateSchema>;

export const arquivoSchema = {
    create: createSchema,
    update: updateSchema,
};

export type ArquivoSchemaType = {
  create: CreateSchemaType,
  update: UpdateSchemaType,
};
