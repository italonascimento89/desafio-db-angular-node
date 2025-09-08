import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IPauta } from '@app/shared/interfaces/pautas.interface';
import { PautaAcaoType } from '@app/shared/types/pauta-acao.type';
import { TempoRestantePipe } from '../../pipes/tempo-restante.pipe';

import { BadgeComponent } from '@app/shared/components/badge/badge.component';
import { ButtonComponent } from '@app/shared/components/button/button.component';

@Component({
  selector: 'app-pauta-card',
  imports: [CommonModule, BadgeComponent, ButtonComponent, TempoRestantePipe],
  templateUrl: './pauta-card.component.html',
  styleUrl: './pauta-card.component.scss',
})
export class PautaCardComponent {
  @Input() public pauta!: IPauta;
  @Output() public acao = new EventEmitter<{ pauta: IPauta; tipo: PautaAcaoType }>();

  public emitirAcao(tipo: PautaAcaoType): void {
    this.acao.emit({ pauta: this.pauta, tipo });
  }
}
