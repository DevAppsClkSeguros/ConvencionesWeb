import { Routes } from '@angular/router';
import { AuthGuard } from '@auth/guards/auth.guard';
import { noAuthGuard } from '@auth/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [noAuthGuard]
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
    data: { roles: ['ADMIN'] },
  },
  {
    path: '',
    loadChildren: () => import('./convenciones/convenciones.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
