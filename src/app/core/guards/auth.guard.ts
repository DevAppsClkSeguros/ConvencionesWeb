import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../interceptor/auth.service';
import { NotificacionService } from '@shared/services/notificacion.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificacion = inject(NotificacionService);

  const user = authService.getUserData();
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data['roles'] as string[] | undefined;

  if (allowedRoles) {
    const userRoles = user?.Roles as string[];
    const hasAccess = userRoles?.some((r) => allowedRoles.includes(r));
    if (!hasAccess) {
      notificacion.show(
        'No tienes permiso para acceder a esa sección.',
        'error'
      );
      router.navigate(['/dashboard']);
      return false;
    }
  }

  return true;
};
