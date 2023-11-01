import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const Form3CronologiaSinistroCreateSchema = z.object({
    numero_processo: z.string().min(3, { message: 'O número do processo é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    cep_local_sinistro: z.string().min(3, { message: 'O CEP é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    endereco_local_sinistro: z.string().min(3, { message: 'O endereço é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    numero_local_sinistro: z.string().min(3, { message: 'O número é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    complemento_local_sinistro: z.string().min(3, { message: 'O complemento é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    bairro_local_sinistro: z.string().min(3, { message: 'O bairro é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    cidade_local_sinistro: z.string().min(3, { message: 'A cidade é obrigatória e deve ter pelo menos 3 caracteres.' }).optional(),
    uf_local_sinistro: z.string().length(2, { message: 'A UF é obrigatória e deve ter exatamente 2 letras.' }).optional(),
    comunicante: z.string().min(3, { message: 'O comunicante é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    data_hora_sinistro: z.string().min(3, { message: 'A data e hora do sinistro é obrigatória e deve ter pelo menos 3 caracteres.' }).optional(),
    data_hora_comunicacao: z.string().min(3, { message: 'A data e hora de comunicação é obrigatória e deve ter pelo menos 3 caracteres.' }).optional(),
    agente_pamcary: z.string().min(3, { message: 'O agente da Pamcary é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    data_hora_chegada_local: z.string().min(3, { message: 'A data e hora de chegada ao local é obrigatória e deve ter pelo menos 3 caracteres.' }).optional(),
});

type Form3CronologiaSinistroCreateSchema = z.infer<typeof Form3CronologiaSinistroCreateSchema>;

const Form3CronologiaSinistroUpdateSchema = Form3CronologiaSinistroCreateSchema.extend({
    // Adicione as propriedades específicas de atualização aqui, se houver alguma.
});

export const form3CronologiaSinistroSchema = {
    create: Form3CronologiaSinistroCreateSchema,
    update: Form3CronologiaSinistroUpdateSchema,
};
