import { Routes } from '@angular/router';
import { ConvencionistasListComponent } from './components/convencionistas/convencionistas-list/convencionistas-list.component';
import { ConvencionistasUpdateComponent } from './components/convencionistas/convencionistas-update/convencionistas-update.component';
import { CategoriasListComponent } from './components/categorias/categorias-list/categorias-list.component';
import { CategoriasUpdateComponent } from './components/categorias/categorias-update/categorias-update.component';
import { PerfilesListComponent } from './components/perfiles/perfiles-list/perfiles-list.component';
import { PerfilesUpdateComponent } from './components/perfiles/perfiles-update/perfiles-update.component';

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
    path: 'perfiles',
    component: PerfilesListComponent,
  },
  {
    path: 'perfiles/:id/edit',
    component: PerfilesUpdateComponent,
  },
  {
    path: 'perfiles/new',
    component: PerfilesUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default ConvencionistasRoutes;
