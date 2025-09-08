import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { catchError, EMPTY, tap } from 'rxjs';

import { ISelectOption } from '@app/shared/interfaces/select-options.interface';
import { ToastType } from '@app/shared/types/toast.type';
import { IUsuario } from '@app/shared/interfaces/usuario.interface';

import { RequestService } from '@app/core/services/request.service';
import { NotificationService } from '@app/core/services/notification.service';
import { StorageService } from '@app/core/services/storage.service';

import { CardComponent } from '@app/shared/components/card/card.component';
import { InputFieldComponent } from '@app/shared/components/input-field/input-field.component';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { SelectFieldComponent } from '@app/shared/components/select-field/select-field.component';
import { FormValidations } from '@app/shared/validators/validators';

@Component({
  selector: 'app-cadastrar-usuario',
  imports: [
    ReactiveFormsModule,
    CardComponent,
    InputFieldComponent,
    ButtonComponent,
    SelectFieldComponent,
  ],
  templateUrl: './cadastrar-usuario.component.html',
  styleUrl: './cadastrar-usuario.component.scss',
})
export class CadastrarUsuarioComponent implements OnInit {
  public form!: FormGroup<{
    cpf: FormControl<string | null>;
    perfil: FormControl<'ADMIN' | 'VOTANTE' | null>;
  }>;
  public options: ISelectOption<'ADMIN' | 'VOTANTE'>[] = [
    { value: 'ADMIN', label: 'Adminitrador' },
    { value: 'VOTANTE', label: 'Votante' },
  ];

  constructor(
    private _fb: FormBuilder,
    private _request: RequestService,
    private _notification: NotificationService,
    private _storage: StorageService,
  ) {}

  ngOnInit(): void {
    this._carregarForm();
  }

  public onSubmit(): void {
    const { cpf, perfil } = this.form.value;

    if (this.form.invalid) return;

    const parametros = this._buildParametros(cpf as string, perfil as 'ADMIN' | 'VOTANTE');
    const urlRequest = this._resolveUrl(perfil as 'ADMIN' | 'VOTANTE');

    this._request
      .postRequest<IUsuario>(urlRequest, parametros)
      .pipe(
        tap(() => this._handleSuccess()),
        catchError(error => {
          this._handleError(error);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private _carregarForm(): void {
    this.form = this._fb.group({
      cpf: this._fb.control<string | null>(null, [
        Validators.required,
        Validators.minLength(11),
        FormValidations.cpfValidator(),
      ]),
      perfil: this._fb.control<'ADMIN' | 'VOTANTE' | null>(null, [Validators.required]),
    });
  }

  private _buildParametros(cpf: string, perfil: 'ADMIN' | 'VOTANTE'): Record<string, any> {
    return perfil === 'ADMIN' ? { cpf } : { cpf, id_admin: this._storage.usuario?.id };
  }

  private _resolveUrl(perfil: 'ADMIN' | 'VOTANTE'): string {
    return perfil === 'ADMIN' ? '/v1/users/admin' : '/v1/users/voters';
  }

  private _handleSuccess(): void {
    this._notify('success', 'Usuário cadastrado com sucesso');
  }

  private _handleError(error: HttpErrorResponse): void {
    this._notify('error', error.error.error, 'Error');
  }

  private _notify(type: ToastType, message: string, title: string = 'Criar usuário'): void {
    this._notification.show(type, message, title);
  }
}
