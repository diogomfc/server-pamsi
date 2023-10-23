import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'; 
import utc from 'dayjs/plugin/utc'; 

dayjs.extend(utc);

export function FormatDate(date: Date | string, locale: string = 'pt-BR'): string {
    return dayjs(date).locale(locale).utc().format();
}

export function GetCurrentDate(locale: string = 'pt-BR'): string {
    return dayjs().locale(locale).utc().format();
}
