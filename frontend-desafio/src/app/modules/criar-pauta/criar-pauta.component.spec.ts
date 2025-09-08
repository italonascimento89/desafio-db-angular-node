import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CriarPautaComponent } from './criar-pauta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RequestService } from '@app/core/services/request.service';
import { NotificationService } from '@app/core/services/notification.service';
import { StorageService } from '@app/core/services/storage.service';
import { UtilsService } from '@app/core/services/utils.service';
import { ICriarPauta } from './interfaces/criar-pauta.interface';

import { IUsuario } from '@app/shared/interfaces/usuario.interface';
import { provideNgxMask } from 'ngx-mask';

describe('CriarPautaComponent', () => {
  let component: CriarPautaComponent;
  let fixture: ComponentFixture<CriarPautaComponent>;
  let requestMock: jasmine.SpyObj<RequestService>;
  let notificationMock: jasmine.SpyObj<NotificationService>;
  let storageMock: Partial<StorageService>;
  let utilsMock: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    requestMock = jasmine.createSpyObj('RequestService', ['postRequest']);
    notificationMock = jasmine.createSpyObj('NotificationService', ['show']);
    utilsMock = jasmine.createSpyObj('UtilsService', ['mapToSelectOptions']);
    storageMock = {
      usuario: {
        id: 'admin-id',
        cpf: '12345678900',
        tipo: 'admin',
      } as IUsuario,
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CriarPautaComponent],
      providers: [
        provideNgxMask(),
        { provide: RequestService, useValue: requestMock },
        { provide: NotificationService, useValue: notificationMock },
        { provide: StorageService, useValue: storageMock },
        { provide: UtilsService, useValue: utilsMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CriarPautaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com controles', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.contains('titulo')).toBeTrue();
    expect(component.form.contains('descricao')).toBeTrue();
    expect(component.form.contains('categoria')).toBeTrue();
    expect(component.form.contains('sessao')).toBeTrue();
  });

  it('formulário inválido se campos obrigatórios estiverem vazios', () => {
    component.form.setValue({ titulo: null, descricao: null, categoria: null, sessao: null });
    expect(component.form.valid).toBeFalse();
  });

  it('converterTempoCompactoParaMinutos converte corretamente HHmm', () => {
    const resultado = component['converterTempoCompactoParaMinutos']('0130'); // 1h30
    expect(resultado).toBe(90);
  });

  it('converterTempoCompactoParaMinutos lança erro para formato inválido', () => {
    expect(() => component['converterTempoCompactoParaMinutos']('130')).toThrowError(
      'Formato de tempo inválido. Esperado HHmm com 4 dígitos',
    );
    expect(() => component['converterTempoCompactoParaMinutos']('abcd')).toThrow();
  });

  it('onSubmit não chama API se formulário inválido', () => {
    component.form.setValue({ titulo: null, descricao: null, categoria: null, sessao: null });
    component.onSubmit();
    expect(requestMock.postRequest).not.toHaveBeenCalled();
  });

  it('onSubmit chama API e notifica sucesso', fakeAsync(() => {
    const formValues = {
      titulo: 'Teste Título',
      descricao: 'Descrição longa',
      categoria: 'GERAL' as any,
      sessao: '0130',
    };
    component.form.setValue(formValues);

    requestMock.postRequest.and.returnValue(of({}));

    component.onSubmit();
    tick();

    const expectedPayload: ICriarPauta = {
      categoria: formValues.categoria,
      nome: formValues.titulo,
      descricao: formValues.descricao,
      id_admin: 'admin-id',
      tempo_aberta: 90,
    };

    expect(requestMock.postRequest).toHaveBeenCalledWith('/v1/pautas', expectedPayload);
    expect(notificationMock.show).toHaveBeenCalledWith(
      'success',
      'Pauta criada com sucesso',
      'Criar pauta', // agora incluímos o título padrão
    );
  }));

  it('onSubmit chama API e notifica erro', fakeAsync(() => {
    const formValues = {
      titulo: 'Teste Título',
      descricao: 'Descrição longa',
      categoria: 'GERAL' as any,
      sessao: '0130',
    };
    component.form.setValue(formValues);

    const erroHttp = { error: { error: 'Erro teste' } };
    requestMock.postRequest.and.returnValue(throwError(() => erroHttp));

    component.onSubmit();
    tick();

    expect(notificationMock.show).toHaveBeenCalledWith('error', 'Erro teste', 'Erro');
  }));

  it('deve chamar _getCategorias ao inicializar', () => {
    spyOn(component as any, '_getCategorias').and.callThrough();
    component.ngOnInit();
    expect((component as any)._getCategorias).toHaveBeenCalled();
  });
});
