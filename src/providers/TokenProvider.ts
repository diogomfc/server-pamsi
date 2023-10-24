import { sign } from 'jsonwebtoken';

import { env } from '@/env';

export class TokenProvider {
    async execute(usuario_id: string, nome:string, funcao:string) {
        const token = sign({
            nome,
            funcao
        }, env.JWT_SECRET, {
            subject: usuario_id,
            expiresIn: env.JWT_EXPIRES_IN,
        });
        return token;
    }
}