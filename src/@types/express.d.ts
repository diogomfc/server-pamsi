declare namespace Express {
  export interface Request {
    usuario: {
      id: string;
      nome: string;
      email: string;
      avatar: string?;
      funcao: 'Admin' | 'Analista' | 'Supervisor' | 'Revisor';
    };
    relatorio:{
      id: string;
      numero_processo: string;
    }
  }
}