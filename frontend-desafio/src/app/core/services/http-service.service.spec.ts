import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpService } from './http-service.service';
import { BYPASS_INTERCEPTOR } from '@core/interceptor/http-interceptor.interceptor';
import { Injectable } from '@angular/core';

@Injectable()
class TestHttpService extends HttpService {
  constructor(http: HttpClient) {
    super(http);
  }
}

describe('HttpService', () => {
  let service: TestHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), TestHttpService],
    });

    service = TestBed.inject(TestHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve realizar GET com headers, params e contexto', () => {
    service
      .get('/api/teste', {
        params: { ativo: true },
        bypassInterceptor: true,
      })
      .subscribe();

    const req = httpMock.expectOne(r => r.method === 'GET' && r.url === '/api/teste');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Accept')).toBe('application/json');
    expect(req.request.params.get('ativo')).toBe('true');
    expect(req.request.context.get(BYPASS_INTERCEPTOR)).toBeTrue();

    req.flush({});
  });

  it('deve realizar POST com body, headers e contexto', () => {
    const payload = { nome: 'Italo' };

    service
      .post('/api/teste', payload, {
        params: { tipo: 'admin' },
        bypassInterceptor: false,
      })
      .subscribe();

    const req = httpMock.expectOne(r => r.method === 'POST' && r.url === '/api/teste');
    expect(req.request.body).toBe(JSON.stringify(payload));
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.params.get('tipo')).toBe('admin');
    expect(req.request.context.get(BYPASS_INTERCEPTOR)).toBeFalse();

    req.flush({});
  });

  it('deve ignorar params se não forem fornecidos', () => {
    service
      .get('/api/sem-param', {
        params: null,
        bypassInterceptor: true,
      })
      .subscribe();

    const req = httpMock.expectOne('/api/sem-param');
    expect(req.request.params.keys().length).toBe(0);
    req.flush({});
  });
});
