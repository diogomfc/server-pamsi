import { z } from 'zod';
import { Tipo_Formulario, Status_Relatorio, Natureza_Sinistro } from '@prisma/client';

// const RelatorioBaseSchema = z.object({
//     numero_processo: z.string().min(5, {message: 'Favor informa o número de processo gerado pela torre de operação.'}),
//     cliente: z.string().min(1, {message: 'Favor informa o nome do cliente.'}),
//     natureza_sinistro: z.nativeEnum(Natureza_Sinistro).refine((value) => {
//         return Object.values(Natureza_Sinistro).includes(value);
//     }, {message: 'Favor informa a natureza do sinistro.'}),
//     cnpj: z.string().min(0, {message: 'Favor informa o CNPJ do cliente.'}),
//     usuarios_permitidos: z.array(z.string()).optional(),
//     formularios_selecionados: z.array(z.nativeEnum(Tipo_Formulario)).optional(),
// });

// const CreateRelatorioSchema = RelatorioBaseSchema.extend({
//     data_entrada: z.date().optional(),
//     data_emissao: z.date().optional(),
// });
// type CreateRelatorioSchema = z.infer<typeof CreateRelatorioSchema>;

// const UpdateRelatorioSchema = RelatorioBaseSchema.extend({
//     data_emissao: z.date().optional(),
//     status: z.nativeEnum(Status_Relatorio).optional(),
//     usuario_responsavel_id: z.string().optional(),
// });
// type UpdateRelatorioSchema = z.infer<typeof UpdateRelatorioSchema>;

// export const relatorioSchema = {
//     create: CreateRelatorioSchema,
//     update: UpdateRelatorioSchema,
// };

// export type RelatorioSchema = CreateRelatorioSchema | UpdateRelatorioSchema;

const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

const CreateRelatorioSchema = z.object({
    numero_processo: z.string().min(5, {message: 'O número do processo é obrigatório e deve ter pelo menos 5 caracteres.'}),
    natureza_sinistro: z.nativeEnum(Natureza_Sinistro).refine((value) => {
        return Object.values(Natureza_Sinistro).includes(value);
    }, {message: 'Por favor, selecione a natureza do sinistro.'}),
    cliente: z.string().min(1, {message: 'O nome do cliente é obrigatório.'}),
    cnpj: z.string().refine(value => cnpjRegex.test(value), {
        message: 'Por favor, insira um CNPJ válido no formato XX.XXX.XXX/XXXX-XX.',
    }),
    formularios_selecionados: z.array(z.nativeEnum(Tipo_Formulario)).optional(),
    usuarios_permitidos: z.array(z.string()).optional(),
    data_entrada: z.date().optional(),
    data_emissao: z.date().optional(),
});

type CreateRelatorioSchema = z.infer<typeof CreateRelatorioSchema>;

const UpdateRelatorioSchema = z.object({
    numero_processo: z.string().min(5, {message: 'O número do processo é obrigatório e deve ter pelo menos 5 caracteres.'}).optional(),
    natureza_sinistro: z.nativeEnum(Natureza_Sinistro).refine((value) => {
        return Object.values(Natureza_Sinistro).includes(value);
    }, {message: 'Por favor, selecione a natureza do sinistro.'}).optional(),
    cliente: z.string().min(1, {message: 'O nome do cliente é obrigatório.'}).optional(),
    cnpj: z.string().refine(value => cnpjRegex.test(value), {
        message: 'Por favor, insira um CNPJ válido no formato XX.XXX.XXX/XXXX-XX.',
    }).optional(),
    formularios_selecionados: z.array(z.nativeEnum(Tipo_Formulario)).optional(),
    status: z.nativeEnum(Status_Relatorio).optional(),
    status_recuperacao_carga: z.string().optional(),
    fato_gerador_recuperacao_carga: z.string().optional(),
    usuario_responsavel_id: z.string().optional(),
    usuarios_permitidos: z.array(z.string()).optional(),
    data_entrada: z.date().optional(),
    data_emissao: z.date().optional(),
});
type UpdateRelatorioSchema = z.infer<typeof UpdateRelatorioSchema>;

export const relatorioSchema = {
    create: CreateRelatorioSchema,
    update: UpdateRelatorioSchema,
};
