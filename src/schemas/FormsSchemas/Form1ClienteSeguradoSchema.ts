import { z } from 'zod';
import { Status_Formulario } from '@prisma/client';

const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;


const Form1ClienteSeguradoSchema = z.object({
    numero_processo: z.string().min(3, { message: 'O número do processo é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    status:  z.nativeEnum(Status_Formulario).optional(),
    data_cadastro: z.date().optional(),
    nome_cliente: z.string().min(3, { message: 'O nome do cliente é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    cnpj: z.string().refine(value => cnpjRegex.test(value), {
        message: 'Por favor, insira um CNPJ válido no formato XX.XXX.XXX/XXXX-XX.',
    }).optional(),
    telefone: z.string().min(10, { message: 'O número de telefone é obrigatório e deve ter pelo menos 10 dígitos.' }),
    celular: z.string().min(11, { message: 'O número do celular é obrigatório e deve ter pelo menos 11 dígitos.' }),
    email: z.string().email({ message: 'Por favor, insira um endereço de email válido.' }),
    representante: z.string().min(3, { message: 'O nome do representante é obrigatório e deve ter pelo menos 3 caracteres.' }),
    cep: z.string().length(8, { message: 'O CEP é obrigatório e deve ter exatamente 8 dígitos.' }),
    endereco: z.string().min(5, { message: 'O endereço é obrigatório e deve ter pelo menos 5 caracteres.' }),
    numero: z.string().min(1, { message: 'O número é obrigatório.' }),
    complemento: z.string().optional(),
    bairro: z.string().min(3, { message: 'O bairro é obrigatório e deve ter pelo menos 3 caracteres.' }),
    cidade: z.string().min(3, { message: 'A cidade é obrigatória e deve ter pelo menos 3 caracteres.' }),
    uf: z.string().length(2, { message: 'A UF é obrigatória e deve ter exatamente 2 letras.' }),
});


type Form1ClienteSeguradoSchema = z.infer<typeof Form1ClienteSeguradoSchema>;

const Form1ClienteSeguradoUpdateSchema = z.object({
    numero_processo: z.string().min(3, { message: 'O número do processo é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    status:  z.nativeEnum(Status_Formulario).optional(),
    nome_cliente: z.string().min(3, { message: 'O nome do cliente é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    cnpj: z.string().refine(value => cnpjRegex.test(value), {
        message: 'Por favor, insira um CNPJ válido no formato XX.XXX.XXX/XXXX-XX.',
    }),
    telefone: z.string().min(10, { message: 'O número de telefone é obrigatório e deve ter pelo menos 10 dígitos.' }).optional(),
    celular: z.string().min(11, { message: 'O número do celular é obrigatório e deve ter pelo menos 11 dígitos.' }).optional(),
    email: z.string().email({ message: 'Por favor, insira um endereço de email válido.' }).optional(),
    representante: z.string().min(3, { message: 'O nome do representante é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    cep: z.string().length(8, { message: 'O CEP é obrigatório e deve ter exatamente 8 dígitos.' }).optional(),
    endereco: z.string().min(5, { message: 'O endereço é obrigatório e deve ter pelo menos 5 caracteres.' }).optional(),
    numero: z.string().min(1, { message: 'O número é obrigatório.' }).optional(),
    complemento: z.string().optional(),
    bairro: z.string().min(3, { message: 'O bairro é obrigatório e deve ter pelo menos 3 caracteres.' }).optional(),
    cidade: z.string().min(3, { message: 'A cidade é obrigatória e deve ter pelo menos 3 caracteres.' }).optional(),
    uf: z.string().length(2, { message: 'A UF é obrigatória e deve ter exatamente 2 letras.' }).optional(),
});


export const form1ClienteSeguradoSchema ={
    create: Form1ClienteSeguradoSchema,
    update: Form1ClienteSeguradoUpdateSchema,
};
