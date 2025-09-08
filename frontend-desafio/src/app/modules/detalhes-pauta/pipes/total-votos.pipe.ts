import { Pipe, PipeTransform } from '@angular/core';

import { IPautaDetalhes } from '../interfaces/pauta-detalhes.interface';

@Pipe({
  name: 'totalVotos',
})
export class TotalVotosPipe implements PipeTransform {
  transform(value: IPautaDetalhes): string {
    if (!value) {
      return 'Total de votos: --';
    }

    const total = value.total_sim + value.total_nao;
    const plural = total === 1 ? '' : 's';

    return `Total de voto${plural}: ${total}`;
  }
}
