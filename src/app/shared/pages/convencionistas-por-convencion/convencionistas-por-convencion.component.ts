import { Component, computed, effect, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Convencionista } from 'src/app/convenciones/convencionistas/interfaces/convencionistas.interface';
import { ConvencionistasService } from 'src/app/convenciones/convencionistas/services/convencionistas.service';

@Component({
  selector: 'shared-convencionistas-por-convencion',
  imports: [],
  templateUrl: './convencionistas-por-convencion.component.html',
})
export class ConvencionistasPorConvencionComponent {
  convencionistaSeleccionado: Convencionista | null = null;
  convencionistasSeleccionados: number[] = [];
  convencionistasService = inject(ConvencionistasService);

  convencionId = input.required<number | null>();
  convencionistas = output<number[]>();


  convencionistasResource = rxResource({
    loader: ({}) => {
      return this.convencionistasService
        .GetConvencionistas()
        .pipe(map((resp) => resp.response));
    },
  });

  constructor() {
    effect(() => {
      const id = this.convencionId();
      console.log('Recargando desde hijo: ', id);
      this.convencionistasResource.reload();
    })
  }

  get todosSeleccionados(): boolean {
    const total = this.convencionistasResource.value()?.length || 0;
    return this.convencionistasSeleccionados.length === total && total > 0;
  }

  estaSeleccionado(id: number): boolean {
    return this.convencionistasSeleccionados.includes(id);
  }

  toggleSeleccion(id: number): void {
    if (this.estaSeleccionado(id)) {
      this.convencionistasSeleccionados =
        this.convencionistasSeleccionados.filter((x) => x !== id);
    } else {
      this.convencionistasSeleccionados.push(id);
    }
  }

  toggleTodos(): void {
    const todos = this.convencionistasResource.value()?.map((c) => c.id) || [];
    if (this.todosSeleccionados) {
      this.convencionistasSeleccionados = [];
    } else {
      this.convencionistasSeleccionados = [...todos];
    }
  }
}
