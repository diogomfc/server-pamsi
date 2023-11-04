import { z } from 'zod';
import { Tipo_Formulario, Status_Relatorio, Natureza_Sinistro } from '@prisma/client';
import { Regex } from '@/utils/RegexUtils';

const CreateRelatorioSchema = z.object({
    numero_processo: z.string().min(7, {message: 'O número do processo é obrigatório e deve exatamente igual ao fornecido pela torre de operações. Exemplo: 000.000'}),
    natureza_sinistro: z.nativeEnum(Natureza_Sinistro).refine((value) => {
        return Object.values(Natureza_Sinistro).includes(value);
    }, {message: 'Por favor, selecione a natureza do sinistro.'}),
    cliente: z.string().min(1, {message: 'O nome do cliente é obrigatório.'}),
    cnpj: z.string().regex(Regex.cnpj, { message: 'O campo cnpj é obrigatório e deve ter o formato 00.000.000/0000-00.' }),
    formularios_selecionados: z.array(z.nativeEnum(Tipo_Formulario)).optional(),
    usuarios_permitidos: z.array(z.string()).optional(),
    data_entrada: z.date().optional(),
    data_emissao: z.date().optional(),
});

const UpdateRelatorioSchema = z.object({
    numero_processo: z.string().min(5, {message: 'O número do processo é obrigatório e deve ter pelo menos 5 caracteres.'}).optional(),
    natureza_sinistro: z.nativeEnum(Natureza_Sinistro).refine((value) => {
        return Object.values(Natureza_Sinistro).includes(value);
    }, {message: 'Por favor, selecione a natureza do sinistro.'}).optional(),
    cliente: z.string().min(1, {message: 'O nome do cliente é obrigatório.'}).optional(),
    cnpj: z.string().regex(Regex.cnpj, { message: 'O campo cnpj é obrigatório e deve ter o formato 00.000.000/0000-00.' }).optional(),
    formularios_selecionados: z.array(z.nativeEnum(Tipo_Formulario)).optional(),
    status: z.nativeEnum(Status_Relatorio).optional(),
    status_recuperacao_carga: z.string().optional(),
    fato_gerador_recuperacao_carga: z.string().optional(),
    usuario_responsavel_id: z.string().optional(),
    usuarios_permitidos: z.array(z.string()).optional(),
    data_entrada: z.date().optional(),
    data_emissao: z.date().optional(),
});

export const relatorioSchema = {
    create: CreateRelatorioSchema,
    update: UpdateRelatorioSchema,
};

type CreateRelatorioSchemaType = z.infer<typeof CreateRelatorioSchema>;
type UpdateRelatorioSchemaType = z.infer<typeof UpdateRelatorioSchema>;

export type RelatorioSchemaType = {
  create: CreateRelatorioSchemaType,
  update: UpdateRelatorioSchemaType,
}
