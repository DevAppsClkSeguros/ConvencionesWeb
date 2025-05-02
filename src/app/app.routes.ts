import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './core/guards/auth.guard';

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
    path: 'usuarios',
    loadChildren: () => import('./convenciones/convencionistas/convencionistas.routes'),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
