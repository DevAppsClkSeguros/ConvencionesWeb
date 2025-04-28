import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../interceptor/auth.service';
import { Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token && token.length > 0) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
