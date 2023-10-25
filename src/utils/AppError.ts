//Class para lidar com erros
export class AppError {
    message;
    statusCode;

    constructor(message: string, statusCode = 400) {
        this.message = message;
        this.statusCode = statusCode; 
    }
}