import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { EncuestaService } from '../../../services/encuesta.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { NotificacionService } from '@shared/services/notificacion.service';
import { IconRefreshComponent } from "../../../../../shared/icons/icon-refresh/icon-refresh.component";
import { IconAddComponent } from "../../../../../shared/icons/icon-add/icon-add.component";
import { ConvencionesService } from 'src/app/convenciones/convenciones/services/convenciones.service';
import { Convencion } from 'src/app/convenciones/convenciones/interfaces/convenciones.interface';

@Component({
  selector: 'app-respuestas-list',
  imports: [IconRefreshComponent],
  templateUrl: './respuestas-list.component.html',
})
export class RespuestasListComponent implements OnInit {
  encuestaService = inject(EncuestaService);
  notificacion = inject(NotificacionService);
  eventosService = inject(ConvencionesService);
  eventoId: number = 0;
  mensajeEliminar = '';

  convencionSeleccionada = signal<string>('');
  convenciones = signal<Convencion[]>([]);

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;

  ngOnInit(): void {
    this.getConvenciones();
  }

  respuestasResource = rxResource({
    request: () => ({}),
    loader: () => {
      return this.encuestaService
        .obtieneRespuestas(1011)
        .pipe(map((resp) => resp));
    },
  });

  getConvenciones() {
    this.eventosService.obtieneConvenciones().subscribe({
      next: (data) => {
        if (data.status) {
          this.convenciones.set(data.response);
        }
      },
      error: (e) => {
        this.notificacion.show(
          'Ocurrio un error al recuperar lista de convenciones',
          'error'
        );
      },
    });
  }

  refrescaDatos() {
    this.respuestasResource.reload();
    this.convencionSeleccionada.set('');
  }

  abrirModal(preguntaId: number) {}

  eliminaRespuesta() {}
}
