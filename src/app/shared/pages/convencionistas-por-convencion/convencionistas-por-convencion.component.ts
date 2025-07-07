import { Component, effect, inject, input, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { Convencionista } from 'src/app/convenciones/convencionistas/interfaces/convencionistas.interface';
import { ConvencionistasService } from 'src/app/convenciones/convencionistas/services/convencionistas.service';

@Component({
  selector: 'shared-convencionistas-por-convencion',
  imports: [],
  templateUrl: './convencionistas-por-convencion.component.html',
})
export class ConvencionistasPorConvencionComponent {
  convencionistasService = inject(ConvencionistasService);
  convencionId = input.required<number>();
  convencionistasPorVuelo = input<number[]>();
  convencionistasSeleccionados2 = output<number[]>();
  seleccionados: number[] = [];

  convencionistasResource = rxResource({
    loader: ({}) => {
      const id = this.convencionId();
      if (!id) {
        console.warn('Convencion ID no proporcionado');
        return of([]);
      }
      return this.convencionistasService
        .obtieneConvencionistasPorConvencion(Number(this.convencionId()))
        .pipe(
          map((resp) => {
            const agregados = this.convencionistasPorVuelo() || [];
            return resp.response.map((convencionista) => ({
              ...convencionista,
              seleccionado: agregados.includes(convencionista.id)
                ? true
                : false,
            }));
          })
        );
    },
  });

  constructor() {
    effect(() => {
      const id = this.convencionId();
      console.log('Id de la convencion recibida en el hijo: ', id);
      this.convencionistasResource!.reload();
    });
  }

  seleccionaConvencionista(convencionista: Convencionista) {
    console.log('Seleccionando desde hijo: ', convencionista);
    convencionista.seleccionado = !convencionista.seleccionado;
    this.seleccionados = [];
    this.convencionistasResource!.value()?.forEach((c) => {
      if (c.seleccionado) {
        this.seleccionados.push(c.id);
      }
    });
    this.convencionistasSeleccionados2.emit(this.seleccionados);
  }

  seleccionaTodos(check: any): void {
    this.seleccionados = [];
    this.convencionistasResource!.value()?.forEach((convencionista) => {
      convencionista.seleccionado = check;
      if (convencionista.seleccionado) {
        this.seleccionados.push(convencionista.id);
      }
    });
    this.convencionistasSeleccionados2.emit(this.seleccionados);
  }
}
