import { z } from 'zod';
import { Status_Formulario, Natureza_Sinistro } from '@prisma/client';

const Form2CaracteristicaSinistroSchema = z.object({
    numero_processo: z.string().min(3, { message: 'O número do processo é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    nome_seguradora: z.string().min(3, { message: 'O nome da seguradora é obrigatório e deve ter pelo menos 3 caracteres.' }),
    natureza_sinistro: z.nativeEnum(Natureza_Sinistro).optional(),
    carga_embarcada: z.string().min(1, { message: 'A carga embarcada é obrigatória.' }),
    valor_carga: z.string().min(1, { message: 'O valor da carga é obrigatório.' }),
    formulario_associado: z.string().optional(),
});

type Form2CaracteristicaSinistroSchema = z.infer<typeof Form2CaracteristicaSinistroSchema>;

const Form2CaracteristicaSinistroUpdateSchema = z.object({
    numero_processo: z.string().min(3, { message: 'O número do processo é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    nome_seguradora: z.string().min(3, { message: 'O nome da seguradora é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    natureza_sinistro: z.nativeEnum(Natureza_Sinistro).optional(),
    carga_embarcada: z.string().min(1, { message: 'A carga embarcada é obrigatória.' }).optional(),
    valor_carga: z.string().min(1, { message: 'O valor da carga é obrigatório.' }).optional(),
    formulario_associado: z.string().optional(),
});

export const form2CaracteristicaSinistroSchema = {
    create: Form2CaracteristicaSinistroSchema,
    update: Form2CaracteristicaSinistroUpdateSchema,
};
