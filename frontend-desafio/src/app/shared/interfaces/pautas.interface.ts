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
  status: StatusPautaType;
  tempo_restante: number;
}

export type StatusPautaType = 'ABERTA' | 'ENCERRADA';