import { Routes } from '@angular/router';
import { MemoriasFotograficasComponent } from './components/memorias-fotograficas/memorias-fotograficas.component';

export const ConvencionistasRoutes: Routes = [
  {
    path: '',
    component: MemoriasFotograficasComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default ConvencionistasRoutes;
