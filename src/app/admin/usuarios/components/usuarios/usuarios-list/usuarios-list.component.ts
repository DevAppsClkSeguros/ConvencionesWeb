import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-usuarios-list',
  imports: [IconRefreshComponent, IconAddComponent, RouterLink],
  templateUrl: './usuarios-list.component.html',
})

export class UsuariosListComponent {
  usuariosService = inject(UsuariosService);
  notificacion = inject(NotificacionService);
  mensajeEliminar = '';

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  convencionId: number = 0;

  usuariosResource = rxResource({
    request: () => ({}),
    loader: () => {
      return this.usuariosService.obtieneUsuarios().pipe(
        map((resp) => resp.response),
        catchError((error) => {
          this.notificacion.show(
            'Ocurrio un error al cargar la lista de usuarios.',
            'error'
          );
          return of([]);
        })
      );
    },
  });

  refrescaDatos() {
    this.usuariosResource.reload();
  }

  abrirModal(convencionId: number) {
    this.convencionId = convencionId;
    this.mensajeEliminar = `¿Está seguro de eliminar el registro ${convencionId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }
}
