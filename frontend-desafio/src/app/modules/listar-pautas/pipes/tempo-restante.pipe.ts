import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tempoRestante',
})
export class TempoRestantePipe implements PipeTransform {
  transform(minutos: number): string {
    if (minutos === null || minutos === undefined || isNaN(minutos)) {
      return 'Tempo restante: --';
    }

    const horas = Math.floor(minutos / 60);
    const restanteMinutos = minutos % 60;

    if (horas > 0 && restanteMinutos > 0) {
      return `Tempo restante: ${horas} Hora${horas > 1 ? 's' : ''} e ${restanteMinutos} Minuto${
        restanteMinutos > 1 ? 's' : ''
      }`;
    }

    if (horas > 0) {
      return `Tempo restante: ${horas} Hora${horas > 1 ? 's' : ''}`;
    }

    return `Tempo restante: ${restanteMinutos} Minuto${restanteMinutos > 1 ? 's' : ''}`;
  }
}
