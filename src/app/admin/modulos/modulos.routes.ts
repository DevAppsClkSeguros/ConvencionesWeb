import { Routes } from '@angular/router';
import { ModulosListComponent } from './components/modulos-list/modulos-list.component';
import { ModulosUpdateComponent } from './components/modulos-update/modulos-update.component';

export const ModulosAppRoutes: Routes = [
  {
    path: 'list',
    component: ModulosListComponent,
  },
  {
    path: ':id/edit',
    component: ModulosUpdateComponent,
  },
  {
    path: 'new',
    component: ModulosUpdateComponent,
  },
  {
    path: '**',
    redirectTo: 'lista',
  },
];

export default ModulosAppRoutes;
