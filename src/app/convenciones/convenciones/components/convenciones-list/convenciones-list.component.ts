import { Component, inject, ViewChild } from '@angular/core';
import { ConvencionesService } from '../../services/convenciones.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'convenciones-list',
  imports: [
    DatePipe,
    RouterLink,
    IconRefreshComponent,
    IconAddComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './convenciones-list.component.html',
})
export class ConvencionesListComponent {
  convencionesService = inject(ConvencionesService);
  notificacion = inject(NotificacionService);
  mensajeEliminar = '';

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  convencionId: number = 0;

  convencionesResource = rxResource({
    request: () => ({}),
    loader: () => {
      return this.convencionesService
        .obtieneConvenciones()
        .pipe(
          map((resp) => resp.response),
        catchError((error) => {
                  this.notificacion.show(
                    'Ocurrio un error al cargar lista de convenciones.',
                    'error'
                  );
                  return of([]);
                })
              );
    },
  });

  refrescaDatos() {
    this.convencionesResource.reload();
  }

  abrirModal(convencionId: number) {
    this.convencionId = convencionId;
    this.mensajeEliminar = `¿Está seguro de eliminar el registro ${convencionId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaConvencion() {
    this.convencionesService.eliminaConvencion(this.convencionId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            'Convención eliminada correctamente',
            'success'
          );
          this.convencionesResource.update((convenciones) => {
            return convenciones?.filter(
              (convencion) => convencion.id !== this.convencionId
            );
          });
        } else {
          this.notificacion.show(
            `${data.message?.[0] || 'Error desconocido'}`,
            'error'
          );
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar la convención', 'error');
      },
    });
  }
}
