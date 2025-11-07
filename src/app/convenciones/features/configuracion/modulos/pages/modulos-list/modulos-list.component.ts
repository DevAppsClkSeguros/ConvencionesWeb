import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ModulosService } from '../../services/modulos.service';
import { Modulo } from '../../interfaces/modulos.interface';

@Component({
  selector: 'app-modulos-list',
  imports: [
    IconRefreshComponent,
    IconAddComponent,
    ConfirmModalComponent,
    RouterLink,
  ],
  templateUrl: './modulos-list.component.html',
})
export class ModulosListComponent {

  modulosService = inject(ModulosService);
  notificacion = inject(NotificacionService);
  router = inject(Router);
  convencionSeleccionada = signal<string>('');
  mensajeEliminar = '';

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  moduloId: number = 0;

  modulosResource = rxResource({
    loader: () => {
      return this.modulosService.obtieneModulos().pipe(
        map((resp) => resp.response),
        catchError((error) => {
          this.notificacion.show(
            'Ocurrio un error al cargar lista de modulos.',
            'error'
          );
          return of([]);
        })
      );
    },
  });

  refrescaDatos() {
    this.modulosResource.reload();
  }

  // actualizaModulo(modulo: Modulo, Convencion: any) {
  //   setTimeout(() => {
  //     this.modulosService.actualizaModulo(modulo).subscribe({
  //       next: (data) => {
  //         if (data.status) {
  //           this.notificacion.show(
  //             `El módulo con Id:${modulo.id} ha sido actualizado correctamente`,
  //             'success'
  //           );
  //         }
  //       },
  //     });
  //   }, 200);
  // }

  abrirModal(moduloId: number) {
    this.moduloId = moduloId;
    this.mensajeEliminar = `¿Está seguro de eliminar el registro ${moduloId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaModulo() {
    this.modulosService.eliminaModulo(this.moduloId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Módulo eliminado correctamente', 'success');
          this.modulosResource.update((modulos) => {
            return modulos?.filter((modulo) => modulo.id !== this.moduloId);
          });
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar el módulo', 'error');
      },
    });
  }
}
