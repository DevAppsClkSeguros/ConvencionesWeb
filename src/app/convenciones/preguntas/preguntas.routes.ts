import { Routes } from '@angular/router';
import { PreguntasListComponent } from './components/preguntas-list/preguntas-list.component';
import { PreguntasUpdateComponent } from './components/preguntas-update/preguntas-update.component';

export const ConvencionistasRoutes: Routes = [
  {
    path: '',
    component: PreguntasListComponent,
  },
  {
    path: ':id/edit',
    component: PreguntasUpdateComponent,
  },
  {
    path: 'new',
    component: PreguntasUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default ConvencionistasRoutes;
