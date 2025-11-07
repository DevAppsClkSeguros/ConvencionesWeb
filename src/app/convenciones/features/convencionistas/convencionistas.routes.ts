import { Routes } from '@angular/router';
import { ConvencionistasListComponent } from './pages/convencionistas/convencionistas-list/convencionistas-list.component';
import { ConvencionistasUpdateComponent } from './pages/convencionistas/convencionistas-update/convencionistas-update.component';
import { CategoriasListComponent } from './pages/categorias/categorias-list/categorias-list.component';
import { CategoriasUpdateComponent } from './pages/categorias/categorias-update/categorias-update.component';
import { PerfilesListComponent } from './pages/perfiles/perfiles-list/perfiles-list.component';
import { PerfilesUpdateComponent } from './pages/perfiles/perfiles-update/perfiles-update.component';
import { AuthGuard } from '@auth/guards/auth.guard';

export const ConvencionistasRoutes: Routes = [
  {
    path: '',
    component: ConvencionistasListComponent,
  },
  {
    path: ':id/edit',
    component: ConvencionistasUpdateComponent,
  },
  {
    path: 'new',
    component: ConvencionistasUpdateComponent,
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
    path: 'perfiles',
    component: PerfilesListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'perfiles/:id/edit',
    component: PerfilesUpdateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: 'perfiles/new',
    component: PerfilesUpdateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default ConvencionistasRoutes;
