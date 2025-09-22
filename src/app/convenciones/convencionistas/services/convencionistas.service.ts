import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';
import type {
  Convencionista,
  ConvencionistasResponse,
  ConvencionistasResponsePaginado,
} from '../interfaces/convencionistas.interface';

@Injectable({ providedIn: 'root' })
export class ConvencionistasService {
  private http = inject(HttpClient);

  obtieneConvencionistas(): Observable<ConvencionistasResponse> {
    return this.http
      .get<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/Listado`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  ObtieneConvencionistasPaginado(): Observable<ConvencionistasResponsePaginado> {
    return this.http
      .get<ConvencionistasResponsePaginado>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/ListadoPaginado?NumPagina=1&RegXPag=10`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneConvencionistasPorConvencion(
    eventoId: number
  ): Observable<ConvencionistasResponse> {
    return this.http
      .get<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/ListadoXEvento/${eventoId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneConvencionista(
    idConvencionista: number
  ): Observable<ConvencionistasResponse> {
    return this.http
      .get<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/Detalles/${idConvencionista}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevoConvencionista(
    convencionista: Convencionista
  ): Observable<ConvencionistasResponse> {
    return this.http
      .post<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/Nuevo`,
        {
          id: 0,
          activo: convencionista.activo,
          clave: convencionista.clave,
          nombreCompleto: convencionista.nombreCompleto,
          puesto: convencionista.puesto,
          telefono: convencionista.telefono,
          imagen: convencionista.url,
          documento: convencionista.documento,
          perfilId: convencionista.perfilId,
          categoriaId: convencionista.categoriaId,
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
        `${AppConfig.APIREST_URL}/api/Convencionistas/Actualizar/${convencionista.id}`,
        {
          id: convencionista.id,
          activo: convencionista.activo,
          clave: convencionista.clave,
          nombreCompleto: convencionista.nombreCompleto,
          puesto: convencionista.puesto,
          telefono: convencionista.telefono,
          imagen: convencionista.url,
          documento: convencionista.documento,
          perfilId: convencionista.perfilId,
          categoriaId: convencionista.categoriaId,
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
