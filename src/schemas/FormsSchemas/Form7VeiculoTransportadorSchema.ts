import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const baseField = (field: string) =>
    z.string().min(3, { message: `O campo ${field} é obrigatório.` }).optional();

const createSchema = z.object({
    numero_processo: z.string()
        .min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' })
        .optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    placa_cavalo_mecanico: baseField('placa_cavalo_mecanico'),
    renavam_cavalo_mecanico: baseField('renavam_cavalo_mecanico'),
    chassi_cavalo_mecanico: baseField('chassi_cavalo_mecanico'),
    marca_cavalo_mecanico: baseField('marca_cavalo_mecanico'),
    modelo_cavalo_mecanico: baseField('modelo_cavalo_mecanico'),
    ano_fabricacao_cavalo_mecanico: baseField('ano_fabricacao_cavalo_mecanico'),
    ano_modelo_cavalo_mecanico: baseField('ano_modelo_cavalo_mecanico'),
    cor_cavalo_mecanico: baseField('cor_cavalo_mecanico'),
    proprietario_cavalo_mecanico: baseField('proprietario_cavalo_mecanico'),
    cpf_cnpj_proprietario_cavalo_mecanico: baseField('cpf_cnpj_proprietario_cavalo_mecanico'),
    uf_cavalo_mecanico:  z.string().length(2, { message: 'O campo UF é obrigatório e deve ter exatamente 2 letras.' }).optional(),
    placa_carreta: baseField('placa_carreta'),
    renavam_carreta: baseField('renavam_carreta'),
    chassi_carreta: baseField('chassi_carreta'),
    marca_carreta: baseField('marca_carreta'),
    modelo_carreta: baseField('modelo_carreta'),
    ano_fabricacao_carreta: baseField('ano_fabricacao_carreta'),
    ano_modelo_carreta: baseField('ano_modelo_carreta'),
    cor_carreta: baseField('cor_carreta'),
    proprietario_carreta: baseField('proprietario_carreta'),
    cpf_cnpj_proprietario_carreta: baseField('cpf_cnpj_proprietario_carreta'),
    uf_carreta:  z.string().length(2, { message: 'O campo UF é obrigatório e deve ter exatamente 2 letras.' }).optional(),
});

const updateSchema = createSchema.extend({});

type CreateSchemaType = z.infer<typeof createSchema>;
type UpdateSchemaType = z.infer<typeof updateSchema>;

export const form7VeiculoTransportadorSchema = {
    create: createSchema,
    update: updateSchema,
};

export type Form7VeiculoTransportadorSchemaType = {
  create: CreateSchemaType,
  update: UpdateSchemaType,
};
