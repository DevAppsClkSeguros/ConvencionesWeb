import { Routes } from '@angular/router';
import { HotelListComponent } from './components/hotel-list/hotel-list.component';
import { HotelUpdateComponent } from './components/hotel-update/hotel-update.component';

export const HotelRoutes: Routes = [
  {
    path: 'hotel',
    component: HotelListComponent
  },
  {
    path: ':id',
    component: HotelUpdateComponent
  },
  {
    path: '**',
    component: HotelListComponent
  }
]

export default HotelRoutes;
