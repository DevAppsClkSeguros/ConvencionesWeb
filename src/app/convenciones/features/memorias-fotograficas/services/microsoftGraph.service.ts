import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, firstValueFrom } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { ImageMapper } from '../mapper/memorias-fotograficas.mapper';
import type { Imagen } from '../interfaces/imagen.interface';
import type { MicrosoftResponse } from '../interfaces/microsoftGraph.interface';

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

  /*******************
   * CARGA DE MULTIMEDIA
   ******************/
  private getGraphBase(userId?: string): string {
    if (userId) {
      return `${AppConfig.APIREST_MICROSOFT}${userId}`;
    }
    // Supongo que AppConfig.APIREST_MICROSOFT incluye el prefijo adecuado "https://graph.microsoft.com/v1.0/users/"
    return `${AppConfig.APIREST_MICROSOFT}me`;
  }

  /**
   * Subir archivo pequeño (< ~4 MB) usando PUT directo.
   * @param token Bearer token ya obtenido
   * @param file Archivo a subir
   * @param destPath Ruta remota en OneDrive/Drive: ej "Apps/mi-app/uploads/archivo.jpg"
   * @param userId Opcional si subes a otro usuario distinto a “me”
   */
  async uploadSmallFile(
    token: string,
    file: File,
    destPath: string
  ): Promise<any> {
    const url = `${
      AppConfig.APIREST_MICROSOFT
    }b0666858-080f-443d-80b6-2fcb4eed0f9a/drive/root:/${encodeURI(
      destPath
    )}:/content`;
    const headers = new HttpHeaders({
      // Authorization: `Bearer ${token}`,
      'Content-Type': file.type || 'application/octet-stream',
    });

    const result = await firstValueFrom(
      this.http.put(url, file, {
        headers,
        responseType: 'json',
      })
    );
    return result;
  }

  /**
   * Crear una sesión de subida (upload session) para subir archivos grandes.
   * @param token Bearer token
   * @param fileName Nombre del archivo (incluye extensión)
   * @param parentPath Ruta de carpeta remota donde guardarlo (ej: "Apps/mi-app/uploads")
   * @param userId Opcional
   */
  async createUploadSession(
    token: string,
    fileName: string,
    parentPath: string,
    userId?: string
  ): Promise<{ uploadUrl: string }> {
    const encodedPath = encodeURI(`${parentPath}/${fileName}`);
    const url = `${AppConfig.APIREST_MICROSOFT}b0666858-080f-443d-80b6-2fcb4eed0f9a/drive/root:/${encodedPath}:/createUploadSession`;
    const headers = new HttpHeaders({
      // Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const body = {
      item: {
        '@microsoft.graph.conflictBehavior': 'replace',
        name: fileName,
      },
    };
    const resp: any = await firstValueFrom(
      this.http.post(url, body, { headers })
    );
    return { uploadUrl: resp.uploadUrl };
  }

  /**
   * Subir archivo grande usando uploadUrl obtenido.
   * @param uploadUrl URL devuelta por createUploadSession
   * @param file Archivo a subir
   * @param chunkSizeBytes Tamaño del bloque por fragmento
   */
  async uploadLargeFileWithSession(
    uploadUrl: string,
    file: File,
    onProgress?: (progress: number) => void,
    chunkSizeBytes = 5 * 1024 * 1024
  ): Promise<any> {
    const block = 327680; // 320 KiB
    if (chunkSizeBytes % block !== 0) {
      chunkSizeBytes = Math.ceil(chunkSizeBytes / block) * block;
    }

    const fileSize = file.size;
    let start = 0;
    let end = Math.min(start + chunkSizeBytes, fileSize) - 1;
    let uploadedBytes = 0;

    while (start <= fileSize - 1) {
      const blob = file.slice(start, end + 1);
      const contentRange = `bytes ${start}-${end}/${fileSize}`;

      const resp = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Length': `${blob.size}`,
          'Content-Range': contentRange,
        },
        body: blob,
      });

      if (resp.status === 202) {
        // Chunk aceptado parcialmente (sigue subiendo)
        uploadedBytes = end + 1;
        const progress = Math.min(
          Math.round((uploadedBytes / fileSize) * 100),
          100
        );
        if (onProgress) onProgress(progress);

        // Opcional: podrías leer nextExpectedRanges del JSON
        // const json = await resp.json();
      } else if (resp.status === 201 || resp.status === 200) {
        // Upload completo
        if (onProgress) onProgress(100);
        const completed = await resp.json();
        return completed;
      } else {
        const text = await resp.text();
        throw new Error(`Upload fragment failed: ${resp.status} ${text}`);
      }

      start = end + 1;
      end = Math.min(start + chunkSizeBytes, fileSize) - 1;
    }

    return null;
  }

  /**
   * Método de alto nivel: subir múltiples archivos.
   * @param token Bearer token
   * @param files Array de File
   * @param remoteFolderPath Carpeta remota (ej: "Apps/convenciones/memorias")
   * @param userId Opcional
   */
  async uploadFiles(
    token: string,
    files: File[],
    remoteFolderPath = 'Apps/convenciones/memorias',
    userId?: string
  ): Promise<{ file: string; result?: any; error?: string }[]> {
    const results: { file: string; result?: any; error?: string }[] = [];

    for (const file of files) {
      try {
        if (file.size <= 4 * 1024 * 1024) {
          const dest = `${remoteFolderPath}/${file.name}`;
          const res = await this.uploadSmallFile(token, file, dest);
          results.push({ file: file.name, result: res });
        } else {
          const session = await this.createUploadSession(
            token,
            file.name,
            remoteFolderPath,
            userId
          );
          const completed = await this.uploadLargeFileWithSession(
            session.uploadUrl,
            file
          );
          results.push({ file: file.name, result: completed });
        }
      } catch (err) {
        results.push({ file: file.name, error: (err as Error).message });
      }
    }
    return results;
  }
}
