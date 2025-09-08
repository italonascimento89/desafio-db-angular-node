import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';
import { RequestService } from '@app/core/services/request.service';
import { NotificationService } from '@app/core/services/notification.service';
import { StorageService } from '@app/core/services/storage.service';

import { CardComponent } from '@app/shared/components/card/card.component';
import { InputFieldComponent } from '@app/shared/components/input-field/input-field.component';
import { ButtonComponent } from '@app/shared/components/button/button.component';
import { provideNgxMask } from 'ngx-mask';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let requestMock: jasmine.SpyObj<RequestService>;
  let notificationMock: jasmine.SpyObj<NotificationService>;
  let storageMock: Partial<StorageService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    requestMock = jasmine.createSpyObj('RequestService', ['getRequest']);
    notificationMock = jasmine.createSpyObj('NotificationService', ['show']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    storageMock = { usuario: null };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        LoginComponent,
        CardComponent,
        InputFieldComponent,
        ButtonComponent,
      ],
      providers: [
        provideNgxMask(),
        { provide: RequestService, useValue: requestMock },
        { provide: NotificationService, useValue: notificationMock },
        { provide: StorageService, useValue: storageMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com campo cpf', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.controls.cpf).toBeTruthy();
    expect(component.form.controls.cpf.value).toBeNull();
  });

  it('não deve submeter se o formulário for inválido', () => {
    component.form.controls.cpf.setValue('123'); // inválido
    component.onSubmit();
    expect(requestMock.getRequest).not.toHaveBeenCalled();
  });

  it('deve chamar API e armazenar usuário admin, navegando para criar-pauta', fakeAsync(() => {
    const usuarioMock = { id: '1', cpf: '08668708490', tipo: 'admin' } as any;

    // CPF válido de 11 dígitos
    component.form.controls.cpf.setValue('08668708490');

    // Mock da API
    requestMock.getRequest.and.returnValue(of(usuarioMock));

    // Chamada do método
    component.onSubmit();
    tick();

    // Verificações
    expect(requestMock.getRequest).toHaveBeenCalledWith('/v1/users/08668708490');
    expect(storageMock.usuario).toEqual(usuarioMock);
    expect(notificationMock.show).toHaveBeenCalledWith(
      'success',
      'Login efetuado com sucesso',
      'Criar usuário',
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['criar-pauta']);
  }));

  it('deve chamar API e armazenar usuário comum, navegando para listar-pautas', fakeAsync(() => {
    const usuarioMock = { id: '2', cpf: '98765432100', tipo: 'user' } as any;
    component.form.controls.cpf.setValue('98765432100');

    requestMock.getRequest.and.returnValue(of(usuarioMock));

    component.onSubmit();
    tick();

    expect(storageMock.usuario).toEqual(usuarioMock);
    expect(routerMock.navigate).toHaveBeenCalledWith(['listar-pautas']);
  }));

  it('deve notificar erro quando API falhar', fakeAsync(() => {
    component.form.controls.cpf.setValue('41183258704');

    const erroMock = new HttpErrorResponse({ error: { error: 'Usuário não encontrado' } });
    requestMock.getRequest.and.returnValue(throwError(() => erroMock));

    component.onSubmit();
    tick();

    expect(notificationMock.show).toHaveBeenCalledWith('error', 'Usuário não encontrado', 'Error');

    expect(storageMock.usuario).toBeNull();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  }));
});
