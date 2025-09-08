import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BYPASS_INTERCEPTOR } from '@core/interceptor/http-interceptor.interceptor';

@Injectable({
  providedIn: 'root',
})
export abstract class HttpService {
  private _headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  constructor(private _http: HttpClient) {}

  public get<T>(url: string, { params, bypassInterceptor }: any): Observable<T> {
    const opcoes = this._defineOpcoes(params);

    return this._http.get<T>(url, {
      ...opcoes,
      context: new HttpContext().set(BYPASS_INTERCEPTOR, bypassInterceptor),
    });
  }

  public post<T>(url: string, data: any, { params, bypassInterceptor }: any): Observable<T> {
    const body = JSON.stringify(data);

    const opcoes = this._defineOpcoes(params);

    return this._http.post<T>(url, body, {
      ...opcoes,
      context: new HttpContext().set(BYPASS_INTERCEPTOR, bypassInterceptor),
    });
  }

  private _defineOpcoes(params: any): {
    headers: HttpHeaders;
    params?: HttpParams;
  } {
    const opcoes: any = {};

    opcoes['headers'] = this._headers;

    if (params) {
      opcoes['params'] = this._defineParametros(params);
    }

    return opcoes;
  }

  private _defineParametros(params: any): HttpParams | undefined {
    let httpParams: HttpParams | undefined = undefined;

    if (params) {
      httpParams = new HttpParams();

      Object.keys(params).forEach(key => {
        httpParams = httpParams!.append(key, params[key]);
      });
    }

    return httpParams;
  }
}
