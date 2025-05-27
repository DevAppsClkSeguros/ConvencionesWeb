import { Routes } from '@angular/router';
import { ConvencionesListComponent } from './components/convenciones-list/convenciones-list.component';
import { ConvencionesUpdateComponent } from './components/convenciones-update/convenciones-update.component';

export const ConvencionesRoutes: Routes = [
  {
    path: '',
    component: ConvencionesListComponent,
  },
  {
    path: ':id/edit',
    component: ConvencionesUpdateComponent,
  },
  {
    path: 'new',
    component: ConvencionesUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default ConvencionesRoutes;
