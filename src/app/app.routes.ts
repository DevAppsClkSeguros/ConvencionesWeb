import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'hotel',
    loadChildren: () => import ('./convenciones/hotel/hotel.routes'),
  },
  {
    path: 'evento',
    loadChildren: () => import ('./convenciones/evento/evento.routes'),
  },
  {
    path: '**',
    redirectTo: ''
  }
];
