import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const Form4DoCarregamentoCreateSchema = z.object({
    numero_processo: z.string().min(3, { message: 'O número do processo é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    transportadora: z.string().min(3, { message: 'A transportadora é obrigatória e deve ter pelo menos 3 caracteres.' }).optional(),
    valor_embarcado: z.string().min(3, { message: 'O valor embarcado é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    remetente: z.string().min(3, { message: 'O remetente é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    cep_origem: z.string().min(3, { message: 'O CEP de origem é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    endereco_origem: z.string().min(3, { message: 'O endereço de origem é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    numero_origem: z.string().min(3, { message: 'O número de origem é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    cidade_origem: z.string().min(3, { message: 'A cidade de origem é obrigatória e deve ter pelo menos 3 caracteres.' }).optional(),
    bairro_origem: z.string().min(3, { message: 'O bairro de origem é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    uf_origem: z.string().length(2, { message: 'A UF de origem é obrigatória e deve ter exatamente 2 letras.' }).optional(),
    complemento_origem: z.string().min(3, { message: 'O complemento de origem é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    destinatario: z.string().min(3, { message: 'O destinatário é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    cep_destino: z.string().min(3, { message: 'O CEP de destino é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    endereco_destino: z.string().min(3, { message: 'O endereço de destino é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    numero_destino: z.string().min(3, { message: 'O número de destino é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    cidade_destino: z.string().min(3, { message: 'A cidade de destino é obrigatória e deve ter pelo menos 3 caracteres.' }).optional(),
    bairro_destino: z.string().min(3, { message: 'O bairro de destino é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    uf_destino: z.string().length(2, { message: 'A UF de destino é obrigatória e deve ter exatamente 2 letras.' }).optional(),
    complemento_destino: z.string().min(3, { message: 'O complemento de destino é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    numero_crtc_dacte: z.string().min(3, { message: 'O número do CRTC/DACTE é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    numero_nota_fiscal: z.string().min(3, { message: 'O número da nota fiscal é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    manifesto: z.string().min(3, { message: 'O manifesto é obrigatório e deve ter pelo menos 3 caracteres.' }).optional()
});

export type Form4DoCarregamentoCreateSchemaType = z.infer<typeof Form4DoCarregamentoCreateSchema>;

const Form4DoCarregamentoUpdateSchema = Form4DoCarregamentoCreateSchema.extend({
    // Adicione as propriedades específicas de atualização aqui, se houver alguma.
});

export const form4DoCarregamentoSchema = {
    create: Form4DoCarregamentoCreateSchema,
    update: Form4DoCarregamentoUpdateSchema,
};
