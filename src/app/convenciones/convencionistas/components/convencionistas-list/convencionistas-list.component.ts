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
import { ConvencionistasService } from '../../services/convencionistas.service';
import { ConvencionesService } from 'src/app/convenciones/convenciones/services/convenciones.service';
import { IconAddComponent } from '@shared/icons/icon-add/icon-add.component';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { NotificacionService } from '@shared/services/notificacion.service';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { ConfirmModalComponent } from '@shared/components/confirm-modal/confirm-modal.component';
import type { Convencionista } from '../../interfaces/convencionistas.interface';

@Component({
  selector: 'convencionistas-list',
  imports: [
    SearchInputComponent,
    RouterLink,
    FormsModule,
    IconAddComponent,
    IconRefreshComponent,
    ConfirmModalComponent,
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
        map((resp) => resp.response),
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

  actualizaConvencionista(convencionista: Convencionista, Convencion: any) {
    setTimeout(() => {
      console.log('Valor de la convencion seleccionada: ', convencionista);
      convencionista.eventoId = 1012;
      console.log('Valor de la convencion modificada: ', convencionista);
      this.convencionistasService
        .actualizaConvencionista(convencionista)
        .subscribe({
          next: (data) => {
            if (data.status) {
              this.notificacion.show(
                `El convencionista ${convencionista.nombreCompleto} ha sido actualizado correctamente`,
                'success'
              );
            }
          },
        });
    }, 200);
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
}
