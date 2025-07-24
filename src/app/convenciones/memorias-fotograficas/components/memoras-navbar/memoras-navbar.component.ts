import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
  eventosService = inject(ConvencionesService);

  convencionesResource = rxResource({
    loader: ({}) => {
      return this.eventosService
        .obtieneConvenciones()
        .pipe(map((resp) => resp.response));
    },
  });

  multimedia(convencion: string) {
   this.router.navigate([`/memorias-fotograficas/fotos/${convencion}`]);
}
}
