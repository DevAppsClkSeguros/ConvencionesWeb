import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfig } from '@shared/app-config';
import { catchError, map, Observable } from 'rxjs';
import type {
  Convencion,
  ConvencionesResponse,
  ConvencionResponse,
} from '../interfaces/convenciones.interface';

@Injectable({ providedIn: 'root' })
export class ConvencionesService {
  private http = inject(HttpClient);

  obtieneConvenciones(): Observable<ConvencionesResponse> {
    return this.http
      .get<ConvencionesResponse>(`${AppConfig.APIREST_URL}/api/Eventos/listado`)
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneConvencion(convencionId: number): Observable<ConvencionResponse> {
    return this.http
      .get<ConvencionResponse>(
        `${AppConfig.APIREST_URL}/api/Eventos/Detalles/${convencionId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevaConvencion(convencion: Convencion): Observable<ConvencionesResponse> {
    return this.http
      .post<ConvencionesResponse>(`${AppConfig.APIREST_URL}/api/Eventos/Nuevo`, {
        NombreEvento: convencion.nombreEvento,
        Subtitulo: convencion.subtitulo,
        Activo: convencion.activo,
        Fecha_inicio: convencion.fecha_inicio,
        Fecha_fin: convencion.fecha_fin,
        Imagen: convencion.url,
        Direccion: convencion.direccion,
        Latitud: convencion.latitud,
        Longitud: convencion.longitud,
        LugarDestino: convencion.lugarDestino,
      })
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaConvencion(convencion: Convencion): Observable<ConvencionesResponse> {
    return this.http
      .put<ConvencionesResponse>(
        `${AppConfig.APIREST_URL}/api/Eventos/Actualizar/${convencion.id}`,
        {
          NombreEvento: convencion.nombreEvento,
          Subtitulo: convencion.subtitulo,
          Activo: convencion.activo,
          Fecha_inicio: convencion.fecha_inicio,
          Fecha_fin: convencion.fecha_fin,
          Imagen: convencion.url,
          Direccion: convencion.direccion,
          Latitud: convencion.latitud,
          Longitud: convencion.longitud,
          LugarDestino: convencion.lugarDestino,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaConvencion(convencionId: number): Observable<ConvencionesResponse> {
    return this.http
      .delete<ConvencionesResponse>(
        `${AppConfig.APIREST_URL}/api/Eventos/${convencionId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
