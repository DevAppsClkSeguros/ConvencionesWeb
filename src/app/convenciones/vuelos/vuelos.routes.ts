import { Routes } from '@angular/router';
import { VuelosListComponent } from './components/vuelos-list/vuelos-list.component';
import { VuelosUpdateComponent } from './components/vuelos-update/vuelos-update.component';

export const VuelosRoutes: Routes = [
  {
    path: '',
    component: VuelosListComponent,
  },
  {
    path: ':id/edit',
    component: VuelosUpdateComponent,
  },
  {
    path: 'new',
    component: VuelosUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default VuelosRoutes;
