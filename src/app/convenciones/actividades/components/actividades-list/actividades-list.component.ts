import { Component, inject, ViewChild } from '@angular/core';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ActividadesService } from '../../services/actividades.service';
import { catchError, map, of } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-actividades-list',
  imports: [
    IconAddComponent,
    IconRefreshComponent,
    ConfirmModalComponent,
    RouterLink,
    DatePipe,
  ],
  templateUrl: './actividades-list.component.html',
})
export class ActividadesListComponent {
  actividadesService = inject(ActividadesService);
  notificacion = inject(NotificacionService);
  mensajeEliminar = '';
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  actividadId: number = 0;

  actividadesResource = rxResource({
    loader: () => {
      return this.actividadesService.obtieneActividades().pipe(
        map((resp) =>
          resp.response.map((actividad) => ({
            ...actividad,
            imagen: `${actividad.imagen}?n=${Math.random()}`,
          }))
        ),
        catchError((error) => {
          this.notificacion.show(
            'Ocurrio un error al cargar lista de actividades.',
            'error'
          );
          return of([]);
        })
      );
    },
  });

  refrescaDatos() {
    this.actividadesResource.reload();
  }

  abrirModal(actividadId: number) {
    this.actividadId = actividadId;
    this.mensajeEliminar = `¿Está seguro de eliminar la actividad ${actividadId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaActividad() {
    this.actividadesService.eliminaActividad(this.actividadId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            'Actividad eliminada correctamente',
            'success'
          );
          this.actividadesResource.update((hoteles) => {
            return hoteles?.filter((hotel) => hotel.id !== this.actividadId);
          });
        } else {
          this.notificacion.show(
            `${data.message?.[0] || 'Error desconocido'}`,
            'error'
          );
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar la actividad', 'error');
      },
    });
  }
}
