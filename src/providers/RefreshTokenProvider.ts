import { prisma } from '@/database';
import dayjs from 'dayjs';

export class RefreshTokenProvider {
    async execute(usuario_id: string) {
        const tokenAntigo = await prisma.tokenAtualizacao.findFirst({
            where: {
                usuario_id
            }
        });

        if(tokenAntigo){
            await prisma.tokenAtualizacao.delete({
                where: {
                    id: tokenAntigo.id
                }
            });
        }

        const expira_em = dayjs().add(15, 'm').unix();


        const tokenAtualizado = await prisma.tokenAtualizacao.create({
            data: {
                usuario_id,
                expira_em
            }
        });

        return tokenAtualizado;

    }
}