import { Routes } from '@angular/router';
import { ActividadesListComponent } from './pages/actividades-list/actividades-list.component';
import { ActividadesUpdateComponent } from './pages/actividades-update/actividades-update.component';
import { AuthGuard } from '@auth/guards/auth.guard';
import { CategoriasListComponent } from './pages/categorias-list/categorias-list.component';
import { CategoriasUpdateComponent } from './pages/categorias-update/categorias-update.component';

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
