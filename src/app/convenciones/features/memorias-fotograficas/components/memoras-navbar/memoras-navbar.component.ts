import { Component, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ConvencionesService } from '@convenciones/features/convenciones/services/convenciones.service';
import { NotificacionService } from '@shared/services/notificacion.service';
import { UploadFileModalComponent } from '@shared/components/upload-file-modal/upload-file-modal.component';

@Component({
  selector: 'memoras-navbar',
  imports: [RouterLink, RouterLinkActive, UploadFileModalComponent],
  templateUrl: './memoras-navbar.component.html',
})
export class MemorasNavbarComponent {
  notificacion = inject(NotificacionService);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  eventosService = inject(ConvencionesService);
  convencionSeleccionada = signal<string | null>(null);
  mostrarModal = signal(false);

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

  abrirModalArchivos() {
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
  }

  enviarArchivosAlBackend(archivos: File[]) {
    const formData = new FormData();
    archivos.forEach((file) => formData.append('archivos', file));
  }
}
