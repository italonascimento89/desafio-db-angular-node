export interface IPaginacaoPauta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  pautas: IPauta[];
}

export interface IPauta {
  id: string;
  nome: string;
  descricao: string;
  status: 'ABERTA' | 'ENCERRADA';
  tempo_restante: number;
}
