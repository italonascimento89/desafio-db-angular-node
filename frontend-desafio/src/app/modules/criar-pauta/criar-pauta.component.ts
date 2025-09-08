import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';

import { catchError, EMPTY, Observable, tap } from 'rxjs';

import { ICriarPauta } from './interfaces/criar-pauta.interface';
import { ToastType } from '@app/shared/types/toast.type';
import { ICategorias } from '@app/shared/interfaces/categorias.interce';
import { FormValidations } from '@app/shared/validators/validators';
import { CategoriasType } from '@app/shared/types/categorias.type';
import { ISelectOption } from '@app/shared/interfaces/select-options.interface';

import { RequestService } from '@app/core/services/request.service';
import { NotificationService } from '@app/core/services/notification.service';
import { StorageService } from '@app/core/services/storage.service';
import { UtilsService } from '@app/core/services/utils.service';

import { ButtonComponent } from '@app/shared/components/button/button.component';
import { InputFieldComponent } from '@app/shared/components/input-field/input-field.component';
import { CardComponent } from '@app/shared/components/card/card.component';
import { SelectFieldComponent } from '@app/shared/components/select-field/select-field.component';

@Component({
  selector: 'app-criar-pauta',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    InputFieldComponent,
    ButtonComponent,
    CardComponent,
    SelectFieldComponent,
  ],
  templateUrl: './criar-pauta.component.html',
  styleUrl: './criar-pauta.component.scss',
})
export class CriarPautaComponent implements OnInit {
  public categorias$!: Observable<ISelectOption<string>[]>;
  public form!: FormGroup<{
    titulo: FormControl<string | null>;
    descricao: FormControl<string | null>;
    categoria: FormControl<CategoriasType | null>;
    sessao: FormControl<string | null>;
  }>;

  constructor(
    private _fb: FormBuilder,
    private _request: RequestService,
    private _notification: NotificationService,
    private _storage: StorageService,
    private _utils: UtilsService,
  ) {}

  ngOnInit(): void {
    this._carregForm();
    this._getCategorias();
  }

  public onSubmit(): void {
    if (!this.form.valid) return;

    const { categoria, titulo, descricao, sessao } = this.form.value;

    const tempoEmMinutos = this.converterTempoCompactoParaMinutos(this.form.value.sessao);

    const parametros: ICriarPauta = {
      categoria: categoria,
      nome: titulo,
      descricao: descricao,
      id_admin: this._storage.usuario?.id,
      tempo_aberta: tempoEmMinutos,
    };

    this._request
      .postRequest('/v1/pautas', parametros)
      .pipe(
        tap(() => this._notify('success', 'Pauta criada com sucesso')),
        catchError((error: HttpErrorResponse) => {
          this._notify('error', error.error.error, 'Erro');

          return EMPTY;
        }),
      )
      .subscribe();
  }

  private _getCategorias(): void {
    this.categorias$ = this._utils.mapToSelectOptions<ICategorias, string>(
      this._request,
      '/v1/categorias',
      item => item.nome,
      item => item.nome,
    );
  }

  private _carregForm(): void {
    const requiredValidator = Validators.required;

    const comomValidators: ValidatorFn[] = [
      requiredValidator,
      FormValidations.onlyText(),
      Validators.minLength(5),
    ];

    this.form = this._fb.group({
      titulo: this._fb.control<string | null>(null, {
        validators: [...comomValidators],
      }),
      descricao: this._fb.control<string | null>(null, {
        validators: [...comomValidators],
      }),
      categoria: this._fb.control<CategoriasType | null>(null, [requiredValidator]),
      sessao: this._fb.control<string | null>(null, {
        validators: [
          requiredValidator,
          FormValidations.onlyNumbers(),
          FormValidations.minSessionTime(),
        ],
      }),
    });
  }

  private _notify(type: ToastType, message: string, title: string = 'Criar pauta'): void {
    this._notification.show(type, message, title);
  }

  private converterTempoCompactoParaMinutos(tempo: string | null | undefined): number {
    if (!tempo || !/^\d{4}$/.test(tempo)) {
      throw new Error('Formato de tempo inválido. Esperado HHmm com 4 dígitos');
    }

    const horas = Number(tempo.substring(0, 2));
    const minutos = Number(tempo.substring(2, 4));

    return horas * 60 + minutos;
  }
}
