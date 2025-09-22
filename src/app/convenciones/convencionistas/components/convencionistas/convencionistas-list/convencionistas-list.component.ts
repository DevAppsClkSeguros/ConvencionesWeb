import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import type { Convencion } from 'src/app/convenciones/convenciones/interfaces/convenciones.interface';
import { ConvencionistasService } from '../../../services/convencionistas.service';
import { ConvencionesService } from 'src/app/convenciones/convenciones/services/convenciones.service';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import type { Convencionista } from '../../../interfaces/convencionistas.interface';
import { UploadFileModalComponent } from '@shared/components/upload-file-modal/upload-file-modal.component';
import { AppConfig } from '@shared/app-config';
import { PaginationComponent } from "@shared/pagination/pagination.component";

@Component({
  selector: 'convencionistas-list',
  imports: [
    SearchInputComponent,
    RouterLink,
    FormsModule,
    IconAddComponent,
    IconRefreshComponent,
    ConfirmModalComponent,
    UploadFileModalComponent,
    PaginationComponent,
  ],
  templateUrl: './convencionistas-list.component.html',
})
export class ConvencionistasListComponent implements OnInit {
  convencionistasService = inject(ConvencionistasService);
  eventosService = inject(ConvencionesService);
  notificacion = inject(NotificacionService);
  router = inject(Router);
  query = signal('');
  convencionSeleccionada = signal<string>('');
  mensajeEliminar = '';
  mostrarModal = signal(false);

  convenciones = signal<Convencion[]>([]);

  @ViewChild('deleteModal') deleteModal!: ConfirmModalComponent;
  convencionistaId: number = 0;

  ngOnInit(): void {
    this.getConvenciones();
  }

  convencionistaResource = rxResource({
    request: () => ({}), // sin dependencias reactivas
    loader: () => {
      return this.convencionistasService.obtieneConvencionistas().pipe(
        map((resp) => {
          const convencionistas = resp.response.map((convencionista) => ({
            ...convencionista,
            imagen: convencionista.imagen
              ? `${convencionista.imagen}`
              : `${AppConfig.SITE_CDN}ClickSegurosVip/Eventos/Convencionistas/clicky.png`,
          }));
          return convencionistas;
        }),
        catchError((error) => {
          this.notificacion.show(
            'Ocurrio un error al cargar lista de convencionistas.',
            'error'
          );
          return of([]);
        })
      );
    },
  });

  filteredConvencionistas = computed(() => {
    const listaConvenciones = this.convencionistaResource.value();
    const texto = this.query().toLowerCase().trim();
    const nombreConvencion = this.convencionSeleccionada().toLowerCase().trim();

    if (!listaConvenciones) return [];

    return listaConvenciones.filter((conv) => {
      const coincideTexto =
        !texto ||
        conv.clave.toLowerCase().includes(texto) ||
        conv.nombreCompleto.toLowerCase().includes(texto) ||
        conv.telefono.includes(texto) ||
        conv.puesto.toLowerCase().includes(texto);

      const coincideConvencion =
        !nombreConvencion ||
        conv.nombreEvento?.toLowerCase().trim() == nombreConvencion;
      return coincideTexto && coincideConvencion;
    });
  });

  getConvenciones() {
    this.eventosService.obtieneConvenciones().subscribe({
      next: (data) => {
        if (data.status) {
          this.convenciones.set(data.response);
        }
      },
      error: (e) => {
        this.notificacion.show(
          'Ocurrio un error al recuperar lista de convenciones',
          'error'
        );
      },
    });
  }

  refrescaDatos() {
    this.query.set('');
    this.convencionSeleccionada.set('');
    this.convencionistaResource.reload();
  }

  actualizaConvencionConvencionista(
    convencionista: Convencionista,
    nuevaConvencionId: number
  ) {
    const estadoAnterior = {
      eventoId: convencionista.eventoId,
      nombreEvento: convencionista.nombreEvento,
    };
    const nuevaConvencion = this.convenciones().find(
      (c) => c.id === Number(nuevaConvencionId)
    );
    if (!nuevaConvencion) return;

    const convencionistaActualizado: Convencionista = {
      ...convencionista,
      eventoId: nuevaConvencion.id,
      nombreEvento: nuevaConvencion.nombreEvento,
      url: convencionista.imagen,
    };

    this.convencionistaResource.update((convencionistas) => {
      if (!convencionistas) return convencionistas;
      return convencionistas.map((conv) =>
        conv.id === convencionista.id ? convencionistaActualizado : conv
      );
    });

    this.convencionistasService
      .actualizaConvencionista(convencionistaActualizado)
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.notificacion.show(
              `La convención de ${convencionista.nombreCompleto} ha sido actualizada correctamente`,
              'success'
            );
          } else {
            this.rollback(convencionista.id, estadoAnterior);
            this.notificacion.show(
              `Error al actualizar la convención: ${
                data.message?.[0] || 'Error desconocido'
              }`,
              'error'
            );
          }
        },
        error: () => {
          this.rollback(convencionista.id, estadoAnterior);
          this.notificacion.show(
            'Ocurrió un error al actualizar la convención',
            'error'
          );
        },
      });
  }

  private rollback(
    idConvencionista: number,
    estadoAnterior: { eventoId: number; nombreEvento: string }
  ) {
    this.convencionistaResource.update((convencionistas) => {
      if (!convencionistas) return convencionistas;
      return convencionistas.map((conv) =>
        conv.id === idConvencionista ? { ...conv, ...estadoAnterior } : conv
      );
    });
  }

  abrirModal(convencionId: number) {
    this.convencionistaId = convencionId;
    this.mensajeEliminar = `¿Está seguro de eliminar el registro ${convencionId}? Esta acción no se puede deshacer.`;
    this.deleteModal.show();
  }

  eliminaConvencionista() {
    this.convencionistasService
      .eliminaConvencionista(this.convencionistaId)
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.notificacion.show(
              'Convencionista eliminado correctamente',
              'success'
            );
            this.convencionistaResource.update((convencionistas) => {
              return convencionistas?.filter(
                (convencionista) => convencionista.id !== this.convencionistaId
              );
            });
          } else {
            this.notificacion.show(
              `${data.message?.[0] || 'Error desconocido'}`,
              'error'
            );
          }
        },
        error: (e) => {
          this.notificacion.show(
            'Error al eliminar la convencionista',
            'error'
          );
        },
      });
  }

  abrirModalArchivos() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  enviarArchivosAlBackend(archivos: File[]) {
    const formData = new FormData();
    archivos.forEach((file) => formData.append('archivos', file));

    // // Aquí va tu API de carga
    // this.http.post('/api/tu-endpoint', formData).subscribe({
    //   next: () => alert('Archivos cargados chingón'),
    //   error: () => alert('Falló la carga, wey'),
    // });
  }
}
