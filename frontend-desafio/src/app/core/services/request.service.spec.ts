import { TestBed } from '@angular/core/testing';
import { RequestService } from './request.service';
import { HttpService } from './http-service.service';

import { of, throwError } from 'rxjs';

import { environment } from '@app/environments/environment.development';

describe('RequestService', () => {
  let service: RequestService;
  let httpServiceMock: jasmine.SpyObj<HttpService>;

  beforeEach(() => {
    // Mock do HttpService
    const httpServiceSpy = jasmine.createSpyObj('HttpService', ['get', 'post']);

    TestBed.configureTestingModule({
      providers: [RequestService, { provide: HttpService, useValue: httpServiceSpy }],
    });

    service = TestBed.inject(RequestService);
    httpServiceMock = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRequest', () => {
    it('should call httpService.get with correct parameters', () => {
      const path = '/test';
      const params = { key: 'value' };
      const bypassInterceptor = true;
      const expectedResponse = { data: 'test' };

      httpServiceMock.get.and.returnValue(of(expectedResponse));

      service.getRequest(path, params, bypassInterceptor).subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });

      expect(httpServiceMock.get).toHaveBeenCalledWith(`${environment.urlBase}${path}`, {
        params,
        bypassInterceptor,
      });
    });

    it('should handle errors from httpService.get', () => {
      const path = '/test';
      const errorResponse = new Error('Test error');

      httpServiceMock.get.and.returnValue(throwError(() => errorResponse));

      service.getRequest(path).subscribe(
        () => fail('expected an error, not data'),
        error => {
          expect(error).toEqual(errorResponse);
        },
      );
    });
  });

  describe('postRequest', () => {
    it('should call httpService.post with correct parameters', () => {
      const path = '/test';
      const data = { name: 'test' };
      const params = { key: 'value' };
      const bypassInterceptor = true;
      const expectedResponse = { data: 'test' };

      httpServiceMock.post.and.returnValue(of(expectedResponse));

      service.postRequest(path, data, params, bypassInterceptor).subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });

      expect(httpServiceMock.post).toHaveBeenCalledWith(`${environment.urlBase}${path}`, data, {
        params,
        bypassInterceptor,
      });
    });

    it('should handle errors from httpService.post', () => {
      const path = '/test';
      const data = { name: 'test' };
      const errorResponse = new Error('Test error');

      httpServiceMock.post.and.returnValue(throwError(() => errorResponse));

      service.postRequest(path, data).subscribe(
        () => fail('expected an error, not data'),
        error => {
          expect(error).toEqual(errorResponse);
        },
      );
    });
  });

  describe('_adjustPath', () => {
    it('should prepend urlBase to the path if it starts with "/"', () => {
      const path = '/test';
      const adjustedPath = service['_adjustPath'](path);
      expect(adjustedPath).toBe(`${environment.urlBase}${path}`);
    });

    it('should return the path as is if it does not start with "/"', () => {
      const path = 'test';
      const adjustedPath = service['_adjustPath'](path);
      expect(adjustedPath).toBe(path);
    });
  });
});
