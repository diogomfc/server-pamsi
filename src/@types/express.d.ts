declare namespace Express {
  export interface Request {
    usuario: {
      id: string;
      nome: string;
      email: string;
      funcao: 'Admin' | 'Analista' | 'Supervisor' | 'Revisor';
    };
    numero_processo: string | null;
  }
}