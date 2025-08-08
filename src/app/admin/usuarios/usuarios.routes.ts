import { Routes } from '@angular/router';
import { UsuariosListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { UsuariosUpdateComponent } from './components/usuarios/usuarios-update/usuarios-update.component';
import { RolesListComponent } from './components/roles/roles-list/roles-list.component';
import { RolesUpdateComponent } from './components/roles/roles-update/roles-update.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    component: UsuariosListComponent,
  },
  {
    path: ':username/edit',
    component: UsuariosUpdateComponent,
  },
  {
    path: 'new',
    component: UsuariosUpdateComponent,
  },
  {
    path: 'roles',
    component: RolesListComponent,
  },
  {
    path: 'roles/:id/edit',
    component: RolesUpdateComponent,
  },
  {
    path: 'roles/new',
    component: RolesUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default AdminRoutes;
