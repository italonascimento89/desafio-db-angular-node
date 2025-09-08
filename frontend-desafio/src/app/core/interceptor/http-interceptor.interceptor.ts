import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { finalize } from 'rxjs';

import { LoadingService } from '../services/loading-service.service';

export const BYPASS_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

export const httpInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const _loading = inject(LoadingService);

  let activeRequests = 0;

  const isBypass = req.context.get(BYPASS_INTERCEPTOR);

  if (!isBypass) {
    activeRequests++;
    if (activeRequests > 0) _loading.showLoader();
  }

  return next(req).pipe(
    finalize(() => {
      if (!isBypass) {
        activeRequests--;

        if (activeRequests < 1) _loading.hideLoader();
      }
    }),
  );
};
