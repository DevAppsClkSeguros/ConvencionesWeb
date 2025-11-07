import { Routes } from '@angular/router';
import { ModulosListComponent } from './pages/modulos-list/modulos-list.component';
import { ModulosUpdateComponent } from './pages/modulos-update/modulos-update.component';

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
