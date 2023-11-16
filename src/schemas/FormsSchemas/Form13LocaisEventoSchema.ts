import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';
import { Regex } from '@/utils/RegexUtils';

const baseField = (field: string) =>
    z.string().min(3, { message: `O campo ${field} é obrigatório.` }).optional();

const createForm13LocaisEventoSchema = z.object({
    numero_processo: z.string().min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' }).optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),

    // Local da Abordagem
    local_abordagem_rodovia: baseField('local_abordagem_rodovia'),
    local_abordagem_cep:  z.string().regex(Regex.cep, { message: 'O campo local_abordagem_cep é obrigatório e deve ter o formato 00000-000.' }).optional(),
    local_abordagem_endereco: baseField('local_abordagem_endereco'),
    local_abordagem_numero: baseField('local_abordagem_numero'),
    local_abordagem_complemento: baseField('local_abordagem_complemento'),
    local_abordagem_bairro: baseField('local_abordagem_bairro'),
    local_abordagem_cidade: baseField('local_abordagem_cidade'),
    local_abordagem_uf: z.string().length(2, { message: 'O campo UF é obrigatório e deve ter exatamente 2 letras.' }).optional(),
    local_abordagem_ponto_referencia: baseField('local_abordagem_ponto_referencia'),
    local_abordagem_latitude: baseField('local_abordagem_latitude'),
    local_abordagem_longitude: baseField('local_abordagem_longitude'),
    local_abordagem_data_hora: baseField('local_abordagem_data_hora'),
    local_abordagem_cftv: z.boolean().optional(),
    local_abordagem_testemunhas: z.boolean().optional(),
    fotos_local_da_Abordagem: z.array(z.string()).optional(),
    
    // Local de Cativeiro e Abandono do Motorista
    local_cativeiro_rodovia: baseField('local_cativeiro_rodovia'),
    local_cativeiro_cep: z.string().regex(Regex.cep, { message: 'O campo local_cativeiro_cep é obrigatório e deve ter o formato 00000-000.' }).optional(),
    local_cativeiro_endereco: baseField('local_cativeiro_endereco'),
    local_cativeiro_numero: baseField('local_cativeiro_numero'),
    local_cativeiro_complemento: baseField('local_cativeiro_complemento'),
    local_cativeiro_bairro: baseField('local_cativeiro_bairro'),
    local_cativeiro_cidade: baseField('local_cativeiro_cidade'),
    local_cativeiro_uf: z.string().length(2, { message: 'O campo UF é obrigatório e deve ter exatamente 2 letras.' }).optional(),
    local_cativeiro_ponto_referencia: baseField('local_cativeiro_ponto_referencia'),
    local_cativeiro_latitude: baseField('local_cativeiro_latitude'),
    local_cativeiro_longitude: baseField('local_cativeiro_longitude'),
    local_cativeiro_data_hora: baseField('local_cativeiro_data_hora'),
    local_cativeiro_cftv: z.boolean().optional(),
    local_cativeiro_testemunhas: z.boolean().optional(),
    fotos_local_de_Cativeiro_e_Abandono_do_Motorista: z.array(z.string()).optional(),
     
    // Local de Encontro do Veículo
    local_encontro_rodovia: baseField('local_encontro_rodovia'),
    local_encontro_cep: z.string().regex(Regex.cep, { message: 'O campo local_encontro_cep é obrigatório e deve ter o formato 00000-000.' }).optional(),
    local_encontro_endereco: baseField('local_encontro_endereco'),
    local_encontro_numero: baseField('local_encontro_numero'),
    local_encontro_complemento: baseField('local_encontro_complemento'),
    local_encontro_bairro: baseField('local_encontro_bairro'),
    local_encontro_cidade: baseField('local_encontro_cidade'),
    local_encontro_uf: z.string().length(2, { message: 'O campo UF é obrigatório e deve ter exatamente 2 letras.' }).optional(),
    local_encontro_ponto_referencia: baseField('local_encontro_ponto_referencia'),
    local_encontro_latitude: baseField('local_encontro_latitude'),
    local_encontro_longitude: baseField('local_encontro_longitude'),
    local_encontro_data_hora: baseField('local_encontro_data_hora'),
    local_encontro_cftv: z.boolean().optional(),
    local_encontro_testemunhas: z.boolean().optional(),
    fotos_local_de_Encontro_do_Veiculo: z.array(z.string()).optional(),


    // Local Local de Recuperação da Carga
    local_recuperacao_rodovia: baseField('local_recuperacao_rodovia'),
    local_recuperacao_cep:  z.string().regex(Regex.cep, { message: 'O campo local_recuperacao_cep é obrigatório e deve ter o formato 00000-000.' }).optional(),
    local_recuperacao_endereco: baseField('local_recuperacao_endereco'),
    local_recuperacao_numero: baseField('local_recuperacao_numero'),
    local_recuperacao_complemento: baseField('local_recuperacao_complemento'),
    local_recuperacao_bairro: baseField('local_recuperacao_bairro'),
    local_recuperacao_cidade: baseField('local_recuperacao_cidade'),
    local_recuperacao_uf: z.string().length(2, { message: 'O campo UF é obrigatório e deve ter exatamente 2 letras.' }).optional(),
    local_recuperacao_ponto_referencia: baseField('local_recuperacao_ponto_referencia'),
    local_recuperacao_latitude: baseField('local_recuperacao_latitude'),
    local_recuperacao_longitude: baseField('local_recuperacao_longitude'),
    local_recuperacao_data_hora: baseField('local_recuperacao_data_hora'),
    local_recuperacao_cftv: z.boolean().optional(),
    local_recuperacao_testemunhas: z.boolean().optional(),
    fotos_local_de_Recuperacao_da_Carga: z.array(z.string()).optional(),
});

const updateForm13LocaisEventoSchema = createForm13LocaisEventoSchema.extend({});

export const form13LocaisEventoSchema = {
    create: createForm13LocaisEventoSchema,
    update: updateForm13LocaisEventoSchema,
};

export type Form13LocaisEventoSchemaType = {
  create: z.infer<typeof createForm13LocaisEventoSchema>,
  update: z.infer<typeof updateForm13LocaisEventoSchema>,
};
