import { Routes } from '@angular/router';
import { UsuariosListComponent } from './components/usuarios-list/usuarios-list.component';
import { UsuariosUpdateComponent } from './components/usuarios-update/usuarios-update.component';

export const AdministrarUsuariosRoutes: Routes = [
  {
    path: '',
    component: UsuariosListComponent,
  },
  {
    path: ':id/edit',
    component: UsuariosUpdateComponent,
  },
  {
    path: 'new',
    component: UsuariosUpdateComponent,
  },
  {
    path: '**',
    redirectTo: ''
  },
];

export default AdministrarUsuariosRoutes;
