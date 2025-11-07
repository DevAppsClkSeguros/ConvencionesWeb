import { Component, inject, ViewChild } from '@angular/core';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotificacionService } from '@shared/services/notificacion.service';
import { map } from 'rxjs';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-roles-list',
  imports: [
    IconAddComponent,
    IconRefreshComponent,
    ConfirmModalComponent,
    RouterLink,
  ],
  templateUrl: './roles-list.component.html',
})
export class RolesListComponent {
  rolesService = inject(RolesService);
  notificacion = inject(NotificacionService);
  mensajeEliminar = '';
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  rolId: string = "";

  rolesResource = rxResource({
    loader: () => {
      return this.rolesService
        .obtieneRoles()
        .pipe(map((resp) => resp.response));
    },
  });

  refrescaDatos() {
    this.rolesResource.reload();
  }

  abrirModal(rolId: string) {
    this.rolId = rolId;
    this.mensajeEliminar = `¿Está seguro de eliminar el rol ${rolId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaRol() {
    this.rolesService.eliminaRol(this.rolId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show('Rol eliminado correctamente', 'success');
          this.rolesResource.update((roles) => {
            return roles?.filter((rol) => rol.id !== this.rolId);
          });
        } else {
          this.notificacion.show(
            `${data.message?.[0] || 'Error desconocido'}`,
            'error'
          );
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar el rol', 'error');
      },
    });
  }
}
