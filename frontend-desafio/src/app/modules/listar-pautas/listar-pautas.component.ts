import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { debounceTime, Observable, tap } from 'rxjs';

import { PathRoutes } from '@app/shared/constants/routes.contant';
import { IPaginacaoPauta, IPauta } from '@app/shared/interfaces/pautas.interface';
import { ISelectOption } from '@app/shared/interfaces/select-options.interface';
import { ICategorias } from '@app/shared/interfaces/categorias.interce';
import { CategoriasType } from '@app/shared/types/categorias.type';
import { PautaAcaoType } from '@app/shared/types/pauta-acao.type';

import { UtilsService } from '@app/core/services/utils.service';
import { RequestService } from '@app/core/services/request.service';

import { PautaCardComponent } from './components/pauta-card/pauta-card.component';
import { FeedbackComponent } from '@app/shared/components/feedback/feedback.component';
import { SelectFieldComponent } from '@app/shared/components/select-field/select-field.component';

@Component({
  selector: 'app-votar-pautas',
  imports: [CommonModule, PautaCardComponent, FeedbackComponent, SelectFieldComponent],
  templateUrl: './listar-pautas.component.html',
  styleUrl: './listar-pautas.component.scss',
})
export class ListarPautasComponent implements OnInit {
  public pautas$!: Observable<IPaginacaoPauta>;
  public categorias$!: Observable<ISelectOption<string>[]>;
  public form!: FormGroup<{
    categoria: FormControl<CategoriasType | 'TODAS' | null>;
  }>;

  constructor(
    private _request: RequestService,
    private _router: Router,
    private _fb: FormBuilder,
    private _utils: UtilsService,
  ) {}

  ngOnInit(): void {
    this._carregForm();
    this._getPautas();
    this._getCategorias();
    this._monitorarAlteracaoCategoria();
  }

  private _getPautas(): void {
    const { categoria } = this.form.value;

    const parametros = {
      status: 'aberta',
      page: 1,
      limit: 10,
      ...(categoria === 'TODAS' ? {} : { categoria }),
    };

    this.pautas$ = this._request.getRequest('/v1/pautas', parametros);
  }

  private _carregForm(): void {
    this.form = this._fb.group({
      categoria: this._fb.control<CategoriasType | 'TODAS' | null>('TODAS', [Validators.required]),
    });
  }

  private _getCategorias(): void {
    this.categorias$ = this._utils.mapToSelectOptions<ICategorias, string>(
      this._request,
      '/v1/categorias',
      item => item.nome,
      item => item.nome,
    );
  }

  private _monitorarAlteracaoCategoria(): void {
    this.form.controls.categoria.valueChanges
      .pipe(
        debounceTime(150),
        tap(() => this._getPautas()),
      )
      .subscribe();
  }

  public onAcaoPauta(event: { pauta: IPauta; tipo: PautaAcaoType }): void {
    if (event.tipo === 'votar') {
      this._router.navigate([PathRoutes.votarPautas, event.pauta.id]);
    } else {
      this._router.navigate([PathRoutes.detalhesPauta, event.pauta.id]);
    }
  }
}
