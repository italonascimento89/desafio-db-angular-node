import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public showLoader(): void {
    this.loading = true;
  }

  public hideLoader(): void {
    this.loading = false;
  }

  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  get loading(): boolean {
    return this._loading$.value;
  }

  private set loading(ligado: boolean) {
    this._loading$.next(ligado);
  }
}
