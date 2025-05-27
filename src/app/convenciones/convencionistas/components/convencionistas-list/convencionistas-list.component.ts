import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { Convencion } from 'src/app/convenciones/evento/interfaces/evento.interface';
import { ConvencionistasService } from '../../services/convencionistas.service';
import { EventosService } from 'src/app/convenciones/evento/services/eventos.service';
import { NotificacionService } from '@shared/services/notificacion.service';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';

@Component({
  selector: 'convencionistas-list',
  imports: [SearchInputComponent, RouterLink, FormsModule],
  templateUrl: './convencionistas-list.component.html',
})
export class ConvencionistasListComponent implements OnInit {
  convencionistasService = inject(ConvencionistasService);
  eventosService = inject(EventosService);
  notificacion = inject(NotificacionService);
  router = inject(Router);
  query = signal('');
  convencionSeleccionada = signal<string>('');

  convenciones = signal<Convencion[]>([]);

  // convencionistaResource = rxResource({
  //   request: () => ({ query: this.query() }),
  //   loader: ({ request }) => {
  //     return this.convencionistasService
  //       .GetConvencionistas()
  //       .pipe(map((resp) => resp.response));
  //   },
  // });

  ngOnInit(): void {
    this.cargaConvenciones();
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

  // 🧠 Aquí sí usas query para filtrar localmente
  // filteredConvencionistas = computed(() => {
  //   const lista = this.convencionistaResource.value(); // <- aquí está el pedo
  //   const texto = this.query().toLowerCase().trim();

  //   if (!lista) return [];
  //   if (!texto) return lista;

  //   return lista.filter(
  //     (conv) =>
  //       conv.clave.toLocaleLowerCase().includes(texto) ||
  //       conv.nombreCompleto.toLowerCase().includes(texto) ||
  //       conv.telefono.includes(texto) ||
  //       conv.puesto.toLocaleLowerCase().includes(texto)
  //   );
  // });
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

  cargaConvenciones() {
    this.eventosService.getEventos().subscribe({
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

  eliminarConvencionista(id: number) {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.'
    );
    if (confirmed) {
      this.convencionistasService.eliminarConvencionista(id).subscribe({
        next: (data) => {
          if (data.status) {
            this.convencionistaResource.reload();
          }
        },
      });
    }
  }
}
