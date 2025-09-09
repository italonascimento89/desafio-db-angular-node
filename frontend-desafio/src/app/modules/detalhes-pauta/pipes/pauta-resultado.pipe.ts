import { Pipe, PipeTransform } from '@angular/core';

import { IPautaDetalhes } from '../interfaces/pauta-detalhes.interface';
import { ResultadoPautaType } from '@app/shared/types/resultao-pautas.type';

@Pipe({
  name: 'pautaResultado',
})
export class PautaResultadoPipe implements PipeTransform {
  public transform(value: IPautaDetalhes): string {
    if (!value) {
      return '';
    }

    const MENSAGEM_MAP: Record<ResultadoPautaType, string> = {
      aprovado: `Sessão encerrada. Pauta aprovada com ${value.porcentagem_sim}% dos votos`,
      anulada: `Sessão encerrada. Pauta anulada por falta de votos.`,
      empate: `Sessão encerrada. Pauta não aprovada por empate de votos.`,
      reprovado: `Sessão encerrada. Pauta reprovada com ${value.porcentagem_nao}% de votos`,
    };

    return MENSAGEM_MAP[value.resultado] 
      ?? 'Sessão encerrada. Resultado desconhecido';
  }
}
