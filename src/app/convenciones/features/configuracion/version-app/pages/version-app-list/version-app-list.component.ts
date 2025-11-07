import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconRefreshComponent } from '@shared/icons/icon-refresh/icon-refresh.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { NotificacionService } from '@shared/services/notificacion.service';
import { VersionAppService } from '../../services/version-app.service';

@Component({
  selector: 'app-version-app-list',
  imports: [
    RouterLink,
    IconRefreshComponent,
  ],
  templateUrl: './version-app-list.component.html',
})
export class VersionAppListComponent {
  versionAppService = inject(VersionAppService);
  notificacion = inject(NotificacionService);

  versionesResource = rxResource({
    request: () => ({}),
    loader: () => {
      return this.versionAppService.obtieneVersiones().pipe(
        map((resp) => resp.response),
        catchError((error) => {
          this.notificacion.show(
            'Ocurrio un error al cargar lista de versiones.',
            'error'
          );
          return of([]);
        })
      );
    },
  });

  refrescaDatos() {
    console.log("Refrescando...")
    this.versionesResource.reload();
  }
}
