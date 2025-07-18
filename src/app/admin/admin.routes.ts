import { Routes } from '@angular/router';
import { UsuariosListComponent } from './usuarios/components/usuarios-list/usuarios-list.component';
import { UsuariosUpdateComponent } from './usuarios/components/usuarios-update/usuarios-update.component';
import { VersionAppListComponent } from './version-app/components/version-app-list/version-app-list.component';
import { VersionAppUpdateComponent } from './version-app/components/version-app-update/version-app-update.component';

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
    path: 'version-app',
    component: VersionAppListComponent,
  },
  {
    path: 'version-app/:id/edit',
    component: VersionAppUpdateComponent,
  },
  {
    path: '**',
    redirectTo: 'usuarios',
  },
];

export default AdminRoutes;
