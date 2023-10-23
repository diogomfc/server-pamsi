import { sign } from 'jsonwebtoken';

import { env } from '@/env';

export class TokenProvider {
    async execute(usuario_id: string, funcao:string) {
        const token = sign({funcao}, env.JWT_SECRET, {
            subject: usuario_id,
            expiresIn: '1d'
        });
        return token;
    }
}