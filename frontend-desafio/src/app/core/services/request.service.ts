import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '@app/environments/environment.development';

import { HttpService } from './http-service.service';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private _http: HttpService) {}

  public getRequest<T>(path: string, params?: any, bypassInterceptor?: boolean): Observable<T> {
    return this._http
      .get<T>(this._adjustPath(path), { params, bypassInterceptor })
      .pipe(catchError(error => throwError(() => error)));
  }

  public postRequest<T>(
    path: string,
    data: any,
    params?: any,
    bypassInterceptor?: boolean,
  ): Observable<T> {
    return this._http
      .post<T>(this._adjustPath(path), data, { params, bypassInterceptor })
      .pipe(catchError(error => throwError(() => error)));
  }

  private _adjustPath(path: string): string {
    return path.startsWith('/') ? `${environment.urlBase}${path}` : path;
  }
}
