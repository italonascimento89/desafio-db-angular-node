import { Pipe, PipeTransform } from '@angular/core';

import { IPautaDetalhes } from '../interfaces/pauta-detalhes.interface';
import { VotosType } from '@app/shared/types/votos.type';

@Pipe({
  name: 'percentualVotos',
})
export class PercentualVotosPipe implements PipeTransform {
  public transform(value: IPautaDetalhes, tipo: VotosType): string {
    if (!value) {
      return '--';
    }

    const percentual = tipo === 'sim' ? value.porcentagem_sim : value.porcentagem_nao;

    if (!percentual) {
      return '--';
    }

    return `${percentual}%`;
  }
}
