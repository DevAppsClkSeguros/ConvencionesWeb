import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PasswordResetInitComponent } from './account/password-reset/init/password-reset-init/password-reset-init.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    component: HomePageComponent,
  },
  {
    path: 'convencionistas',
    loadChildren: () => import('./convenciones/convencionistas/convencionistas.routes'),
  },
  {
    path: 'convenciones',
    loadChildren: () => import('./convenciones/convenciones/convenciones.routes'),
  },
  {
    path: 'preguntas',
    loadChildren: () => import('./convenciones/preguntas/preguntas.routes'),
  },
  {
    path: 'memorias-fotograficas',
    loadChildren: () => import('./convenciones/memorias-fotograficas/memorias-fotograficas.routes'),
  },
  {
    path: 'hoteles',
    loadChildren: () => import('./convenciones/hoteles/hoteles.routes'),
  },
  {
    path: 'recomendaciones',
    loadChildren: () => import('./convenciones/recomendaciones/recomendaciones.routes'),
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
