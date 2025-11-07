import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import type {
  Actividad,
  ActividadesResponse,
} from '../interfaces/actividades.interface';

@Injectable({ providedIn: 'root' })
export class ActividadesService {
  private http = inject(HttpClient);

  obtieneActividades(): Observable<ActividadesResponse> {
    return this.http
      .get<ActividadesResponse>(
        `${AppConfig.APIREST_URL}/api/Actividades/Listado`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneActividad(recomendacionId: number): Observable<ActividadesResponse> {
    return this.http
      .get<ActividadesResponse>(
        `${AppConfig.APIREST_URL}/api/Actividades/Detalles/${recomendacionId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevaActividad(actividad: Actividad): Observable<ActividadesResponse> {
    return this.http
      .post<ActividadesResponse>(
        `${AppConfig.APIREST_URL}/api/Actividades/Nueva`,
        {
          titulo: actividad.titulo,
          subtitulo: actividad.subtitulo,
          especificaciones: actividad.especificaciones,
          imagen: actividad.url,
          fecha: actividad.fecha,
          eventoId: actividad.eventoId,
          categoria_ActividadesId: actividad.categoria_ActividadesId,
          convencionistasIds: actividad.convencionistasIds,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaActividad(
    actividad: Actividad
  ): Observable<ActividadesResponse> {
    return this.http
      .put<ActividadesResponse>(
        `${AppConfig.APIREST_URL}/api/Actividades/Actualizar/${actividad.id}`,
        {
          id: actividad.id,
          titulo: actividad.titulo,
          subtitulo: actividad.subtitulo,
          especificaciones: actividad.especificaciones,
          imagen: actividad.url,
          fecha: actividad.fecha,
          eventoId: actividad.eventoId,
          categoria_ActividadesId: actividad.categoria_ActividadesId,
          convencionistasIds: actividad.convencionistasIds,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaActividad(actividadId: number): Observable<ActividadesResponse> {
    return this.http
      .delete<ActividadesResponse>(
        `${AppConfig.APIREST_URL}/api/Actividades/Eliminar/${actividadId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
