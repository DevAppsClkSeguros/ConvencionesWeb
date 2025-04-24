import { Routes } from '@angular/router';
import { HotelListComponent } from './list/hotel-list.component';
import { HotelUpdateComponent } from './update/hotel-update.component';

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
