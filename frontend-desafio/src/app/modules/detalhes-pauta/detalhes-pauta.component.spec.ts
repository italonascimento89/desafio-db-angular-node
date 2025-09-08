import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalhesPautaComponent } from './detalhes-pauta.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '@app/core/services/request.service';
import { of } from 'rxjs';
import { IPautaDetalhes } from './interfaces/pauta-detalhes.interface';

describe('DetalhesPautaComponent', () => {
  let component: DetalhesPautaComponent;
  let fixture: ComponentFixture<DetalhesPautaComponent>;

  let mockRequest: jasmine.SpyObj<RequestService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(() => {
    mockRequest = jasmine.createSpyObj('RequestService', ['getRequest']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: new Map([['id', '123']]),
      } as any,
    };

    TestBed.configureTestingModule({
      imports: [DetalhesPautaComponent],
      providers: [
        provideHttpClientTesting(),
        { provide: RequestService, useValue: mockRequest },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    fixture = TestBed.createComponent(DetalhesPautaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar _getDetalhes e atribuir detalhes$', () => {
    const pautaMock: IPautaDetalhes = {
      id_pauta: '123',
      nome: 'Pauta Teste',
      descricao: 'Descrição da pauta',
      status_sessao: 'aberta',
      total_sim: 10,
      total_nao: 5,
      total: 15,
      porcentagem_sim: 66.7,
      porcentagem_nao: 33.3,
      resultado: 'aprovado',
      data_fim: new Date().toISOString(),
      data_inicio: new Date().toISOString(),
    };

    mockRequest.getRequest.and.returnValue(of(pautaMock));

    component.ngOnInit();

    component.detalhes$.subscribe(detalhes => {
      expect(detalhes).toEqual(pautaMock);
    });

    expect(mockRequest.getRequest).toHaveBeenCalledWith('/v1/votos/resultado/123');
  });
});
