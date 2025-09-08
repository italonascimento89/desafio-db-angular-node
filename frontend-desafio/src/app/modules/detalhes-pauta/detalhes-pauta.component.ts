import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';

import { Observable } from 'rxjs';

import { IPautaDetalhes } from './interfaces/pauta-detalhes.interface';

import { PautaResultadoPipe } from './pipes/pauta-resultado.pipe';
import { PercentualVotosPipe } from './pipes/percentual-votos.pipe';
import { TotalVotosPipe } from './pipes/total-votos.pipe';

import { RequestService } from '@app/core/services/request.service';

import { BadgeComponent } from '@app/shared/components/badge/badge.component';
import { ProgressBarComponent } from '@app/shared/components/progress-bar/progress-bar.component';
import { CardComponent } from '@app/shared/components/card/card.component';
import { ResultadoPautaLabelPipe } from './pipes/resultado-pauta-label.pipe';

@Component({
  selector: 'app-detalhes-pauta',
  imports: [
    RouterModule,
    AsyncPipe,
    DatePipe,
    NgClass,
    PautaResultadoPipe,
    PercentualVotosPipe,
    TotalVotosPipe,
    ResultadoPautaLabelPipe,
    BadgeComponent,
    ProgressBarComponent,
    CardComponent,
  ],
  templateUrl: './detalhes-pauta.component.html',
  styleUrl: './detalhes-pauta.component.scss',
})
export class DetalhesPautaComponent implements OnInit {
  public detalhes$!: Observable<IPautaDetalhes>;

  constructor(private _request: RequestService, private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this._getDetalhes();
  }

  private _getDetalhes(): void {
    const idPauta = this._route.snapshot.paramMap.get('id');

    this.detalhes$ = this._request.getRequest<IPautaDetalhes>(`/v1/votos/resultado/${idPauta}`);
  }
}
