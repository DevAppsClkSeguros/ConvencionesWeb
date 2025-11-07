import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import type {
  Recomendacion,
  RecomendacionesResponse,
} from '../interfaces/recomendaciones.interface';

@Injectable({ providedIn: 'root' })
export class RecomendacionesService {
  private http = inject(HttpClient);

  obtieneRecomendaciones(): Observable<RecomendacionesResponse> {
    return this.http
      .get<RecomendacionesResponse>(
        `${AppConfig.APIREST_URL}/api/Recomendacion/Listado`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneRecomendacion(
    recomendacionId: number
  ): Observable<RecomendacionesResponse> {
    return this.http
      .get<RecomendacionesResponse>(
        `${AppConfig.APIREST_URL}/api/Recomendacion/Detalles/${recomendacionId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevaRecomendacion(
    recomendacion: Recomendacion
  ): Observable<RecomendacionesResponse> {
    return this.http
      .post<RecomendacionesResponse>(
        `${AppConfig.APIREST_URL}/api/Recomendacion/Nueva`,
        {
          titulo: recomendacion.titulo,
          informacion: recomendacion.informacion,
          latitud: recomendacion.latitud,
          longitud: recomendacion.longitud,
          imagen: recomendacion.url,
          eventoId: recomendacion.eventoId,
          categoria_RecomendacionId: recomendacion.categoria_RecomendacionId,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaRecomendacion(
    recomendacion: Recomendacion
  ): Observable<RecomendacionesResponse> {
    return this.http
      .put<RecomendacionesResponse>(
        `${AppConfig.APIREST_URL}/api/Recomendacion/Actualizar/${recomendacion.id}`,
        {
          titulo: recomendacion.titulo,
          informacion: recomendacion.informacion,
          latitud: recomendacion.latitud,
          longitud: recomendacion.longitud,
          imagen: recomendacion.url,
          eventoId: recomendacion.eventoId,
          categoria_RecomendacionId: recomendacion.categoria_RecomendacionId,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaRecomendacion(
    RecomendacionId: number
  ): Observable<RecomendacionesResponse> {
    return this.http
      .delete<RecomendacionesResponse>(
        `${AppConfig.APIREST_URL}/api/Recomendacion/Eliminar/${RecomendacionId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
