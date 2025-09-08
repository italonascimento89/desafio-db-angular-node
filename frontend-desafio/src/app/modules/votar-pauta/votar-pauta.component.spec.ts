import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VotarPautaComponent } from './votar-pauta.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '@app/core/services/request.service';
import { NotificationService } from '@app/core/services/notification.service';
import { of } from 'rxjs';
import { IPauta } from '@app/shared/interfaces/pautas.interface';

import { PathRoutes } from '@app/shared/constants/routes.contant';
import { provideNgxMask } from 'ngx-mask';

describe('VotarPautaComponent', () => {
  let component: VotarPautaComponent;
  let fixture: ComponentFixture<VotarPautaComponent>;
  let mockRequest: jasmine.SpyObj<RequestService>;
  let mockNotification: jasmine.SpyObj<NotificationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  const pautaMock: IPauta = {
    id: 'pauta-id',
    nome: 'Teste',
    descricao: 'Desc',
    status: 'ABERTA',
    tempo_restante: 30,
  };

  beforeEach(() => {
    mockRequest = jasmine.createSpyObj('RequestService', ['postRequest', 'getRequest']);
    mockNotification = jasmine.createSpyObj('NotificationService', ['show']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: { paramMap: new Map([['id', 'pauta-id']]) } as any,
    };

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, VotarPautaComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        provideNgxMask(),
        { provide: RequestService, useValue: mockRequest },
        { provide: NotificationService, useValue: mockNotification },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    fixture = TestBed.createComponent(VotarPautaComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    component.ngOnInit();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com controles cpf e voto', () => {
    expect(component.form).toBeDefined();
    expect(component.form.controls['cpf']).toBeDefined();
    expect(component.form.controls['voto']).toBeDefined();
  });

  it('deve carregar a pauta ao inicializar', () => {
    mockRequest.getRequest.and.returnValue(of(pautaMock));
    component.ngOnInit();

    component.pauta$?.subscribe(pauta => {
      expect(pauta).toEqual(pautaMock);
    });

    expect(mockRequest.getRequest).toHaveBeenCalledWith('/v1/pautas/pauta-id');
  });

  it('deve selecionar voto se ainda não registrado', () => {
    component.selecionar('sim');
    expect(component.form.controls['voto'].value).toBe('sim');
  });

  it('não deve alterar voto se já registrado', () => {
    component['\u005fvotoRegistrado'].set(true);
    component.selecionar('nao');
    expect(component.form.controls['voto'].value).toBeNull();
  });

  it('não deve submeter se o formulário for inválido ou voto já registrado', () => {
    component.form.setValue({ cpf: '', voto: null });
    component['\u005fvotoRegistrado'].set(true);

    component.onSubmit();

    expect(mockRequest.postRequest).not.toHaveBeenCalled();
  });

  it('deve retornar true se o voto foi confirmado', () => {
    expect(component.votoConfirmado()).toBeFalse();

    component['\u005fvotoRegistrado'].set(true);
    expect(component.votoConfirmado()).toBeTrue();
  });

  it('deve navegar para os detalhes da pauta', () => {
    component.irParaDetalhes();
    expect(mockRouter.navigate).toHaveBeenCalledWith([PathRoutes.detalhesPauta, 'pauta-id']);
  });

  it('deve navegar para listar pautas ao voltar', () => {
    component.omVoltar();
    expect(mockRouter.navigate).toHaveBeenCalledWith([PathRoutes.listarPautas]);
  });
});
