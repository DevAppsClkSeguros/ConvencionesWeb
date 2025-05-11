import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PasswordResetInitComponent } from './account/password-reset/init/password-reset-init/password-reset-init.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: HomePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'evento',
    loadChildren: () => import('./convenciones/evento/evento.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'hotel',
    loadChildren: () => import('./convenciones/hotel/hotel.routes'),
  },
  {
    path: 'convencionistas',
    loadChildren: () => import('./convenciones/convencionistas/convencionistas.routes'),
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./account/account.routes')
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/administrar-usuarios/administrarUsuarios.routes')
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
