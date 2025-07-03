import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfig } from '../app-config';
import { catchError, Observable } from 'rxjs';
import type { CDNResponse } from '../interfaces/cdn.interface';

@Injectable({ providedIn: 'root' })
export class CdnService {
  http = inject(HttpClient);

  uploadFile(modulo: string, nombreArchivo: string, file: File): Observable<CDNResponse> {
    console.log('mi file: ', file)
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('modulo', modulo);
    formData.append('nombreArchivo', nombreArchivo);
    return this.http
      .post<CDNResponse>(
        `${AppConfig.APIREST_URL}/api/archivos/subir`,
        formData
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  // async setCdnArchivos(idBit: any, tipo: any, files: any): Promise<boolean> {
  //   const resp = await new Promise<boolean>((resolve, reject) => {
  //     const form = new HTTPFormData();
  //     form.append('IDEntity', String(idBit));
  //     form.append('TypeEntity', String(tipo));
  //     files.forEach((e, i) => {
  //       form.append(`file${i}`, e);
  //     });
  //     request({
  //       url:
  //         ConfiguraAPI.APIREST_URL_CD_NUEVA +
  //         'APICDN_Storage/api/cdn_storage/uploadFiles',
  //       method: 'POST',
  //       content: form,
  //       ,
  //     })
  //       .then((response: HttpResponse) => {
  //         if (response.statusCode === 200) {
  //           resolve(true);
  //         } else {
  //           reject(false);
  //         }
  //       })
  //       .catch((e) => {
  //         reject(false);
  //       });
  //   });
  //   return resp;
  // }
}
