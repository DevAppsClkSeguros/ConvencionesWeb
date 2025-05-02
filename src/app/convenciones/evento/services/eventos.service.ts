import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../shared/app-config';
import { catchError, map, Observable, throwError } from 'rxjs';
import { EventoResponse } from '../interfaces/evento.interface';

@Injectable({ providedIn: 'root' })
export class EventosService {
  constructor() {}

  private http = inject(HttpClient);

  getEventos(): Observable<EventoResponse> {
    return this.http
      .get<EventoResponse>(
        `${AppConfig.APIREST_URL}/api/Convenciones/GetEventos`
      )
      .pipe(
        catchError((error) => {
          return throwError(() => new Error(`No se pudo obtener los Eventos`));
        })
      );
  }

  getEventosById(idEvento: number) {}

  searchEventos(query: string): Observable<EventoResponse> {
    return this.http
    .get<EventoResponse>(
      `${AppConfig.APIREST_URL}/api/Convenciones/GetEventos`,
      {
        headers: AppConfig.getCommonHeadersRest(),
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => new Error(`No se pudo obtener los Eventos`));
      })
    );
  }
}
