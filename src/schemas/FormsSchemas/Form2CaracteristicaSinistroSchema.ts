import { z } from 'zod';
import { Status_Formulario, Natureza_Sinistro } from '@prisma/client';

const baseField = (field: string) => z.string().min(3, { message: `O campo ${field} é obrigatório.` }).optional();

const createSchema = z.object({
    numero_processo: z.string().min(7, {message: 'O número do processo é obrigatório e deve exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000'}).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    nome_seguradora: baseField('nome_seguradora'),
    natureza_sinistro: z.nativeEnum(Natureza_Sinistro).optional(),
    carga_embarcada: baseField('carga_embarcada'),
    valor_carga: baseField('valor_carga'),
});

const updateSchema = createSchema.extend({
});

type CreateSchemaType = z.infer<typeof createSchema>;
type UpdateSchemaType = z.infer<typeof updateSchema>;

export const form2CaracteristicaSinistroSchema = {
    create: createSchema,
    update: updateSchema,
};

export type Form2CaracteristicaSinistroSchemaType = {
  create: CreateSchemaType,
  update: UpdateSchemaType,
};
