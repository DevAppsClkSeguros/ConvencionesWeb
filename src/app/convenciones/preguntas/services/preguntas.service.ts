import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';
import { Pregunta, PreguntasResponse } from '../interfaces/preguntas.interface';

@Injectable({ providedIn: 'root' })
export class PreguntasService {
  private http = inject(HttpClient);

  obtienePreguntas(): Observable<PreguntasResponse> {
    return this.http
      .get<PreguntasResponse>(
        `${AppConfig.APIREST_URL}/api/Preguntas/ListadoPreguntas`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtienePregunta(preguntaId: number): Observable<PreguntasResponse> {
    return this.http
      .get<PreguntasResponse>(
        `${AppConfig.APIREST_URL}/api/Preguntas/DetallesPregunta${preguntaId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevaPregunta(pregunta: Pregunta): Observable<PreguntasResponse> {
    return this.http
      .post<PreguntasResponse>(
        `${AppConfig.APIREST_URL}/api/Preguntas/NuevaPregunta`,
        {
          id: pregunta.id,
          texto: pregunta.texto,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaPregunta(pregunta: Pregunta): Observable<PreguntasResponse> {
    return this.http
      .post<PreguntasResponse>(
        `${AppConfig.APIREST_URL}/api/Preguntas/ActualizarPregunta${pregunta.id}`,
        {
          id: pregunta.id,
          texto: pregunta.texto,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaPregunta(preguntaId: number): Observable<PreguntasResponse> {
    return this.http
      .delete<PreguntasResponse>(
        `${AppConfig.APIREST_URL}/api/Preguntas/${preguntaId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
