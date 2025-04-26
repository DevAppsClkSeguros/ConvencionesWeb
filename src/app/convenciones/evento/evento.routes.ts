import { Routes } from '@angular/router';
import { EventoComponent } from './components/evento-list/evento-list.component';
import { EventoUpdateComponent } from './components/evento-update/evento-update.component';

export const HotelRoutes: Routes = [
  {
    path: '',
    component: EventoComponent,
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
