import winston from 'winston';

// Configuração do Winston
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.printf((info) => {
        return `${new Date().toISOString()} [${info.level}]: usuario: ${info.user}, message: ${info.message}`;
    }),
    transports: [
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/combined.log' }),
    ],
});