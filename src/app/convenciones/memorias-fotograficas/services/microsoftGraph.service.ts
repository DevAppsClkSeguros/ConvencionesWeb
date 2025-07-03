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
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6InB2WVRHcVE3Z2VPSmN5X1JvQ0tZNEJhNTI0SkxIQktEUmxsTDdCMUYyUGciLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82ODk0Mzk2YS1kYjJiLTQyYTgtYmY3My00MTNiN2EwMGJhY2EvIiwiaWF0IjoxNzQ5NjgzOTEwLCJuYmYiOjE3NDk2ODM5MTAsImV4cCI6MTc0OTY4NzgxMCwiYWlvIjoiazJSZ1lOaDliZk1hOVEyYU41eDg1M3RwbkN1SUJBQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJUZXN0QXV0aE1TIiwiYXBwaWQiOiI1MzQ3ZjExMC0yMjAxLTQ4YzQtYWYwMi05MzcwYmNmYTk0YTQiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82ODk0Mzk2YS1kYjJiLTQyYTgtYmY3My00MTNiN2EwMGJhY2EvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiJjMjQxNzkzMC1hNzg0LTQ4YzAtYWZmZS0wYzIzYTkyOTAyNTciLCJyaCI6IjEuQVNnQWFqbVVhQ3ZicUVLX2MwRTdlZ0M2eWdNQUFBQUFBQUFBd0FBQUFBQUFBQURaQUFBb0FBLiIsInJvbGVzIjpbIlVzZXItTWFpbC5SZWFkV3JpdGUuQWxsIiwiU2l0ZXMuUmVhZC5BbGwiLCJTaXRlcy5SZWFkV3JpdGUuQWxsIiwiRmlsZXMuUmVhZFdyaXRlLkFsbCIsIlVzZXIuUmVhZC5BbGwiLCJGaWxlcy5SZWFkLkFsbCJdLCJzdWIiOiJjMjQxNzkzMC1hNzg0LTQ4YzAtYWZmZS0wYzIzYTkyOTAyNTciLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiTkEiLCJ0aWQiOiI2ODk0Mzk2YS1kYjJiLTQyYTgtYmY3My00MTNiN2EwMGJhY2EiLCJ1dGkiOiJHd19kTXYtRWRVV0tSLUVaVEw0dUFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyIwOTk3YTFkMC0wZDFkLTRhY2ItYjQwOC1kNWNhNzMxMjFlOTAiXSwieG1zX2Z0ZCI6IlFOM1A1a0dPTVdwWWdVeGNKS1dnN1hRbnhhbmQ4S2JCMGNMMXdOc2RtdzhCZFhOemIzVjBhQzFrYzIxeiIsInhtc19pZHJlbCI6IjcgMzIiLCJ4bXNfcmQiOiIwLjQyTGxZQkppMUJBUzRXQVhFcmpvcmRtNVAzYVgtOHpuYmlhUGpqaGVCWXB5Q2dtOGVaQi16ZlhGY29lSlZ3LTVNc3pjbmdzVTVSQVNZR2FBZ0FOUUdnQSIsInhtc190Y2R0IjoxNTAyNDAxNTk2fQ.BmJMKsnpTGJxI77QwCQ6CIAQRsvjTumkTKmwzD_TCkJ2GBBxADCQsSgRKsaiwkm7ptAxYIxRyDkeCwxW1Ojz4ArkBBy5rs6h_cjw26y1jjLYpKfYt76yAvnLvksqNXVDPFr4Wp0gu_kTc7T499tobUS4N9nQfvn99byrAs6L-CSRoW3VwxIO9ZTrqEaQr8aB8JTF4fL0gY_LBoiSWcYbc6XObtqc1jRm03JNCqGp_72paLqpMmBbrEQvQc9FFVRXWo3QPzukiXZbIFI3t06gicgoNEgDJUVUnlaCshFFpUh7U2HpyMQBeNYmwrAArWiSPCfSV3mdGVmsi8iRShTK2A`,
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
