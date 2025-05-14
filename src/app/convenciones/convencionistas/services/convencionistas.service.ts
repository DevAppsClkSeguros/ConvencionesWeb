import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '../../../shared/app-config';
import { HttpClient } from '@angular/common/http';
import {
  Convencionista,
  ConvencionistasResponse,
} from '../interfaces/convencionistas.interface';

@Injectable({ providedIn: 'root' })
export class ConvencionistasService {
  private http = inject(HttpClient);

  GetConvencionistas(): Observable<ConvencionistasResponse> {
    return this.http
      .get<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/ListadoConvencionistas`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  NuevoConvencionista(
    convencionista: Convencionista
  ): Observable<ConvencionistasResponse> {
    return this.http
      .post<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/NuevoConvencionista`,
        {
          id: 0,
          clave: convencionista.clave,
          nombreCompleto: convencionista.nombreCompleto,
          puesto: convencionista.puesto,
          telefono: convencionista.telefono,
          imagen: convencionista.url,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  DetallesConvencionista(id: number): Observable<ConvencionistasResponse> {
    return this.http
      .get<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/DetallesConvencionista/${id}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  ActualizarConvencionista(id: number): Observable<ConvencionistasResponse> {
    return this.http
      .get<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/ActualizarConvencionista/${id}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminarConvencionista(id: number): Observable<ConvencionistasResponse> {
    return this.http
      .delete<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/${id}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
