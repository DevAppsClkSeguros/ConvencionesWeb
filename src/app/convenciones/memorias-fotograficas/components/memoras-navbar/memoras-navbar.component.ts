import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { ConvencionesService } from 'src/app/convenciones/convenciones/services/convenciones.service';
import { Convencion } from 'src/app/convenciones/convenciones/interfaces/convenciones.interface';
import { NotificacionService } from '@shared/services/notificacion.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MicrosoftGraphService } from '../../services/microsoftGraph.service';

@Component({
  selector: 'memoras-navbar',
  imports: [RouterLink, RouterLinkActive, IconRefreshComponent],
  templateUrl: './memoras-navbar.component.html',
})
export class MemorasNavbarComponent {
  convencionSeleccionada = signal<string>('');
  router = inject(Router);
  convenciones = signal<Convencion[]>([]);
  eventosService = inject(ConvencionesService);
  notificacion = inject(NotificacionService);
  microsoftGraphService = inject(MicrosoftGraphService);

  convencionesResource = rxResource({
    loader: ({}) => {
      return this.eventosService
        .obtieneConvenciones()
        .pipe(map((resp) => resp.response));
    },
  });

  multimedia(convencion: string) {
    this.microsoftGraphService.archivosUnidadOneDriveMS().subscribe({
      next: (dataUnidad) => {
        if (dataUnidad) {
          console.log('dataUnidad: ', dataUnidad);
          let eventoPath = dataUnidad.value.filter(
            (v) => v.name === convencion
          )[0];
          console.log('eventoPath: ', eventoPath);
          if (eventoPath) {
            this.microsoftGraphService
              .archivosCarpetaOneDriveMS(eventoPath?.id)
              .subscribe({
                next: (dataCarpeta) => {
                  if (dataCarpeta) {
                    console.log('dataCarpeta: ', dataCarpeta);
                    let imagenesPath = dataCarpeta.value.filter(
                      (v) => v.name === 'imagenes'
                    )[0];
                    this.router.navigate([
                      `/memorias-fotograficas/fotos/${imagenesPath.id}`,
                    ]);
                  }
                },
              });
          }
        }
      },
    });
  }
}
