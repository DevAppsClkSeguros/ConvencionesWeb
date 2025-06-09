import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { PreguntasService } from '../../services/preguntas.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { NotificacionService } from '@shared/services/notificacion.service';

@Component({
  selector: 'app-preguntas-list',
  imports: [
    RouterLink,
    ConfirmModalComponent,
    IconRefreshComponent,
    IconAddComponent,
  ],
  templateUrl: './preguntas-list.component.html',
})
export class PreguntasListComponent {
  preguntasService = inject(PreguntasService);
  notificacion = inject(NotificacionService);
  preguntaId: number = 0;
  mensajeEliminar = '';
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;

  preguntasResource = rxResource({
    request: () => ({}),
    loader: () => {
      return this.preguntasService
        .obtienePreguntas()
        .pipe(map((resp) => resp.response));
    },
  });

  refrescaDatos() {
    this.preguntasResource.reload();
  }

  abrirModal(preguntaId: number) {
    this.preguntaId = preguntaId;
    this.mensajeEliminar = `¿Está seguro de eliminar el registro ${preguntaId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaPregunta() {
    this.preguntasService.eliminaPregunta(this.preguntaId).subscribe({
      next: (data) => {
        if (data.status) {
          this.preguntasResource.update((preguntas) => {
            return preguntas?.filter(
              (pregunta) => pregunta.id !== this.preguntaId
            );
          });
          this.notificacion.show('Pregunta eliminada correctamente', 'success');
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar la pregunta', 'error');
      },
    });
  }
}
