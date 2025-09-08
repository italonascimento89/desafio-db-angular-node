import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideToastr } from 'ngx-toastr';
import { NgxMaskConfig, provideEnvironmentNgxMask } from 'ngx-mask';

import { routes } from './app.routes';
import { httpInterceptorInterceptor } from '@core/interceptor/http-interceptor.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const maskConfigFunction: () => Partial<NgxMaskConfig> = () => {
  return {
    validation: false,
  };
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpInterceptorInterceptor])),
    provideHttpClient(),
    provideToastr(),
    provideAnimationsAsync(),
    provideEnvironmentNgxMask(maskConfigFunction),
  ],
};
