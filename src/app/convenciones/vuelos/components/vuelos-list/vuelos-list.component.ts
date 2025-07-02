import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { NotificacionService } from '@shared/services/notificacion.service';
import { VuelosService } from '../../services/vuelos.service';
import { Vuelo } from '../../interfaces/vuelos.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-vuelos-list',
  imports: [
    IconRefreshComponent,
    IconAddComponent,
    ConfirmModalComponent,
    RouterLink,
    DatePipe
  ],
  templateUrl: './vuelos-list.component.html',
})
export class VuelosListComponent {
  vuelosService = inject(VuelosService);

  notificacion = inject(NotificacionService);
  router = inject(Router);
  convencionSeleccionada = signal<string>('');
  mensajeEliminar = '';

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  vueloId: number = 0;

  vuelosResource = rxResource({
    request: () => ({}),
    loader: () => {
      return this.vuelosService
        .obtieneVuelos()
        .pipe(map((resp) => resp.response));
    },
  });

  refrescaDatos() {
    this.vuelosResource.reload();
  }

  actualizaVuelo(vuelo: Vuelo, Convencion: any) {
    setTimeout(() => {
      this.vuelosService.actualizaVuelo(vuelo).subscribe({
        next: (data) => {
          if (data.status) {
            this.notificacion.show(
              `El vuelo con Id:${vuelo.id} ha sido actualizado correctamente`,
              'success'
            );
          }
        },
      });
    }, 200);
  }

  abrirModal(vueloId: number) {
    this.vueloId = vueloId;
    this.mensajeEliminar = `¿Está seguro de eliminar el registro ${vueloId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaVuelo() {
    this.vuelosService.eliminaVuelo(this.vueloId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('vuelo eliminado correctamente', 'success');
          this.vuelosResource.update((vuelos) => {
            return vuelos?.filter((vuelo) => vuelo.id !== this.vueloId);
          });
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar el vuelo', 'error');
      },
    });
  }
}
