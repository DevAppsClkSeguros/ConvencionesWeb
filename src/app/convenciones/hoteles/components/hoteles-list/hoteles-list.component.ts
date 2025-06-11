import {
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { HotelesService } from '../../services/hoteles.service';
import { map } from 'rxjs';
import { ConvencionesService } from 'src/app/convenciones/convenciones/services/convenciones.service';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { RouterLink } from '@angular/router';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-hoteles-list',
  imports: [
    IconRefreshComponent,
    IconAddComponent,
    RouterLink,
    ConfirmModalComponent,
  ],
  templateUrl: './hoteles-list.component.html',
})
export class HotelesListComponent {
  hotelesService = inject(HotelesService);
  notificacion = inject(NotificacionService);
  mensajeEliminar = '';
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  hotelId: number = 0;

  hotelesResource = rxResource({
    loader: () => {
      return this.hotelesService
        .obtieneHoteles()
        .pipe(map((resp) => resp.response));
    },
  });

  refrescaDatos() {
    this.hotelesResource.reload();
  }

  abrirModal(hotelId: number) {
    this.hotelId = hotelId;
    this.mensajeEliminar = `¿Está seguro de eliminar el registro ${hotelId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaConvencion() {
    this.hotelesService.eliminaHotel(this.hotelId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Hotel eliminado correctamente', 'success');
          this.hotelesResource.update((hoteles) => {
            return hoteles?.filter((hotel) => hotel.id !== this.hotelId);
          });
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar el hotel', 'error');
      },
    });
  }
}
