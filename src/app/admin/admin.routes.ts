import { Routes } from '@angular/router';
import { UsuariosListComponent } from './usuarios/components/usuarios/usuarios-list/usuarios-list.component';
import { UsuariosUpdateComponent } from './usuarios/components/usuarios/usuarios-update/usuarios-update.component';

export const AdminRoutes: Routes = [
  {
    path: 'usuarios',
    component: UsuariosListComponent,
  },
  {
    path: 'usuarios/:username/edit',
    component: UsuariosUpdateComponent,
  },
  {
    path: 'usuarios/new',
    component: UsuariosUpdateComponent,
  },
  {
    path: 'modulos',
    loadChildren: () => import('./modulos/modulos.routes'),
  },
  {
    path: 'version-app',
    loadChildren: () => import('./version-app/version-app.routes'),
  },
  {
    path: '**',
    redirectTo: 'usuarios',
  },
];

export default AdminRoutes;
