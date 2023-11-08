import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const createSchema = z.object({
    numero_processo: z.string()
        .min(7, { message: 'O número do processo é obrigatório e deve ser exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000' })
        .optional(),
    status: z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    //Rastreamento
    rastreador_sistema_rastreamento: z.string().optional(),
    rastreador_marca: z.string().optional(),
    rastreador_modelo: z.string().optional(),
    rastreador_tipo: z.string().optional(),
    rastreador_posicionamento: z.string().optional(),
    
    //Segunda tecnologia de Rastreamento
    segunda_tecnologia_rastreamento: z.string().optional(),
    segunda_tecnologia_marca: z.string().optional(),
    segunda_tecnologia_modelo: z.string().optional(),
    segunda_tecnologia_tipo: z.string().optional(),
    segunda_tecnologia_posicionamento: z.string().optional(),
    
    //Outros Sistemas de Rastreamento
    outros_sistemas_rastreamento: z.string().optional(),
    outros_sistemas_marca: z.string().optional(),
    outros_sistemas_modelo: z.string().optional(),
    outros_sistemas_tipo: z.string().optional(),
    outros_sistemas_posicionamento: z.string().optional(),

    //Tipo de Sensores e Atuadores
    sensor_bloqueio_combustivel: z.boolean().optional(),
    sensor_bloqueio_ignicao: z.boolean().optional(),
    sensor_trava_5Roda: z.boolean().optional(),
    sensor_trava_portas_bau: z.boolean().optional(),
    sensor_porta_cabine: z.boolean().optional(),
    sensor_porta_bau: z.boolean().optional(),
    sensor_isca: z.boolean().optional(),
    sensor_sonoros_visuais: z.boolean().optional(),
    sensor_botao_panico: z.boolean().optional(),
    sensor_teclado: z.boolean().optional(),
    sensor_desengate_carreta: z.boolean().optional(),
    sensor_outros: z.boolean().optional(),
    sensor_outros_descricao: z.string().optional(),
    
    //Central de monitoramento
    plano_viagem: z.boolean().optional(),
    tacografo: z.boolean().optional(),
    paradas_nao_programadas: z.boolean().optional(),
    rastramento_analisado: z.boolean().optional(),
    tacografo_analisado: z.boolean().optional(),
    historico_rastreamento: z.boolean().optional(),
    macros_transmitida: z.boolean().optional(),
    sirene_ativada: z.boolean().optional(),
    bloqueio_rastreador: z.boolean().optional(),
    vandalismo_rastreador: z.boolean().optional(),

    //Sobre a Última Posição do Rastreamento
    ultima_posicao_rastreamento_data_hora: z.string().optional(),
    ultima_posicao_rastreamento_descricao: z.string().optional(),

    //Sobre os Discos de Tacógrafo
    disco_tacografo_data_hora: z.string().optional(),
    disco_tacografo_descricao: z.string().optional(),
});

const updateSchema = createSchema.extend({});

type CreateSchemaType = z.infer<typeof createSchema>;
type UpdateSchemaType = z.infer<typeof updateSchema>;

export const form9GerenciamentoRiscoSchema = {
    create: createSchema,
    update: updateSchema,
};

export type Form9GerenciamentoRiscoSchemaType = {
    create: CreateSchemaType,
    update: UpdateSchemaType,
};
