import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const baseField = (field: string) => z.string().min(3, { message: `O campo ${field} é obrigatório.` }).optional();
const cepField = (field: string) => z.string().length(9, { message: `O campo ${field} é obrigatório e deve ter 9 dígitos. (00000-000)` }).optional();
const ufField = (field: string) => z.string().length(2, { message: `O campo ${field} é obrigatório e deve ter exatamente 2 letras.` }).optional();

const createSchema = z.object({
    numero_processo: z.string().min(7, {message: 'O número do processo é obrigatório e deve exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000'}).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    transportadora: baseField('transportadora'),
    valor_embarcado: baseField('valor_embarcado'),
    remetente: baseField('remetente'),
    cep_origem: cepField('cep_origem'),
    endereco_origem: baseField('endereco_origem'),
    numero_origem: baseField('numero_origem'),
    cidade_origem: baseField('cidade_origem'),
    bairro_origem: baseField('bairro_origem'),
    uf_origem: ufField('uf_origem'),
    complemento_origem: baseField('complemento_origem'),
    destinatario: baseField('destinatario'),
    cep_destino: cepField('cep_destino'),
    endereco_destino: baseField('endereco_destino'),
    numero_destino: baseField('numero_destino'),
    cidade_destino: baseField('cidade_destino'),
    bairro_destino: baseField('bairro_destino'),
    uf_destino: ufField('uf_destino'),
    complemento_destino: baseField('complemento_destino'),
    numero_crtc_dacte: baseField('numero_crtc_dacte'),
    numero_nota_fiscal: baseField('numero_nota_fiscal'),
    manifesto: baseField('manifesto')
});

const updateSchema = createSchema.extend({
});

type CreateSchemaType = z.infer<typeof createSchema>;
type UpdateSchemaType = z.infer<typeof updateSchema>;

export const form4DoCarregamentoSchema = {
    create: createSchema,
    update: updateSchema,
};

export type Form4DoCarregamentoSchemaType = {
  create: CreateSchemaType,
  update: UpdateSchemaType,
};
