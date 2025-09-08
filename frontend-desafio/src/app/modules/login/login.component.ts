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

import { ToastType } from '@app/shared/types/toast.type';
import { IUsuario } from '@app/shared/interfaces/usuario.interface';
import { FormValidations } from '@app/shared/validators/validators';

import { NotificationService } from '@app/core/services/notification.service';
import { StorageService } from '@app/core/services/storage.service';
import { RequestService } from '@app/core/services/request.service';

import { CardComponent } from '@app/shared/components/card/card.component';
import { InputFieldComponent } from '@app/shared/components/input-field/input-field.component';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CardComponent, InputFieldComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public form!: FormGroup<{
    cpf: FormControl<string | null>;
  }>;

  constructor(
    private _fb: FormBuilder,
    private _request: RequestService,
    private _notification: NotificationService,
    private _storage: StorageService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this._carregarForm();
  }

  public onSubmit(): void {
    if (this.form.invalid) return;

    const { cpf } = this.form.value;

    this._request
      .getRequest<IUsuario>(`/v1/users/${cpf}`)
      .pipe(
        tap(response => this._handleSuccess(response)),
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
    });
  }

  private _handleSuccess(usuario: IUsuario): void {
    this._storage.usuario = usuario;

    this._notify('success', 'Login efetuado com sucesso');

    usuario.tipo === 'admin'
      ? this._router.navigate(['criar-pauta'])
      : this._router.navigate(['listar-pautas']);
  }

  private _handleError(error: HttpErrorResponse): void {
    this._notify('error', error.error.error, 'Error');
  }

  private _notify(type: ToastType, message: string, title: string = 'Criar usuário'): void {
    this._notification.show(type, message, title);
  }
}
