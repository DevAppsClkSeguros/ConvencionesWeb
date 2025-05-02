import { Routes } from '@angular/router';
import { ConvencionistasListComponent } from './components/convencionistas-list/convencionistas-list.component';
import { ConvencionistasUpdateComponent } from './components/convencionistas-update/convencionistas-update.component';

export const ConvencionistasRoutes: Routes = [
  {
    path: '',
    component: ConvencionistasListComponent,
  },
  {
    path: ':id/edit',
    component: ConvencionistasUpdateComponent,
  },
  {
    path: 'new',
    component: ConvencionistasUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default ConvencionistasRoutes;
