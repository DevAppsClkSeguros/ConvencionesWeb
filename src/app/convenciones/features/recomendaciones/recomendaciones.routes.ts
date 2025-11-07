import { Routes } from '@angular/router';
import { AuthGuard } from '@auth/guards/auth.guard';
import { CategoriasListComponent } from './pages/categorias-list/categorias-list.component';
import { CategoriasUpdateComponent } from './pages/categorias-update/categorias-update.component';
import { RecomendacionesListComponent } from './pages/recomendaciones-list/recomendaciones-list.component';
import { RecomendacionesUpdateComponent } from './pages/recomendaciones-update/recomendaciones-update.component';

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
