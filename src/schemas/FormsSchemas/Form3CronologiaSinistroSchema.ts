import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const baseField = (field: string) => z.string().min(3, { message: `O campo ${field} é obrigatório.` }).optional();
const cepField = (field: string) => z.string().length(9, { message: `O campo ${field} é obrigatório e deve ter 9 dígitos. (00000-000)` }).optional();
const ufField = (field: string) => z.string().length(2, { message: `O campo ${field} é obrigatório e deve ter exatamente 2 letras.` }).optional();
const dataHoraField = (field: string) => z.string().min(3, { message: `O campo ${field} é obrigatório e deve ter pelo menos 3 caracteres.` }).optional();

const createSchema = z.object({
    numero_processo: z.string().min(7, {message: 'O número do processo é obrigatório e deve exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000'}).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    cep_local_sinistro: cepField('cep_local_sinistro'),
    endereco_local_sinistro: baseField('endereco_local_sinistro'),
    numero_local_sinistro: baseField('numero_local_sinistro'),
    complemento_local_sinistro: baseField('complemento_local_sinistro'),
    bairro_local_sinistro: baseField('bairro_local_sinistro'),
    cidade_local_sinistro: baseField('cidade_local_sinistro'),
    uf_local_sinistro: ufField('uf_local_sinistro'),
    comunicante: baseField('comunicante'),
    data_hora_sinistro: dataHoraField('data_hora_sinistro'),
    data_hora_comunicacao: dataHoraField('data_hora_comunicacao'),
    agente_pamcary: baseField('agente_pamcary'),
    data_hora_chegada_local: dataHoraField('data_hora_chegada_local'),
});

const updateSchema = createSchema.extend({
    // Adicione as propriedades específicas de atualização aqui, se houver alguma.
});

type CreateSchemaType = z.infer<typeof createSchema>;
type UpdateSchemaType = z.infer<typeof updateSchema>;

export const form3CronologiaSinistroSchema = {
    create: createSchema,
    update: updateSchema,
};

export type Form3CronologiaSinistroSchemaType = {
  create: CreateSchemaType,
  update: UpdateSchemaType,
};
