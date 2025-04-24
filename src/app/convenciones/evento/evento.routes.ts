import { Routes } from '@angular/router';
import { EventoComponent } from './components/evento-list/evento-list.component';

export const HotelRoutes: Routes = [
  {
    path: 'evento',
    component: EventoComponent,
  },
  {
    path: '**',
    component: EventoComponent,
  },
];

export default HotelRoutes;
