import { Routes } from '@angular/router';
import { EventosListComponent } from './components/evento-list/eventos-list.component';
import { EventoUpdateComponent } from './components/evento-update/evento-update.component';

export const HotelRoutes: Routes = [
  {
    path: '',
    component: EventosListComponent,
  },
  {
    path: ':id/edit',
    component: EventoUpdateComponent,
  },
  {
    path: 'new',
    component: EventoUpdateComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default HotelRoutes;
