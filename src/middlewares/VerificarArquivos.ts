/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import { prisma } from '@/database';



export function verificarArquivo (modelPrismaNome: any, ...fields: string[]) {
    return async function(req: Request, res: Response, next: NextFunction) {
        const { numero_processo, relatorio_id } = req.params;

        const registro = await prisma.`${modelPrismaNome}`.findUnique({
            where: { 
                id: relatorio_id,
                numero_processo,
            },
            select:{
                numero_processo: true,
            }
        });

        if (!registro) {
            throw new AppError('Registro não encontrado. Middle');
        }

        const attachedFields = [];

        for (const field of fields) {
            if (registro[field]) {
                attachedFields.push(field);
            }
        }

        if (attachedFields.length > 0) {
            throw new AppError(`Já existe(m) arquivo(s) anexado(s) para ${attachedFields.join(', ')}. Por favor, exclua o(s) arquivo(s) existente(s) antes de fazer o upload de um novo.`);
        }

        //Recuperar o numero do processo do relatório para ser utilizado
        req.relatorio.numero_processo = registro.numero_processo;

        next();
    };
}
