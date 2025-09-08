import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from '@core/components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from '@core/services/loading-service.service';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let loadingSubject: Subject<boolean>;
  let mockLoadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    loadingSubject = new Subject<boolean>();
    mockLoadingService = jasmine.createSpyObj('LoadingService', [], {
      loading$: loadingSubject.asObservable(),
    });

    TestBed.configureTestingModule({
      imports: [AppComponent, AsyncPipe, RouterOutlet, HeaderComponent],
      providers: [{ provide: LoadingService, useValue: mockLoadingService }],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve expor o observable isLoading$ com debounce aplicado', done => {
    const resultados: boolean[] = [];

    component.isLoading$.pipe(take(1)).subscribe(valor => {
      resultados.push(valor);
      expect(resultados).toEqual([true]);
      done();
    });

    loadingSubject.next(true);
  });
});
