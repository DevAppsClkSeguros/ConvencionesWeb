import { Routes } from '@angular/router';
import { ActividadesListComponent } from './components/actividades-list/actividades-list.component';
import { ActividadesUpdateComponent } from './components/actividades-update/actividades-update.component';
import { CategoriasListComponent } from './components/categorias-list/categorias-list.component';
import { CategoriasUpdateComponent } from './components/categorias-update/categorias-update.component';

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
  {
    path: 'categorias',
    component: CategoriasListComponent,
  },
  {
    path: 'categorias/:id/edit',
    component: CategoriasUpdateComponent,
  },
  {
    path: 'categorias/new',
    component: CategoriasUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default RecomendacionesRoutes;
