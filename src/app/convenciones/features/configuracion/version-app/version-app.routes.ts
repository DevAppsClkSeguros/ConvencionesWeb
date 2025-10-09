import { Routes } from '@angular/router';
import { VersionAppListComponent } from './pages/version-app-list/version-app-list.component';
import { VersionAppUpdateComponent } from './pages/version-app-update/version-app-update.component';

export const VersionAppRoutes: Routes = [
  {
    path: '',
    component: VersionAppListComponent,
  },
  {
    path: ':id',
    component: VersionAppUpdateComponent,
  },
];

export default VersionAppRoutes;
