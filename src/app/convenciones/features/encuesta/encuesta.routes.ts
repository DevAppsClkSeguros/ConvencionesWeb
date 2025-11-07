import { Routes } from '@angular/router';
import { PreguntasListComponent } from './pages/preguntas/preguntas-list/preguntas-list.component';
import { PreguntasUpdateComponent } from './pages/preguntas/preguntas-update/preguntas-update.component';
import { EncuestaLayoutComponent } from './layouts/encuesta-layout/encuesta-layout.component';
import { RespuestasListComponent } from './pages/respuestas/respuestas-list/respuestas-list.component';

export const EncuestaRoutes: Routes = [
  {
    path: '',
    component: EncuestaLayoutComponent,
    children: [
      {
        path: 'preguntas',
        component: PreguntasListComponent,
      },
      {
        path: 'respuestas',
        component: RespuestasListComponent,
      },
    ],
  },
  {
    path: 'preguntas/:id/edit',
    component: PreguntasUpdateComponent,
  },
  {
    path: 'preguntas/new',
    component: PreguntasUpdateComponent,
  },
  {
    path: '**',
    redirectTo: 'preguntas',
  },
];

export default EncuestaRoutes;
