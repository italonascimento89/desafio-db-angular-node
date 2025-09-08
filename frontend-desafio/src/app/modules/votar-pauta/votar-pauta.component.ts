import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Navigation, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';

import { catchError, EMPTY, Observable, tap } from 'rxjs';

import { IVotarPauta } from './interfaces/votar-pauta.interface';
import { ToastType } from '@app/shared/types/toast.type';
import { VotosType } from '../../shared/types/votos.type';
import { FormValidations } from '@app/shared/validators/validators';
import { IPauta } from '@app/shared/interfaces/pautas.interface';

import { RequestService } from '@app/core/services/request.service';
import { NotificationService } from '@app/core/services/notification.service';

import { ButtonComponent } from '@app/shared/components/button/button.component';
import { InputFieldComponent } from '@app/shared/components/input-field/input-field.component';
import { PathRoutes } from '@app/shared/constants/routes.contant';
import { CardComponent } from '@app/shared/components/card/card.component';

@Component({
  selector: 'app-votar-pauta',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonComponent,
    InputFieldComponent,
    CardComponent,
  ],
  templateUrl: './votar-pauta.component.html',
  styleUrl: './votar-pauta.component.scss',
})
export class VotarPautaComponent implements OnInit {
  public form!: FormGroup<{
    voto: FormControl<string | null>;
    cpf: FormControl<string | null>;
  }>;
  public pauta$!: Observable<IPauta>;
  private _votoRegistrado = signal<boolean>(false);

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _fb: FormBuilder,
    private _request: RequestService,
    private _notification: NotificationService,
  ) {}

  ngOnInit(): void {
    this._carregarForm();
    this._getPauta();
  }

  public selecionar(valor: VotosType) {
    if (!this._votoRegistrado()) {
      this.form.controls.voto.setValue(valor);
    }
  }

  public onSubmit(): void {
    if (this.form.valid && !this._votoRegistrado()) {
      const id = this._route.snapshot.paramMap.get('id');

      const { cpf, voto } = this.form.value;

      const parametros: IVotarPauta = {
        cpf: cpf,
        voto: voto,
        id_pauta: id,
      };

      this._request
        .postRequest('/v1/votos', parametros)
        .pipe(
          tap(() => {
            this._votoRegistrado.set(true);

            this._notify('success', 'Voto registrado com sucesso!');

            this.form.disable();
          }),
          catchError((error: HttpErrorResponse) => {
            this._notify('error', error.error.error, 'Erro');
            return EMPTY;
          }),
        )
        .subscribe();
    }
  }

  public votoConfirmado(): boolean {
    return this._votoRegistrado();
  }

  public irParaDetalhes(): void {
    const id = this._route.snapshot.paramMap.get('id');

    this._router.navigate([PathRoutes.detalhesPauta, id]);
  }

  public omVoltar(): void {
    this._router.navigate([PathRoutes.listarPautas]);
  }

  private _getPauta(): void {
    const id = this._route.snapshot.paramMap.get('id');

    this.pauta$ = this._request.getRequest<IPauta>(`/v1/pautas/${id}`);
  }

  private _carregarForm(): void {
    this.form = this._fb.group({
      voto: this._fb.control<string | null>(null, Validators.required),
      cpf: this._fb.control<string | null>(null, [
        Validators.required,
        Validators.minLength(11),
        FormValidations.cpfValidator(),
      ]),
    });
  }

  private _notify(type: ToastType, message: string, title: string = 'Voto'): void {
    this._notification.show(type, message, title);
  }
}
