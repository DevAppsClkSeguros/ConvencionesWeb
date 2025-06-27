import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PasswordResetInitComponent } from './account/password-reset/init/password-reset-init/password-reset-init.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    component: HomePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'convencionistas',
    loadChildren: () =>
      import('./convenciones/convencionistas/convencionistas.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'convenciones',
    loadChildren: () =>
      import('./convenciones/convenciones/convenciones.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'encuesta',
    loadChildren: () => import('./convenciones/encuesta/encuesta.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'memorias-fotograficas',
    loadChildren: () =>
      import(
        './convenciones/memorias-fotograficas/memorias-fotograficas.routes'
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'hoteles',
    loadChildren: () => import('./convenciones/hoteles/hoteles.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'recomendaciones',
    loadChildren: () =>
      import('./convenciones/recomendaciones/recomendaciones.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'vuelos',
    loadChildren: () => import('./convenciones/vuelos/vuelos.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./account/account.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/usuarios/usuarios.routes'),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
