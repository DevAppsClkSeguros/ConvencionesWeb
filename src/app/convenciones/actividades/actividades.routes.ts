import { Routes } from '@angular/router';
import { ActividadesListComponent } from './components/actividades-list/actividades-list.component';
import { ActividadesUpdateComponent } from './components/actividades-update/actividades-update.component';

export const RecomendacionesRoutes: Routes = [
  {
    path: '',
    component: ActividadesListComponent,
  },
  {
    path: ':id/edit',
    component: ActividadesUpdateComponent,
  },
  {
    path: 'new',
    component: ActividadesUpdateComponent,
  },
  // {
  //   path: 'actividades',
  //   component: CategoriasListComponent,
  // },
  // {
  //   path: 'actividades/:id/edit',
  //   component: CategoriasUpdateComponent,
  // },
  // {
  //   path: 'actividades/new',
  //   component: CategoriasUpdateComponent,
  // },
  {
    path: '**',
    redirectTo: '',
  },
];

export default RecomendacionesRoutes;
