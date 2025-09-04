import { Routes } from '@angular/router';
import { VersionAppListComponent } from './components/version-app-list/version-app-list.component';
import { VersionAppUpdateComponent } from './components/version-app-update/version-app-update.component';

export const VersionAppRoutes: Routes = [
  {
    path: 'list',
    component: VersionAppListComponent,
  },
  {
    path: ':id/edit',
    component: VersionAppUpdateComponent,
  },
  {
    path: '**',
    redirectTo: 'list',
  },
];

export default VersionAppRoutes;
