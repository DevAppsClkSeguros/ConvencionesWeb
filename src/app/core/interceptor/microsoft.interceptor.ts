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

  let token = msAuth.getMicrosoftToken();

  const userData = auth.getUserData();
  const email = userData?.email || 'medios@grupobituaj.com.mx';

  const procesarPeticion = (accessToken: string) => {
    const reqConToken = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });

    return next(reqConToken).pipe(
      catchError((error) => {
        if (error.status === 401) {
          console.warn('Token Microsoft expirado o inválido. Renovando...');
          msAuth.clearMicrosoftToken();
          return msAuth.obtenerTokenMicrosoft(email).pipe(
            switchMap((nuevoToken) => {
              const reqRenovada = req.clone({
                setHeaders: { Authorization: `Bearer ${nuevoToken}` },
              });
              return next(reqRenovada);
            }),
            catchError((err) => {
              console.error(
                'Error al renovar token Microsoft después de 401:',
                err
              );
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  };

  if (token) {
    return procesarPeticion(token);
  }

  return msAuth.obtenerTokenMicrosoft(email).pipe(
    switchMap((nuevoToken) => procesarPeticion(nuevoToken)),
    catchError((err) => {
      return throwError(() => err);
    })
  );
};
