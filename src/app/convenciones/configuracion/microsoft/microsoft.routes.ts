import { Routes } from '@angular/router';
import { CredencialesUpdateComponent } from './credenciales/components/credenciales-update/credenciales-update.component';

export const ModulosAppRoutes: Routes = [
  {
    path: 'edit',
    component: CredencialesUpdateComponent,
  },
  {
    path: '**',
    redirectTo: 'edit',
  },
];

export default ModulosAppRoutes;
