import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';
import type {
  Convencionista,
  ConvencionistaResponse,
  ConvencionistasResponse,
  ConvencionistasResponsePaginado,
} from '../interfaces/convencionistas.interface';

@Injectable({ providedIn: 'root' })
export class ConvencionistasService {
  private http = inject(HttpClient);
  private convencionistasCache = new Map<
    string,
    ConvencionistasResponsePaginado
  >();

  obtieneConvencionistas(): Observable<ConvencionistasResponse> {
    return this.http
      .get<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/Listado`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  ObtieneConvencionistasPaginado(
    pagina: number,
    registrosPorPagina: number
  ): Observable<ConvencionistasResponsePaginado> {
    const cacheKey = `pagina:${pagina}-registrosPorPagina:${registrosPorPagina}`;
    if (this.convencionistasCache.has(cacheKey)) {
      return of(this.convencionistasCache.get(cacheKey)!);
    }
    return this.http
      .get<ConvencionistasResponsePaginado>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/ListadoPaginado?NumPagina=${pagina}&RegXPag=${registrosPorPagina}`
      )
      .pipe(
        tap((resp) => this.convencionistasCache.set(cacheKey, resp)),
        catchError(AppConfig.handleErrors)
      );
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
  ): Observable<ConvencionistaResponse> {
    return this.http
      .get<ConvencionistaResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/Detalles/${idConvencionista}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevoConvencionista(
    convencionista: Convencionista
  ): Observable<ConvencionistaResponse> {
    return this.http
      .post<ConvencionistaResponse>(
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
      .pipe(
        tap(() => this.limpiaCache()),
        catchError(AppConfig.handleErrors)
      );
  }

  actualizaConvencionista(
    convencionista: Convencionista
  ): Observable<ConvencionistaResponse> {
    return this.http
      .put<ConvencionistaResponse>(
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
      .pipe(
        tap((resp) => {
          if (resp.status) {
            this.actualizaCached(convencionista);
          }
        }),
        catchError(AppConfig.handleErrors)
      );
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

  private actualizaCached(item: Convencionista): void {
    this.convencionistasCache.forEach((value) => {
      const index = value.response.listado.findIndex((c) => c.id === item.id);
      if (index >= 0) {
        value.response.listado[index] = item;
      }
    });
  }

  private limpiaCache(): void {
    this.convencionistasCache.clear();
  }
}
