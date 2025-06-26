import { Routes } from '@angular/router';
import { RecomendacionesListComponent } from './components/recomendaciones-list/recomendaciones-list.component';
import { RecomendacionesUpdateComponent } from './components/recomendaciones-update/recomendaciones-update.component';
import { CategoriasListComponent } from './components/categorias-list/categorias-list.component';
import { CategoriasUpdateComponent } from './components/categorias-update/categorias-update.component';

export const RecomendacionesRoutes: Routes = [
  {
    path: '',
    component: RecomendacionesListComponent,
  },
  {
    path: ':id/edit',
    component: RecomendacionesUpdateComponent,
  },
  {
    path: 'new',
    component: RecomendacionesUpdateComponent,
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
