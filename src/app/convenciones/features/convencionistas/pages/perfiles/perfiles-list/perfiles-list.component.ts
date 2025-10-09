import { Component, inject, ViewChild } from '@angular/core';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotificacionService } from '@shared/services/notificacion.service';
import { map } from 'rxjs';
import { PerfilesService } from '../../../services/perfiles.service';

@Component({
  selector: 'app-perfiles-list',
  imports: [
    IconAddComponent,
    IconRefreshComponent,
    ConfirmModalComponent,
    RouterLink,
  ],
  templateUrl: './perfiles-list.component.html',
})
export class PerfilesListComponent {
  perfilesService = inject(PerfilesService);
  notificacion = inject(NotificacionService);
  mensajeEliminar = '';
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  perfilId: number = 0;

  perfilesResource = rxResource({
    loader: () => {
      return this.perfilesService
        .obtienePerfiles()
        .pipe(map((resp) => resp.response));
    },
  });

  refrescaDatos() {
    this.perfilesResource.reload();
  }

  abrirModal(perfilId: number) {
    this.perfilId = perfilId;
    this.mensajeEliminar = `¿Está seguro de eliminar el perfil ${perfilId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaPerfil() {
    this.perfilesService.eliminaPerfil(this.perfilId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Perfil eliminado correctamente', 'success');
          this.perfilesResource.update((hoteles) => {
            return hoteles?.filter((hotel) => hotel.id !== this.perfilId);
          });
        } else {
          this.notificacion.show(
            `${data.message?.[0] || 'Error desconocido'}`,
            'error'
          );
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar el perfil', 'error');
      },
    });
  }
}
