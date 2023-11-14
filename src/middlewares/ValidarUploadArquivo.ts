import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import { prisma } from '@/database';

// Verificar se existe um formulario com id
export async function validarUploadArquivo (req: Request, res: Response, next: NextFunction) {
    const { numero_processo, relatorio_id, form_id } = req.params;

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
                    },
                    form13_Locais_Evento:{
                        where: {
                            id: form_id,
                        },
                    },
                    form16_Anexos_Fotograficos: {
                        where: {
                            id: form_id,
                        },
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

    req.relatorio = {
        numero_processo,
        relatorio_id,
        form:{
            form_id,
            form_nome: formulario_nome,
        }
    };

    next();
}


