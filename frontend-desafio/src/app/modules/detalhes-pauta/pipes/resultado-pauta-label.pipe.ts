import { Pipe, PipeTransform } from '@angular/core';

import { ResultadoPautaType } from '@app/shared/types/resultao-pautas.type';

@Pipe({
  name: 'resultadoPautaLabel',
})
export class ResultadoPautaLabelPipe implements PipeTransform {
  private readonly RESULTADO_LABEL_MAP: Record<ResultadoPautaType, string> = {
    empate: 'Empate',
    aprovado: 'Pauta aprovada',
    reprovado: 'Pauta reprovada',
    anulada: 'Pauta anulada',
  };

  public transform(resultado: ResultadoPautaType): string {
    if (!resultado) {
      return '--';
    }

    return this.RESULTADO_LABEL_MAP[resultado] ?? 'Resultado desconhecido';
  }
}
