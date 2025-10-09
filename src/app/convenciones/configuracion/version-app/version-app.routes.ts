import { Routes } from '@angular/router';
import { VersionAppListComponent } from './components/version-app-list/version-app-list.component';
import { VersionAppUpdateComponent } from './components/version-app-update/version-app-update.component';

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
