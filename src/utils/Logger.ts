import winston, { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { FormatDate } from './DateUtils';

// Criando um filtro personalizado
const infoOnly = format((info) => {
    return info.level === 'info' ? info : false;
});

const transportInfo = new transports.DailyRotateFile({
    level: 'info',
    dirname: './logs/info', // Diretório para logs de nível 'info'
    filename: 'pamsi-info-%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxFiles: '7d',
    format: format.combine(
        infoOnly(),
        format.printf((info) => {
            const emoji = info.level === 'info' ? '🔵' : '';
            const formattedDate = FormatDate(new Date());
            const method = info.method ? `METHOD: ${info.method}` : '';
            const url = info.url ? `URL: ${info.url}` : '';
            return `${emoji} [${info.level}] - ${formattedDate}\n${method}\n${url}\nMESSAGE: ${info.message}\n\n`;
        }),
    ),
});

const transportError = new transports.DailyRotateFile({
    level: 'error',
    dirname: './logs/error', // Diretório para logs de nível 'error'
    filename: 'pamsi-error-%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxFiles: '7d',
    format: format.combine(
        format.printf((info) => {
            const emoji = info.level === 'error' ? '❌' : '';
            const formattedDate = FormatDate(new Date());
            const method = info.method ? `METHOD: ${info.method}` : '';
            const url = info.url ? `URL: ${info.url}` : '';
            return `${emoji} [${info.level}] - ${formattedDate}\n${method}\n${url}\nMESSAGE: ${info.message}\n\n`;
        }),
    ),
});

export const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
        transportInfo,
        transportError
    ]
});

