import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfig } from '../../../shared/app-config';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ConvencionResponse } from '../interfaces/convenciones.interface';

@Injectable({ providedIn: 'root' })
export class ConvencionesService {
  constructor() {}

  private http = inject(HttpClient);

  getEventos(): Observable<ConvencionResponse> {
    return this.http
      .get<ConvencionResponse>(
        `${AppConfig.APIREST_URL}/api/Convenciones/GetEventos`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  getEventosById(idEvento: number) {}

  searchEventos(query: string): Observable<ConvencionResponse> {
    return this.http
      .get<ConvencionResponse>(
        `${AppConfig.APIREST_URL}/api/Convenciones/GetEventos`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
