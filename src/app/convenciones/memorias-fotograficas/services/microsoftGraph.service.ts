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
        `${AppConfig.APIREST_MICROSOFT}b0666858-080f-443d-80b6-2fcb4eed0f9a/drive/items/01GH2CWJUGGJRHLBPKIVGYYLKTAJKLPYB7/children?$top=1000&$expand=thumbnails&$orderby=lastModifiedDateTime desc`,
        {
          headers: {
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6Ik5tWHhFRzZRRUw3UGNpSkFLYTFITm1SY1Z0eGVSWm5hOHVqUktuakFPTjgiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82ODk0Mzk2YS1kYjJiLTQyYTgtYmY3My00MTNiN2EwMGJhY2EvIiwiaWF0IjoxNzQ5NTg4NjI3LCJuYmYiOjE3NDk1ODg2MjcsImV4cCI6MTc0OTU5MjUyNywiYWlvIjoiazJSZ1lQaXN6UFIrSzM5Zjh2SDlXWWtpNGpibEFBPT0iLCJhcHBfZGlzcGxheW5hbWUiOiJUZXN0QXV0aE1TIiwiYXBwaWQiOiI1MzQ3ZjExMC0yMjAxLTQ4YzQtYWYwMi05MzcwYmNmYTk0YTQiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82ODk0Mzk2YS1kYjJiLTQyYTgtYmY3My00MTNiN2EwMGJhY2EvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiJjMjQxNzkzMC1hNzg0LTQ4YzAtYWZmZS0wYzIzYTkyOTAyNTciLCJyaCI6IjEuQVNnQWFqbVVhQ3ZicUVLX2MwRTdlZ0M2eWdNQUFBQUFBQUFBd0FBQUFBQUFBQURaQUFBb0FBLiIsInJvbGVzIjpbIlVzZXItTWFpbC5SZWFkV3JpdGUuQWxsIiwiU2l0ZXMuUmVhZC5BbGwiLCJTaXRlcy5SZWFkV3JpdGUuQWxsIiwiRmlsZXMuUmVhZFdyaXRlLkFsbCIsIlVzZXIuUmVhZC5BbGwiLCJGaWxlcy5SZWFkLkFsbCJdLCJzdWIiOiJjMjQxNzkzMC1hNzg0LTQ4YzAtYWZmZS0wYzIzYTkyOTAyNTciLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiTkEiLCJ0aWQiOiI2ODk0Mzk2YS1kYjJiLTQyYTgtYmY3My00MTNiN2EwMGJhY2EiLCJ1dGkiOiI5ZEtNSW44LUFVbVZlaGlmZ3YzN0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyIwOTk3YTFkMC0wZDFkLTRhY2ItYjQwOC1kNWNhNzMxMjFlOTAiXSwieG1zX2Z0ZCI6IlhxSnp4V1BzOGplc21IRlZXeVFjYVZVT1lORXdic0hvcl9jaUtSZ2lVMU1CZFhOemIzVjBhQzFrYzIxeiIsInhtc19pZHJlbCI6IjcgMjIiLCJ4bXNfcmQiOiIwLjQyTGxZQkppMUJBUzRXQVhFcmpvcmRtNVAzYVgtOHpuYmlhUGpqaGVCWXB5Q2dtOGVaQi16ZlhGY29lSlZ3LTVNc3pjbmdzVTVSQVNZR2FBZ0FOUUdnQSIsInhtc190Y2R0IjoxNTAyNDAxNTk2fQ.QAQA2uSXFR0vZ0wcPG008kikQ6OS5BscAv1iUtUdrJO3kij2TqlxcKJhU4mTjCmfkuOxBn_9-HMYo-vt1drJX7r4We0Yo42XAJ7AOvpMRJ4ZjHtYUiNvrNiuG_qmB89s1Mgasu_xj7cZDMfXbYPqPgAJhBEn_ldnP0YOxSq_-G96uz4LvqZRVmmqJ9ItdHCjjPU1BooHabm1nqtwQiXtAixhz2uI2OfMHtFq3IcBX-daambIumHkntbHGzFj4s6agQdMnH4fq2Fh6gtua2T1ZW-u2spctyK5sBV4EeT_Lw82ZCnC0eVnkrJkMG25PHxcLG6kxy9U0mDPXzguNs6QfQ`,
          },
        }
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
        `${url}`,
        {
          headers: {
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6ImFadU44M0FCMW5pRWxWUVVQWEllRzN6R2VnejRabzg5TEtMaGl5ckVxd3MiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82ODk0Mzk2YS1kYjJiLTQyYTgtYmY3My00MTNiN2EwMGJhY2EvIiwiaWF0IjoxNzQ5NjU3ODgyLCJuYmYiOjE3NDk2NTc4ODIsImV4cCI6MTc0OTY2MTc4MiwiYWlvIjoiazJSZ1lEaGk2dXo1MXRucGVOS0NoUVYyWlhiNUFBPT0iLCJhcHBfZGlzcGxheW5hbWUiOiJUZXN0QXV0aE1TIiwiYXBwaWQiOiI1MzQ3ZjExMC0yMjAxLTQ4YzQtYWYwMi05MzcwYmNmYTk0YTQiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82ODk0Mzk2YS1kYjJiLTQyYTgtYmY3My00MTNiN2EwMGJhY2EvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiJjMjQxNzkzMC1hNzg0LTQ4YzAtYWZmZS0wYzIzYTkyOTAyNTciLCJyaCI6IjEuQVNnQWFqbVVhQ3ZicUVLX2MwRTdlZ0M2eWdNQUFBQUFBQUFBd0FBQUFBQUFBQURaQUFBb0FBLiIsInJvbGVzIjpbIlVzZXItTWFpbC5SZWFkV3JpdGUuQWxsIiwiU2l0ZXMuUmVhZC5BbGwiLCJTaXRlcy5SZWFkV3JpdGUuQWxsIiwiRmlsZXMuUmVhZFdyaXRlLkFsbCIsIlVzZXIuUmVhZC5BbGwiLCJGaWxlcy5SZWFkLkFsbCJdLCJzdWIiOiJjMjQxNzkzMC1hNzg0LTQ4YzAtYWZmZS0wYzIzYTkyOTAyNTciLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiTkEiLCJ0aWQiOiI2ODk0Mzk2YS1kYjJiLTQyYTgtYmY3My00MTNiN2EwMGJhY2EiLCJ1dGkiOiJqZ3NLWXc0OTNFSzRpcm9CWVBrVEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyIwOTk3YTFkMC0wZDFkLTRhY2ItYjQwOC1kNWNhNzMxMjFlOTAiXSwieG1zX2Z0ZCI6IkZJcUNrV1N3ZVdJazVoMmlqZEdWYkh4MjJCM1ByWm92d0FVbTd6MnNjY1FCZFhOM1pYTjBNeTFrYzIxeiIsInhtc19pZHJlbCI6IjcgMTAiLCJ4bXNfcmQiOiIwLjQyTGxZQkppMUJBUzRXQVhFcmpvcmRtNVAzYVgtOHpuYmlhUGpqaGVCWXB5Q2dtOGVaQi16ZlhGY29lSlZ3LTVNc3pjbmdzVTVSQVNZR2FBZ0FOUUdnQSIsInhtc190Y2R0IjoxNTAyNDAxNTk2fQ.XykVjifowkBba8lpKyTtleiFoLLjvoDtk2Guns9-2s-VzQ_Cer35jCi5c7mkmMWz97cCx1YwBuZR4ACcP6QF66CJDq-mcj39Wi05QTZEl2aONuBSxOgjfXsYqtbTyMyDmLjy830eDFdoLpyZqE7tvtQyMWljdHAxttdO1tsNEAy16HD6mhoDMN13fI6cS3X0PL3zoaK_dqgHtBxGgaHDW0yeeKFqBn5_jH9yFGupFNL7hfiikx92-xaSzOe0RmeG7TKfyou7Km3aRV-1-TZ_oo6ZSGej2rQqhNWwzYhj3Mrg3mGOem4Ag_HuuwG6fyiraesmZvnRIfVNDyF-nwNmMQ`,
          },
        }
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
