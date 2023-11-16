import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const createForm12Schema = z.object({
    numero_processo: z.string()
        .min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' })
        .optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),

    // Depósito
    deposito_sinistrado_segurado: z.boolean().optional(),
    deposito_seguranca_eletronica: z.boolean().optional(),
    deposito_seguranca_patrimonial: z.boolean().optional(),
    deposito_mercadoria_carregada: z.boolean().optional(),

    // Dispositivos de Segurança no local de armazenamento
    dispositivo_seguranca_cftv: z.boolean().optional(),
    dispositivo_seguranca_botao_panico: z.boolean().optional(),
    dispositivo_seguranca_alarme_sonoro: z.boolean().optional(),
    dispositivo_seguranca_sensores_invasao: z.boolean().optional(),
    dispositivo_seguranca_cerca_eletrica: z.boolean().optional(),
    dispositivo_seguranca_sensores_presenca: z.boolean().optional(),
    dispositivo_seguranca_sirene: z.boolean().optional(),
    dispositivo_seguranca_outros: z.boolean().optional(),

    // Empresa de Segurança Patrimonial, quando aplicável.
    empresa_seguranca_patrimonial_nome: z.string().optional(),
    empresa_seguranca_patrimonial_cnpj: z.string().optional(),
    empresa_seguranca_patrimonial_cep: z.string().optional(),
    empresa_seguranca_patrimonial_endereco: z.string().optional(),
    empresa_seguranca_patrimonial_numero: z.string().optional(),
    empresa_seguranca_patrimonial_complemento: z.string().optional(),
    empresa_seguranca_patrimonial_bairro: z.string().optional(),
    empresa_seguranca_patrimonial_cidade: z.string().optional(),
    empresa_seguranca_patrimonial_uf: z.string().optional(),
    empresa_seguranca_patrimonial_telefone: z.string().optional(),
    empresa_seguranca_patrimonial_celular: z.string().optional(),
    empresa_seguranca_patrimonial_email: z.string().optional(),
    empresa_seguranca_patrimonial_representante: z.string().optional(),
});

const updateForm12Schema = createForm12Schema.extend({});

export const form12GerenciamentoRiscoDepositoSchema = {
    create: createForm12Schema,
    update: updateForm12Schema,
};

export type Form12GerenciamentoRiscoDepositoSchemaType = {
  create: z.infer<typeof createForm12Schema>,
  update: z.infer<typeof updateForm12Schema>,
};
