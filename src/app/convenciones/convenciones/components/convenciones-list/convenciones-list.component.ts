import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConvencionesService } from '../../services/convenciones.service';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
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
  router = inject(Router);
  notificacion = inject(NotificacionService);
  mensajeEliminar = '';

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  convencionId: number = 0;

  convencionesResource = rxResource({
    request: () => ({}),
    loader: () => {
      console.log('rxresourceeeee');
      return this.convencionesService
        .obtieneConvenciones()
        .pipe(map((resp) => resp.response));
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
            return convenciones?.filter((convencion) => convencion.id !== this.convencionId)
          })
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar la convención', 'error');
      },
    });
  }
}
