import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListarPautasComponent } from './listar-pautas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { RequestService } from '@app/core/services/request.service';
import { UtilsService } from '@app/core/services/utils.service';
import { Router } from '@angular/router';
import { PautaCardComponent } from './components/pauta-card/pauta-card.component';
import { FeedbackComponent } from '@app/shared/components/feedback/feedback.component';
import { SelectFieldComponent } from '@app/shared/components/select-field/select-field.component';
import { PathRoutes } from '@app/shared/constants/routes.contant';
import { IPaginacaoPauta } from '@app/shared/interfaces/pautas.interface';

describe('ListarPautasComponent', () => {
  let component: ListarPautasComponent;
  let fixture: ComponentFixture<ListarPautasComponent>;
  let requestMock: jasmine.SpyObj<RequestService>;
  let utilsMock: jasmine.SpyObj<UtilsService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    requestMock = jasmine.createSpyObj('RequestService', ['getRequest']);
    utilsMock = jasmine.createSpyObj('UtilsService', ['mapToSelectOptions']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ListarPautasComponent, // standalone
        PautaCardComponent,
        FeedbackComponent,
        SelectFieldComponent,
      ],
      providers: [
        { provide: RequestService, useValue: requestMock },
        { provide: UtilsService, useValue: utilsMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarPautasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com categoria "TODAS"', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.controls.categoria.value).toBe('TODAS');
  });

  it('_getCategorias deve mapear categorias', () => {
    const categoriasMock = [{ value: 'GERAL', label: 'Geral' }];
    utilsMock.mapToSelectOptions.and.returnValue(of(categoriasMock));

    component['_getCategorias']();

    component.categorias$.subscribe(result => {
      expect(result).toEqual(categoriasMock);
    });

    expect(utilsMock.mapToSelectOptions).toHaveBeenCalled();
  });

  it('_getPautas deve chamar RequestService.getRequest com categoria "TODAS"', () => {
    const pautasMock: IPaginacaoPauta = {
      pautas: [],
      total: 0,
      page: 1,
      limit: 10,
      total_pages: 0,
    };
    requestMock.getRequest.and.returnValue(of(pautasMock));

    component['_getPautas']();

    component.pautas$.subscribe(result => {
      expect(result).toEqual(pautasMock);
    });

    expect(requestMock.getRequest).toHaveBeenCalledWith('/v1/pautas', {
      status: 'aberta',
      page: 1,
      limit: 10,
    });
  });

  it('_monitorarAlteracaoCategoria deve chamar _getPautas quando valor mudar', fakeAsync(() => {
    spyOn(component as any, '_getPautas');

    component.form.controls.categoria.setValue('Administrativo');
    tick(200); // debounceTime 150ms

    expect((component as any)._getPautas).toHaveBeenCalled();
  }));

  it('onAcaoPauta deve navegar para votarPautas se tipo "votar"', () => {
    const event = { pauta: { id: '123' } as any, tipo: 'votar' as any };

    component.onAcaoPauta(event);

    expect(routerMock.navigate).toHaveBeenCalledWith([PathRoutes.votarPautas, '123']);
  });

  it('onAcaoPauta deve navegar para detalhesPauta se tipo diferente de "votar"', () => {
    const event = { pauta: { id: '456' } as any, tipo: 'detalhes' as any };

    component.onAcaoPauta(event);

    expect(routerMock.navigate).toHaveBeenCalledWith([PathRoutes.detalhesPauta, '456']);
  });
});
