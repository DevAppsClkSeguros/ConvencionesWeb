import { Component, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { ConvencionesService } from 'src/app/convenciones/convenciones/services/convenciones.service';
import { NotificacionService } from '@shared/services/notificacion.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'memoras-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './memoras-navbar.component.html',
})
export class MemorasNavbarComponent {
  notificacion = inject(NotificacionService);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  eventosService = inject(ConvencionesService);
  convencionSeleccionada = signal<string | null>(null);

  convencionesResource = rxResource({
    loader: ({}) => {
      return this.eventosService
        .obtieneConvenciones()
        .pipe(map((resp) => resp.response));
    },
  });

  constructor() {
    const convencionParam = this.route.snapshot.queryParamMap.get('convencion');
    if (convencionParam) {
      this.convencionSeleccionada.set(convencionParam);
    }
  }

  multimedia(tipoMedia: 'Imagenes' | 'Videos') {
    const convencion = this.convencionSeleccionada();
    if (!convencion) return;
    this.router.navigate([`/memorias-fotograficas/${tipoMedia}/${convencion}`]);
  }

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.convencionSeleccionada.set(value);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        tipo: this.route.snapshot.queryParams['tipo']
          ? this.route.snapshot.queryParams['tipo']
          : 'imagenes',
        convencion: value,
      },
      queryParamsHandling: 'merge',
    });
  }
}
