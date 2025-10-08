import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PasswordResetInitComponent } from './account/password-reset/init/password-reset-init/password-reset-init.component';
import { noAuthGuard } from '@core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    canMatch: [noAuthGuard],
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./account/account.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes'),
    canActivate: [AuthGuard],
    // data: { roles: ['ADMIN'] },
  },
  {
    path: '',
    loadChildren: () => import('./convenciones/convenciones.routes'),
    canActivate: [AuthGuard],
    // data: { roles: ['ADMIN'] },
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
