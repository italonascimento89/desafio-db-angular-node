import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CadastrarUsuarioComponent } from './cadastrar-usuario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { RequestService } from '@app/core/services/request.service';
import { NotificationService } from '@app/core/services/notification.service';
import { StorageService } from '@app/core/services/storage.service';
import { provideNgxMask } from 'ngx-mask';

describe('CadastrarUsuarioComponent', () => {
  let component: CadastrarUsuarioComponent;
  let fixture: ComponentFixture<CadastrarUsuarioComponent>;

  let requestMock: jasmine.SpyObj<RequestService>;
  let notificationMock: jasmine.SpyObj<NotificationService>;
  let storageMock: Partial<StorageService>;

  beforeEach(() => {
    requestMock = jasmine.createSpyObj('RequestService', ['postRequest']);
    notificationMock = jasmine.createSpyObj('NotificationService', ['show']);
    storageMock = { usuario: { id: 'admin-id', cpf: '08668708490', tipo: 'admin' } };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CadastrarUsuarioComponent],
      providers: [
        provideNgxMask(),
        { provide: RequestService, useValue: requestMock },
        { provide: NotificationService, useValue: notificationMock },
        { provide: StorageService, useValue: storageMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com controles cpf e perfil', () => {
    expect(component.form.contains('cpf')).toBeTrue();
    expect(component.form.contains('perfil')).toBeTrue();
  });

  it('deve validar o formulário como inválido se cpf ou perfil estiverem nulos', () => {
    component.form.controls.cpf.setValue(null);
    component.form.controls.perfil.setValue(null);
    expect(component.form.invalid).toBeTrue();
  });

  it('deve construir parâmetros corretamente para ADMIN', () => {
    const cpf = '08668708490';
    const perfil = 'ADMIN';
    const params = (component as any)._buildParametros(cpf, perfil);
    expect(params).toEqual({ cpf });
  });

  it('deve construir parâmetros corretamente para VOTANTE', () => {
    const cpf = '08668708490';
    const perfil = 'VOTANTE';
    const params = (component as any)._buildParametros(cpf, perfil);
    expect(params).toEqual({ cpf, id_admin: 'admin-id' });
  });

  it('deve resolver URL corretamente para ADMIN', () => {
    const url = (component as any)._resolveUrl('ADMIN');
    expect(url).toBe('/v1/users/admin');
  });

  it('deve resolver URL corretamente para VOTANTE', () => {
    const url = (component as any)._resolveUrl('VOTANTE');
    expect(url).toBe('/v1/users/voters');
  });

  it('deve submeter formulário com sucesso para ADMIN', fakeAsync(() => {
    component.form.controls.cpf.setValue('08668708490');
    component.form.controls.perfil.setValue('ADMIN');

    requestMock.postRequest.and.returnValue(of({}));

    component.onSubmit();
    tick();

    expect(requestMock.postRequest).toHaveBeenCalledWith('/v1/users/admin', { cpf: '08668708490' });
    expect(notificationMock.show).toHaveBeenCalledWith(
      'success',
      'Usuário cadastrado com sucesso',
      'Criar usuário',
    );
  }));

  it('deve submeter formulário com sucesso para VOTANTE', fakeAsync(() => {
    component.form.controls.cpf.setValue('08668708490');
    component.form.controls.perfil.setValue('VOTANTE');

    requestMock.postRequest.and.returnValue(of({}));

    component.onSubmit();
    tick();

    expect(requestMock.postRequest).toHaveBeenCalledWith('/v1/users/voters', {
      cpf: '08668708490',
      id_admin: 'admin-id',
    });
    expect(notificationMock.show).toHaveBeenCalledWith(
      'success',
      'Usuário cadastrado com sucesso',
      'Criar usuário',
    );
  }));

  it('deve notificar erro quando a API falhar', fakeAsync(() => {
    component.form.controls.cpf.setValue('08668708490');
    component.form.controls.perfil.setValue('VOTANTE');

    const erroMock = { error: { error: 'Erro ao cadastrar usuário' } } as any;
    requestMock.postRequest.and.returnValue(throwError(() => erroMock));

    component.onSubmit();
    tick();

    expect(notificationMock.show).toHaveBeenCalledWith(
      'error',
      'Erro ao cadastrar usuário',
      'Error',
    );
  }));
});
