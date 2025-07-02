import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { MicrosoftAuthService } from './microsoft-auth.service';

export const microsoftInterceptorFn: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('graph.microsoft.com')) {
    return next(req);
  }

  const auth = inject(AuthService);
  const msAuth = inject(MicrosoftAuthService);
  const token = msAuth.getMicrosoftToken();

  if (token) {
    console.log('Token Microsoft encontrado:', token);
    const reqConToken = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(reqConToken);
  }

  const userData = auth.getUserData();
  const email = userData?.email || 'medios@grupobituaj.com.mx';

  return msAuth.obtenerTokenMicrosoft(email).pipe(
    switchMap((accessToken) => {
      const newReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
      return next(newReq);
    }),
    catchError((err) => {
      console.error('Error obteniendo token Microsoft:', err);
      return throwError(() => err);
    })
  );
};
