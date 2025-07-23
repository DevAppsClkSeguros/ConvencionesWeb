import { Component, inject, OnInit, signal } from '@angular/core';
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
export class MemorasNavbarComponent implements OnInit {
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

  ngOnInit(): void {}

  multimedia(convencion: string) {
    this.microsoftGraphService.archivosUnidadOneDriveMS().subscribe({
      next: (dataUnidad) => {
        console.log('Cargando dataUnidad: ', dataUnidad);
        if (dataUnidad) {
          let eventoPath = dataUnidad.value.filter(
            (v) => v.name === convencion
          )[0];
          this.microsoftGraphService
            .archivosCarpetaOneDriveMS(eventoPath.id)
            .subscribe({
              next: (dataCarpeta) => {
                if (dataCarpeta) {
                  let imagenesPath = dataCarpeta.value.filter(v => v.name === 'imagenes')[0];
                   this.router.navigate([
                     `/memorias-fotograficas/fotos/${imagenesPath.id}`,
                   ]);
                }
              },
            });
        }
      },
    });
  }

  navegar(convencion: string) {
    // console.log('Navegando a la convención:', convencion);
    // this.router.navigate([`/memorias-fotograficas/fotos/${convencion}`]);
  }
}
