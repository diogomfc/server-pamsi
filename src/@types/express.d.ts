declare namespace Express {
  export interface Request {
    usuario: {
      id: string;
      nome?: string;
      email?: string;
      avatar?:  string | null;
      funcao: 'Admin' | 'Analista' | 'Supervisor' | 'Revisor';
      criado_em?: string;
    };
    numero_processo?: string;
  }
}