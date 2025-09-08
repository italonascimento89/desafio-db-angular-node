import { ResultadoPautaType } from '@app/shared/types/resultao-pautas.type';

export interface IPautaDetalhes {
  id_pauta: string;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  status_sessao: 'aberta' | 'encerrada';
  resultado: ResultadoPautaType;
  porcentagem_sim: number;
  porcentagem_nao: number;
  total_sim: number;
  total_nao: number;
  total: number;
}
