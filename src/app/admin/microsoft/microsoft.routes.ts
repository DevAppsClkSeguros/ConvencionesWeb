import { Routes } from '@angular/router';
import { CredencialesUpdateComponent } from './credenciales/components/credenciales-update/credenciales-update.component';

export const ModulosAppRoutes: Routes = [
  // {
  //   path: 'list',
  //   component: ModulosListComponent,
  // },
  {
    path: 'edit',
    component: CredencialesUpdateComponent,
  },
  {
    path: '**',
    redirectTo: 'lista',
  },
];

export default ModulosAppRoutes;
