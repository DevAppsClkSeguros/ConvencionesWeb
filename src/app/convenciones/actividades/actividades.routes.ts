import { Routes } from '@angular/router';
import { ActividadesListComponent } from './components/actividades-list/actividades-list.component';
import { ActividadesUpdateComponent } from './components/actividades-update/actividades-update.component';
import { AuthGuard } from '@auth/guards/auth.guard';
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
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'categorias/:id/edit',
    component: CategoriasUpdateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'categorias/new',
    component: CategoriasUpdateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default RecomendacionesRoutes;
