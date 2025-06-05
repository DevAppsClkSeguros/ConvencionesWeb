import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
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

  obtieneConvencionista(
    idConvencionista: number
  ): Observable<ConvencionistasResponse> {
    return this.http
      .get<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/DetallesConvencionista/${idConvencionista}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevoConvencionista(
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
          documento: convencionista.documento,
          perfilConvencionistaId: convencionista.perfilConvencionistaId,
          categoriaUsuarioId: convencionista.categoriaUsuarioId,
          eventoId: convencionista.eventoId,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaConvencionista(
    convencionista: Convencionista
  ): Observable<ConvencionistasResponse> {
    return this.http
      .put<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/ActualizarConvencionista/${convencionista.id}`,
        {
          id: convencionista.id,
          clave: convencionista.clave,
          nombreCompleto: convencionista.nombreCompleto,
          puesto: convencionista.puesto,
          telefono: convencionista.telefono,
          imagen: convencionista.url,
          documento: convencionista.documento,
          perfilConvencionistaId: convencionista.perfilConvencionistaId,
          categoriaUsuarioId: convencionista.categoriaUsuarioId,
          eventoId: convencionista.eventoId,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  detallesConvencionista(id: number): Observable<ConvencionistasResponse> {
    return this.http
      .get<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/DetallesConvencionista/${id}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaConvencionista(id: number): Observable<ConvencionistasResponse> {
    return this.http
      .delete<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/${id}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
