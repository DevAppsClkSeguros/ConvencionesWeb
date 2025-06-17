import { Component, inject, ViewChild } from '@angular/core';
import { IconAddComponent } from "@shared/icons/icon-add/icon-add.component";
import { IconRefreshComponent } from "@shared/icons/icon-refresh/icon-refresh.component";
import { ConfirmModalComponent } from "@shared/components/confirm-modal/confirm-modal.component";
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotificacionService } from '@shared/services/notificacion.service';
import { RecomendacionesService } from '../../services/recomendaciones.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-recomendaciones-list',
  imports: [
    IconAddComponent,
    IconRefreshComponent,
    ConfirmModalComponent,
    RouterLink,
  ],
  templateUrl: './recomendaciones-list.component.html',
})
export class RecomendacionesListComponent {
  recomendacionesService = inject(RecomendacionesService);
  notificacion = inject(NotificacionService);
  mensajeEliminar = '';
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  hotelId: number = 0;

  recomendacionesResource = rxResource({
    loader: () => {
      return this.recomendacionesService
        .obtieneRecomendaciones()
        .pipe(map((resp) => resp.response));
    },
  });

  refrescaDatos() {
    this.recomendacionesResource.reload();
  }

  abrirModal(hotelId: number) {
    this.hotelId = hotelId;
    this.mensajeEliminar = `¿Está seguro de eliminar la recomendación ${hotelId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaConvencion() {
    this.recomendacionesService.eliminaRecomendacion(this.hotelId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            'recomendación eliminada correctamente',
            'success'
          );
          this.recomendacionesResource.update((hoteles) => {
            return hoteles?.filter((hotel) => hotel.id !== this.hotelId);
          });
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar la recomendación', 'error');
      },
    });
  }
}
