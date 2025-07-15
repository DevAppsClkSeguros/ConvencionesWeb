import { Routes } from '@angular/router';
import { UsuariosListComponent } from './components/usuarios-list/usuarios-list.component';
import { UsuariosUpdateComponent } from './components/usuarios-update/usuarios-update.component';

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
    path: '**',
    redirectTo: ''
  },
];

export default AdminRoutes;
