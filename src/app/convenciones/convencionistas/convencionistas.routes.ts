import { Routes } from '@angular/router';
import { ConvencionistasListComponent } from './components/convencionistas/convencionistas-list/convencionistas-list.component';
import { ConvencionistasUpdateComponent } from './components/convencionistas/convencionistas-update/convencionistas-update.component';
import { CategoriasListComponent } from './components/categorias/categorias-list/categorias-list.component';
import { CategoriasUpdateComponent } from './components/categorias/categorias-update/categorias-update.component';
import { PerfilesListComponent } from './components/perfiles/perfiles-list/perfiles-list.component';
import { PerfilesUpdateComponent } from './components/perfiles/perfiles-update/perfiles-update.component';
import { AuthGuard } from '@core/guards/auth.guard';

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
    data: { roles: ['ROLE_ADMIN'] },
  },
  {
    path: 'categorias/:id/edit',
    component: CategoriasUpdateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },
  {
    path: 'categorias/new',
    component: CategoriasUpdateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },
  {
    path: 'perfiles',
    component: PerfilesListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },
  {
    path: 'perfiles/:id/edit',
    component: PerfilesUpdateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },
  {
    path: 'perfiles/new',
    component: PerfilesUpdateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_ADMIN'] },
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default ConvencionistasRoutes;
