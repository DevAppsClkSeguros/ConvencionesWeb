import { Routes } from '@angular/router';
import { MemoriasFotograficasComponent } from './components/memorias-fotograficas/memorias-fotograficas.component';
import { MemoriasLayoutComponent } from './layout/memorias-layout/memorias-layout.component';

export const MemoriasFotograficasRoutes: Routes = [
  {
    path: '',
    component: MemoriasLayoutComponent,
    children: [
      {
        path: 'fotos/:convencion',
        component: MemoriasFotograficasComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'fotos',
  },
];

export default MemoriasFotograficasRoutes;
