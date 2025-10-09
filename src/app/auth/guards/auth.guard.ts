import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { NotificacionService } from '@shared/services/notificacion.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificacion = inject(NotificacionService);

  const user = authService.getUserData();
  if (!user) {
    router.navigate(['/auth/login']);
    return false;
  }

  const allowedRoles = route.data['roles'] as string[] | undefined;

  if (allowedRoles) {
    // Normalizamos Roles
    let userRoles: string[] = [];
    if (Array.isArray(user?.Roles)) {
      userRoles = user.Roles;
    } else if (typeof user?.Roles === 'string') {
      userRoles = [user.Roles];
    }

    const hasAccess = userRoles.some((r) => allowedRoles.includes(r));

    if (!hasAccess) {
      notificacion.show(
        'No tienes permiso para acceder a esa sección.',
        'error'
      );
      const currentUrl = router.url;
      const tryingToAccessFromOutside =
        currentUrl === '/' || currentUrl === '/auth/login';
      if (tryingToAccessFromOutside) {
        router.navigate(['/convencionistas']);
      }

      // router.navigate(['/dashboard']);
      return false;
    }
  }

  return true;
};
