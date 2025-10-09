import { Routes } from '@angular/router';
import { ConvencionesLayoutComponent } from './layouts/convenciones-layout/convenciones-layout.component';
import { HomePageComponent } from '@shared/pages/home-page/home-page.component';
import { AuthGuard } from '@auth/guards/auth.guard';

export const ConvencionesRoutes: Routes = [
  {
    path: '',
    component: ConvencionesLayoutComponent,
    children: [
      {
        path: 'convencionistas',
        loadChildren: () =>
          import('../convenciones/features/convencionistas/convencionistas.routes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'convenciones',
        loadChildren: () =>
          import('../convenciones/features/convenciones/convenciones.routes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'encuesta',
        loadChildren: () => import('../convenciones/features/encuesta/encuesta.routes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'memorias-fotograficas',
        loadChildren: () =>
          import(
            '../convenciones/features/memorias-fotograficas/memorias-fotograficas.routes'
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'hoteles',
        loadChildren: () => import('../convenciones/features/hoteles/hoteles.routes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'recomendaciones',
        loadChildren: () =>
          import('../convenciones/features/recomendaciones/recomendaciones.routes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'vuelos',
        loadChildren: () => import('../convenciones/features/vuelos/vuelos.routes'),
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
          import('../convenciones/features/actividades/actividades.routes'),
        canActivate: [AuthGuard],
      },
      {
        path: 'version-app',
        loadChildren: () =>
          import(
            '../convenciones/features/configuracion/version-app/version-app.routes'
          ),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'modulos',
        loadChildren: () =>
          import('../convenciones/features/configuracion/modulos/modulos.routes'),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'credencialesMicrosoft',
        loadChildren: () =>
          import('../convenciones/features/configuracion/microsoft/microsoft.routes'),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'convencionistas',
  },
];
export default ConvencionesRoutes;
