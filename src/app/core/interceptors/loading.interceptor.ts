import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptorFn: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  if (req.url.includes('/Auth/renovar-token')) {
    return next(req);
  }

  loadingService.startRequest();

  return next(req).pipe(
    finalize(() => {
      loadingService.endRequest();
    })
  );
};
