import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'; // Importe o plugin de fuso horário

dayjs.extend(utc);
dayjs.extend(timezone); // Use o plugin de fuso horário

// Defina o fuso horário para o Brasil
dayjs.tz.setDefault('America/Sao_Paulo');

export function FormatDate(date: Date | string, locale: string = 'pt-BR'): string {
    return dayjs(date).locale(locale).format('DD-MM-YYYY HH:mm:ss');
}

export function GetCurrentDate(locale: string = 'pt-BR'): string {
    return dayjs().locale(locale).format('DD-MM-YYYY HH:mm:ss');
}

