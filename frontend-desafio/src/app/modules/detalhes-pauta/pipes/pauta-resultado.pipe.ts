import { Pipe, PipeTransform } from '@angular/core';

import { IPautaDetalhes } from '../interfaces/pauta-detalhes.interface';

@Pipe({
  name: 'pautaResultado',
})
export class PautaResultadoPipe implements PipeTransform {
  public transform(value: IPautaDetalhes): string {
    if (value.resultado === 'aprovado') {
      return `Sessão encerrada. Pauta aprovada com ${value.porcentagem_sim}% dos votos`;
    }

    if (value.resultado === 'anulada') {
      return `Sessão encerrada. Pauta anulada por falta de votos.`;
    }

    if (value.resultado === 'empate') {
      return `Sessão encerrada. Pauta não aprovada por empate de votos.`;
    }

    return `Sessão encerrada. Pauta reprovada com ${value.porcentagem_nao}% de votos`;
  }
}
