import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfig } from '@shared/app-config';
import { catchError, map, Observable } from 'rxjs';
import {
  Convencion,
  ConvencionResponse,
} from '../interfaces/convenciones.interface';

@Injectable({ providedIn: 'root' })
export class ConvencionesService {

  private http = inject(HttpClient);

  obtieneConvenciones(): Observable<ConvencionResponse> {
    return this.http
      .get<ConvencionResponse>(
        `${AppConfig.APIREST_URL}/api/Eventos/GetEventos`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneConvencion(convencionId: number): Observable<ConvencionResponse> {
    return this.http
      .get<ConvencionResponse>(
        `${AppConfig.APIREST_URL}/api/Eventos/EventoXId/${convencionId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevaConvencion(convencion: Convencion): Observable<ConvencionResponse> {
    return this.http
      .post<ConvencionResponse>(
        `${AppConfig.APIREST_URL}/api/Eventos/CrearEvento`,
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

  actualizaConvencion(convencion: Convencion): Observable<ConvencionResponse> {
    return this.http
      .put<ConvencionResponse>(
        `${AppConfig.APIREST_URL}/api/Eventos/ActualizarEvento/${convencion.id}`,
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

  eliminaConvencion(convencionId: number): Observable<ConvencionResponse> {
    return this.http
      .delete<ConvencionResponse>(
        `${AppConfig.APIREST_URL}/api/Eventos/${convencionId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
