import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  // Evitar interceptar la solicitud de renovación de token
  if (req.url.includes('/Usuarios/renovar-token')) {
    return next(req); // No hacer nada, deja que pase
  }
  const auth = inject(AuthService);
  const token = auth.getToken();

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq).pipe(
    catchError((err) => {
      console.log('Error en authInterceptorFn: ', err);
      if (err.status === 401 || err.status === 404) {
        return auth.renewToken().pipe(
          switchMap(() => {
            const newToken = auth.getToken();
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            console.log('Renovando token: ', newToken);
            return next(retryReq);
          }),
          catchError((renewErr) => {
            console.error('Renovación falló, cerrando sesión');
            auth.logOut();
            // redirige al login
            setTimeout(() => {
              router.navigate(['/login'], {
                queryParams: { sessionExpired: true },
              });
            });
            return throwError(() => renewErr);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
