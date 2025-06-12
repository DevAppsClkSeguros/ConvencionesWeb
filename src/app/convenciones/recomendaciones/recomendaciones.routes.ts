import { Routes } from '@angular/router';
import { RecomendacionesListComponent } from './components/recomendaciones-list/recomendaciones-list.component';
import { RecomendacionesUpdateComponent } from './components/recomendaciones-update/recomendaciones-update.component';

export const RecomendacionesRoutes: Routes = [
  {
    path: '',
    component: RecomendacionesListComponent,
  },
  {
    path: ':id/edit',
    component: RecomendacionesUpdateComponent,
  },
  {
    path: 'new',
    component: RecomendacionesUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default RecomendacionesRoutes;
