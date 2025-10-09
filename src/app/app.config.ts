import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptorFn } from './auth/interceptors/auth.interceptor';
import { loadingInterceptorFn } from '@core/interceptors/loading.interceptor';
import { microsoftInterceptorFn } from '@core/interceptors/microsoft.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loadingInterceptorFn,
        authInterceptorFn,
        authInterceptorFn,
        microsoftInterceptorFn,
      ])
    ),
  ],
};
