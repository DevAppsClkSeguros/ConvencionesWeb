import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ConvencionistasService } from '../../services/convencionistas.service';
import {
  ConvencionistasResponse,
  Convencionista,
} from '../../interfaces/convencionistas.interface';

@Component({
  selector: 'convencionistas-list',
  imports: [SearchInputComponent, RouterLink],
  templateUrl: './convencionistas-list.component.html',
})
export class ConvencionistasListComponent {
  convencionistasService = inject(ConvencionistasService);
  router = inject(Router);
  query = signal('');

  // convencionistaResource = rxResource({
  //   request: () => ({ query: this.query() }),
  //   loader: ({ request }) => {
  //     return this.convencionistasService
  //       .GetConvencionistas()
  //       .pipe(map((resp) => resp.response));
  //   },
  // });

  convencionistaResource = rxResource({
    request: () => ({}), // sin dependencias reactivas
    loader: () => {
      return this.convencionistasService
        .GetConvencionistas()
        .pipe(map((resp) => resp.response));
    },
  });

  // 🧠 Aquí sí usas query para filtrar localmente
  filteredConvencionistas = computed(() => {
    const lista = this.convencionistaResource.value(); // <- aquí está el pedo
    const texto = this.query().toLowerCase().trim();

    if (!lista) return [];
    if (!texto) return lista;

    return lista.filter((conv) =>
      conv.clave.toLocaleLowerCase().includes(texto) ||
      conv.nombreCompleto.toLowerCase().includes(texto) ||
    conv.telefono.includes(texto) ||
    conv.puesto.toLocaleLowerCase().includes(texto)
    );
  });

  refrescaDatos() {
    this.query.set('');
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
