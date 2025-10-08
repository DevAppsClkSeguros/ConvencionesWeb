import { Routes } from '@angular/router';
import { ConvencionesLayoutComponent } from './layouts/convenciones-layout/convenciones-layout.component';
import { HomePageComponent } from '@shared/pages/home-page/home-page.component';
import { AuthGuard } from '@core/guards/auth.guard';

export const ConvencionesRoutes: Routes = [
  {
    path: '',
    component: ConvencionesLayoutComponent,
    children: [
      // {
      //   path: 'dashboard',
      //   component: HomePageComponent,
      // },
      {
        path: 'convencionistas',
        loadChildren: () =>
          import('../convenciones/convencionistas/convencionistas.routes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'convenciones',
        loadChildren: () =>
          import('../convenciones/convenciones/convenciones.routes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'encuesta',
        loadChildren: () => import('../convenciones/encuesta/encuesta.routes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'memorias-fotograficas',
        loadChildren: () =>
          import(
            '../convenciones/memorias-fotograficas/memorias-fotograficas.routes'
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'hoteles',
        loadChildren: () => import('../convenciones/hoteles/hoteles.routes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'recomendaciones',
        loadChildren: () =>
          import('../convenciones/recomendaciones/recomendaciones.routes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'vuelos',
        loadChildren: () => import('../convenciones/vuelos/vuelos.routes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'cuenta',
        loadChildren: () => import('../account/account.routes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'actividades',
        loadChildren: () =>
          import('../convenciones/actividades/actividades.routes'),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'convencionistas',
  },
];
export default ConvencionesRoutes;
