import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AppConfig } from '@shared/app-config';
import type { MicrosoftResponse } from '../interfaces/microsoftGraph.interface';
import type { Imagen } from '../interfaces/imagen.interface';
import { ImageMapper } from '../mapper/memorias-fotograficas.mapper';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MicrosoftGraphService {
  http = inject(HttpClient);

  trendingImagen = signal<Imagen[]>([]);
  trendingImagenLoading = signal(false);
  private trendingPage = signal(0);
  private nextLink: string | null = null;
  private usedNextLinks = new Set<string>();
  trendingImagenGroup = computed<Imagen[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.trendingImagen().length; i += 3) {
      groups.push(this.trendingImagen().slice(i, i + 3));
    }
    return groups;
  });

  constructor() {
    // this.loadTrendingGifs();
  }

  archivosUnidadOneDriveMS(): Observable<MicrosoftResponse> {
    return this.http
      .get<MicrosoftResponse>(
        `${AppConfig.APIREST_MICROSOFT}b0666858-080f-443d-80b6-2fcb4eed0f9a/drive/root/children`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  archivosCarpetaOneDriveMS(idCarpeta: string): Observable<MicrosoftResponse> {
    return this.http
      .get<MicrosoftResponse>(
        `${AppConfig.APIREST_MICROSOFT}b0666858-080f-443d-80b6-2fcb4eed0f9a/drive/items/${idCarpeta}/children?$top=1000&$expand=thumbnails&$orderby=lastModifiedDateTime desc`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  archivosCarpetaScroll(url: string): Observable<MicrosoftResponse> {
    return this.http
      .get<MicrosoftResponse>(url)
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
      : `${AppConfig.APIREST_MICROSOFT}b0666858-080f-443d-80b6-2fcb4eed0f9a/drive/items/01GH2CWJQXC7FNT7ETSVGI7CPPO5NHI4WE/children?$top=105&$expand=thumbnails&$orderby=lastModifiedDateTime desc`;
    if (this.usedNextLinks.has(url)) {
      this.trendingImagenLoading.set(false);
      return;
    }
    this.usedNextLinks.add(url);
    this.http.get<MicrosoftResponse>(`${url}`).subscribe((resp) => {
      const imagenes = ImageMapper.mapMicrosoftItemToImageArray(resp.value);
      this.trendingImagen.update((currentGifs) => [
        ...currentGifs,
        ...imagenes,
      ]);
      this.nextLink = resp['@odata.nextLink'] || null;
      this.trendingImagenLoading.set(false);
    });
  }
}
