import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';
import type {
  Pregunta,
  PreguntasResponse,
  RespuestasResponse,
} from '../interfaces/encuesta.interface';

@Injectable({ providedIn: 'root' })
export class EncuestaService {
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
        `${AppConfig.APIREST_URL}/api/Preguntas/Detalles/${preguntaId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevaPregunta(pregunta: Pregunta): Observable<PreguntasResponse> {
    return this.http
      .post<PreguntasResponse>(
        `${AppConfig.APIREST_URL}/api/Preguntas/Nueva`,
        {
          id: pregunta.id,
          texto: pregunta.texto,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaPregunta(pregunta: Pregunta): Observable<PreguntasResponse> {
    return this.http
      .put<PreguntasResponse>(
        `${AppConfig.APIREST_URL}/api/Preguntas/Actualizar/${pregunta.id}`,
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

  obtieneRespuestas(eventoId: number): Observable<RespuestasResponse[]> {
    return this.http
      .get<RespuestasResponse[]>(
        `${AppConfig.APIREST_URL}/api/Preguntas/evento/${eventoId}/preguntas-respuestas`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaRespuesta(respuestaId: number) {
  }
}
