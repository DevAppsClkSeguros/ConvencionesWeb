import { Routes } from '@angular/router';
import { MemoriasFotograficasComponent } from './components/memorias-fotograficas/memorias-fotograficas.component';

export const MemoriasFotograficasRoutes: Routes = [
  {
    path: '',
    component: MemoriasFotograficasComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default MemoriasFotograficasRoutes;
