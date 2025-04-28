import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: HomePageComponent,
  },
  {
    path: 'evento',
    loadChildren: () => import('./convenciones/evento/evento.routes'),
  },
  {
    path: 'hotel',
    loadChildren: () => import('./convenciones/hotel/hotel.routes'),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
