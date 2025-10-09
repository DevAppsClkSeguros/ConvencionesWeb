import { Routes } from '@angular/router';
import { ModulosListComponent } from './components/modulos-list/modulos-list.component';
import { ModulosUpdateComponent } from './components/modulos-update/modulos-update.component';

export const ModulosAppRoutes: Routes = [
  {
    path: '',
    component: ModulosListComponent,
  },
  {
    path: ':id',
    component: ModulosUpdateComponent,
  },
  {
    path: '**',
    redirectTo: 'lista',
  },
];

export default ModulosAppRoutes;
