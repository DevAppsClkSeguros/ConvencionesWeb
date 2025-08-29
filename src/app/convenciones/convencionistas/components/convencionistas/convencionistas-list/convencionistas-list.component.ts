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
      return this.convencionistasService.GetConvencionistas().pipe(
        map((resp) => {
          const convencionistas = resp.response.map((convencionista) => ({
            ...convencionista,
            imagen: `${convencionista.imagen}?n=${Math.random()}`,
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

          // Debug: Log para verificar las convenciones disponibles
          console.log(
            'Convenciones disponibles:',
            data.response.map((c) => c.nombreEvento)
          );
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

  // Nuevo método específico para cambiar la convención del convencionista
  actualizaConvencionConvencionista(convencionista: Convencionista, nuevaConvencion: string) {
    // Crear una copia del convencionista con la nueva convención
    convencionista.url = convencionista.imagen;
    const convencionistaActualizado: Convencionista = {
      ...convencionista,
      nombreEvento: nuevaConvencion,
    };
    // Actualizar visualmente primero (optimistic update)
    this.convencionistaResource.update((convencionistas) => {
      if (!convencionistas) return convencionistas;
      return convencionistas.map((conv) =>
        conv.id === convencionista.id
          ? { ...conv, nombreEvento: nuevaConvencion }
          : conv
      );
    });
    console.log('convencionistaActualizado: ', convencionistaActualizado);
    // Llamar al servicio para persistir el cambio
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
            // Si falla, revertir el cambio visual
            this.convencionistaResource.update((convencionistas) => {
              if (!convencionistas) return convencionistas;
              return convencionistas.map((conv) =>
                conv.id === convencionista.id
                  ? { ...conv, nombreEvento: convencionista.nombreEvento }
                  : conv
              );
            });
            this.notificacion.show(
              `Error al actualizar la convención: ${
                data.message?.[0] || 'Error desconocido'
              }`,
              'error'
            );
          }
        },
        error: (e) => {
          // Si hay error, revertir el cambio visual
          this.convencionistaResource.update((convencionistas) => {
            if (!convencionistas) return convencionistas;
            return convencionistas.map((conv) =>
              conv.id === convencionista.id
                ? { ...conv, nombreEvento: convencionista.nombreEvento }
                : conv
            );
          });
          this.notificacion.show(
            'Ocurrio un error al actualizar la convención',
            'error'
          );
        },
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
