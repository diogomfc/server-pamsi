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
      relatorio_id: string;
      numero_processo: string;
      form:{
        form_id: string;
        form_nome: string;
        form_arquivo_campo_nome?: string;
      }
    }
  }
}