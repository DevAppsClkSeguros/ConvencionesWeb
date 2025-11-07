import { Routes } from '@angular/router';
import { HotelesListComponent } from './pages/hoteles-list/hoteles-list.component';
import { HotelesUpdateComponent } from './pages/hoteles-update/hoteles-update.component';

export const HotelesRoutes: Routes = [
  {
    path: '',
    component: HotelesListComponent,
  },
  {
    path: ':id/edit',
    component: HotelesUpdateComponent,
  },
  {
    path: 'new',
    component: HotelesUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default HotelesRoutes;
