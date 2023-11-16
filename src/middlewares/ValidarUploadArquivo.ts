import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import { prisma } from '@/database';

// Verificar se existe um formulario com id
export async function validarUploadArquivo (req: Request, res: Response, next: NextFunction) {
    const { numero_processo, relatorio_id, form_id, form_arquivo_campo_nome } = req.params;

    // 1 - Verificar se o relatório existe
    const relatorioExistente = await prisma.relatorio.findFirst({
        where: {
            id: relatorio_id,
            numero_processo,
        },
    });

    if (!relatorioExistente) {
        throw new AppError('Relatório não encontrado.', 404);
    }

    // 2 - Verificar pelo form_id qual é o formulario associado ao relatorio
    const formAssociado = await prisma.relatorio.findUnique({
        where: {
            id: relatorio_id,
        },
        select:{
            formularios:{
                select:{
                    form11_Declaracao_Motorista_Ajudante: {
                        where: {
                            id: form_id,
                        },
                        select:{
                            arquivos_declaracoes: true,
                        }
                    },
                    form13_Locais_Evento:{
                        where: {
                            id: form_id,
                        },
                        select:{
                            fotos_local_da_abordagem: true,
                            fotos_local_de_cativeiro_e_abandono_do_motorista: true,
                            fotos_local_de_encontro_do_veiculo: true,
                            fotos_local_de_recuperacao_da_carga: true,
                        }
                    },
                    form16_Anexos_Fotograficos: {
                        where: {
                            id: form_id,
                        },
                        select:{
                            anexos_fotograficos: true,
                        }
                    },
                },
            }
        }
        
    });

    if (!formAssociado) {
        throw new AppError('Formulário não encontrado.', 404);
    }

    // 3- Verificar qual formulário não é nulo e associar um nome
    let formulario_nome;

    if (formAssociado?.formularios?.form11_Declaracao_Motorista_Ajudante) {
        formulario_nome = 'form11_Declaracao_Motorista_Ajudante';
    } else if (formAssociado?.formularios?.form13_Locais_Evento) {
        formulario_nome = 'form13_Locais_Evento';
    } else if (formAssociado?.formularios?.form16_Anexos_Fotograficos) {
        formulario_nome = 'form16_Anexos_Fotograficos';
    } else {
        throw new AppError('Formulário não encontrado.', 404);
    }

    // 4 - Verificar qual o campo do formulario que vai receber o arquivo
    // if (
    //     form_arquivo_campo_nome !== 'declaracao_motorista_ajudante' && 
    //   form_arquivo_campo_nome !== 'fotos_local_da_abordagem' &&
    //   form_arquivo_campo_nome !== 'fotos_local_de_cativeiro_e_abandono_do_motorista' &&
    //   form_arquivo_campo_nome !== 'fotos_local_de_encontro_do_veiculo' &&
    //   form_arquivo_campo_nome !== 'fotos_local_de_recuperacao_da_carga' &&
    //   form_arquivo_campo_nome !== 'anexos_fotograficos'
    // ) {
    //     throw new AppError('Campo do formulário não encontrado.', 404);
    // }


    // let form_arquivo_campo_nome;
    
    // if (formAssociado?.formularios?.form11_Declaracao_Motorista_Ajudante?.arquivos_declaracoes) {
    //     form_arquivo_campo_nome = 'arquivos_declaracoes';
    // } else if (formAssociado?.formularios?.form13_Locais_Evento?.fotos_local_da_Abordagem) {
    //     form_arquivo_campo_nome = 'fotos_local_da_Abordagem';
    // } else if (formAssociado?.formularios?.form13_Locais_Evento?.fotos_local_de_Cativeiro_e_Abandono_do_Motorista) {
    //     form_arquivo_campo_nome = 'fotos_local_de_Cativeiro_e_Abandono_do_Motorista';
    // } else if (formAssociado?.formularios?.form13_Locais_Evento?.fotos_local_de_Encontro_do_Veiculo) {
    //     form_arquivo_campo_nome = 'fotos_local_de_Encontro_do_Veiculo';
    // } else if (formAssociado?.formularios?.form13_Locais_Evento?.fotos_local_de_Recuperacao_da_Carga) {
    //     form_arquivo_campo_nome = 'fotos_local_de_Recuperacao_da_Carga';
    // } else if (formAssociado?.formularios?.form16_Anexos_Fotograficos?.anexos_fotograficos) {
    //     form_arquivo_campo_nome = 'anexos_fotograficos';
    // } else {
    //     throw new AppError('Formulário não encontrado.', 404);
    // }


    req.relatorio = {
        numero_processo,
        relatorio_id,
        form:{
            form_id,
            form_nome: formulario_nome,
            form_arquivo_campo_nome,
        }
    };

    next();
}


