import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const noAuthGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUserData();
  if (user) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
