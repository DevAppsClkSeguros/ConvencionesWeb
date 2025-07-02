import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AppConfig } from '@shared/app-config';
import type { MicrosoftResponse } from '../interfaces/microsoftGraph.interface';
import type { Imagen } from '../interfaces/imagen.interface';
import { ImageMapper } from '../mapper/memorias-fotograficas.mapper';


@Injectable({ providedIn: 'root' })
export class MicrosoftGraphService {
  http = inject(HttpClient);

  trendingImagen = signal<Imagen[]>([]);
  trendingImagenLoading = signal(false);
  private trendingPage = signal(0);
  private nextLink: string | null = null;
  trendingImagenGroup = computed<Imagen[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.trendingImagen().length; i += 3) {
      groups.push(this.trendingImagen().slice(i, i + 3));
    }
    console.log('grupos: ', groups);
    return groups;
  });

  constructor() {
    this.loadTrendingGifs();
    console.log('Servicio creado');
  }

  archivosCarpetaOneDriveMS(idCarpeta: string) {
    return this.http
      .get(
        `${AppConfig.APIREST_MICROSOFT}b0666858-080f-443d-80b6-2fcb4eed0f9a/drive/items/01GH2CWJUGGJRHLBPKIVGYYLKTAJKLPYB7/children?$top=1000&$expand=thumbnails&$orderby=lastModifiedDateTime desc`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  /*******************
   * Curso
   ******************/

  loadTrendingGifs(): any {
    if (this.trendingImagenLoading()) return;
    this.trendingImagenLoading.set(true);

    const url = this.nextLink
      ? this.nextLink
      : `${AppConfig.APIREST_MICROSOFT}b0666858-080f-443d-80b6-2fcb4eed0f9a/drive/items/01GH2CWJUGGJRHLBPKIVGYYLKTAJKLPYB7/children?$top=25&$expand=thumbnails&$orderby=lastModifiedDateTime desc`;

    this.http
      .get<MicrosoftResponse>(
        // `${AppConfig.APIREST_MICROSOFT}b0666858-080f-443d-80b6-2fcb4eed0f9a/drive/items/01GH2CWJUGGJRHLBPKIVGYYLKTAJKLPYB7/children?$top=1000&$expand=thumbnails&$orderby=lastModifiedDateTime desc`,
        `${url}`
      )
      .subscribe((resp) => {
        const imagenes = ImageMapper.mapMicrosoftItemToImageArray(resp.value);
        this.trendingImagen.update((currentGifs) => [
          ...currentGifs,
          ...imagenes,
        ]);

        this.nextLink = resp['@odata.nextLink'] || null;

        this.trendingImagenLoading.set(false);
        // this.trendingPage.update((currenPage) => currenPage + 1);
      });
  }
}
