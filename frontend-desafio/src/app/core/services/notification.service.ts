import { Injectable } from '@angular/core';
import { ToastType } from '@app/shared/types/toast.type';

import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _defaultConfig: Partial<IndividualConfig> = {
    closeButton: true,
    progressBar: true,
    timeOut: 3000,
    positionClass: 'toast-top-right',
  };

  constructor(private _toastr: ToastrService) {}

  public show(
    type: ToastType,
    message: string,
    title?: string,
    config?: Partial<IndividualConfig>,
  ): void {
    this._toastr[type](message, title, { ...this._defaultConfig, ...config });
  }

  public clear(toastId?: number): void {
    this._toastr.clear(toastId);
  }
}
