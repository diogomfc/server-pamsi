import winston, { format, transports } from 'winston';
import 'winston-daily-rotate-file';


// Configuração do Winston
// export const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.printf((info) => {
//         return `${new Date().toISOString()} [${info.level}]: message: ${info.message}`;
//     }),
//     transports: [
//         new DailyRotateFile({
//             level: 'info',
//             dirname: './logs/info', // Diretório para logs de nível 'info'
//             filename: 'pamsi-info-%DATE%.log',
//             datePattern: 'DD-MM-YYYY',
//             zippedArchive: true,
//             maxFiles: '7d',
//         }),
//         new DailyRotateFile({
//             level: 'error',
//             dirname: './logs/error', // Diretório para logs de nível 'error'
//             filename: 'pamsi-error-%DATE%.log',
//             datePattern: 'DD-MM-YYYY',
//             zippedArchive: true,
//             maxFiles: '7d',
//         }),
//     ],
// });


// Definindo as cores para cada nível de log



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
        infoOnly(), // Aplicando o filtro personalizado
        //format.colorize({ all: true }), // Habilita a colorização
        format.printf((info) => {
            const emoji = info.level === 'info' ? '🔵' : '';
            return `${new Date().toISOString()} ${emoji} [${info.level}]: message: ${info.message}`;
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
            return `${new Date().toISOString()} ${emoji} [${info.level}]: message: ${info.message}`;
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

