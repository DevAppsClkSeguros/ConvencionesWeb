import { Component, inject, ViewChild } from '@angular/core';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { NotificacionService } from '@shared/services/notificacion.service';
import { map } from 'rxjs';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-categorias-list',
  imports: [
    IconAddComponent,
    IconRefreshComponent,
    ConfirmModalComponent,
    RouterLink,
  ],
  templateUrl: './categorias-list.component.html',
})
export class CategoriasListComponent {
  categoriasService = inject(CategoriasService);
  notificacion = inject(NotificacionService);
  mensajeEliminar = '';
  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  categoriaId: number = 0;

  categoriasResource = rxResource({
    loader: () => {
      return this.categoriasService
        .obtieneCategorias()
        .pipe(map((resp) => resp.response));
    },
  });

  refrescaDatos() {
    this.categoriasResource.reload();
  }

  abrirModal(categoriaId: number) {
    this.categoriaId = categoriaId;
    this.mensajeEliminar = `¿Está seguro de eliminar la categoría ${categoriaId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaCategoria() {
    this.categoriasService.eliminaCategoria(this.categoriaId).subscribe({
      next: (data) => {
        if (data.status) {
          this.notificacion.show(
            'Categoría eliminada correctamente',
            'success'
          );
          this.categoriasResource.update((hoteles) => {
            return hoteles?.filter((hotel) => hotel.id !== this.categoriaId);
          });
        }
      },
      error: (e) => {
        this.notificacion.show('Error al eliminar la categoría', 'error');
      },
    });
  }
}
