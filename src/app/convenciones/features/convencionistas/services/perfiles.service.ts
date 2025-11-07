import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';
import { PerfilesResponse, Perfil } from '../interfaces/perfiles.interface';

@Injectable({ providedIn: 'root' })
export class PerfilesService {
  private http = inject(HttpClient);

  obtienePerfiles(): Observable<PerfilesResponse> {
    return this.http
      .get<PerfilesResponse>(
        `${AppConfig.APIREST_URL}/api/PerfilConvencionista/Listado`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtienePerfil(perfilId: number): Observable<PerfilesResponse> {
    return this.http
      .get<PerfilesResponse>(
        `${AppConfig.APIREST_URL}/api/PerfilConvencionista/Detalles/${perfilId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevoPerfil(perfil: Perfil): Observable<PerfilesResponse> {
    return this.http
      .post<PerfilesResponse>(
        `${AppConfig.APIREST_URL}/api/PerfilConvencionista/Nuevo`,
        {
          id: perfil.id,
          nombre: perfil.nombre,
          activo: perfil.activo,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaPerfil(perfil: Perfil): Observable<PerfilesResponse> {
    return this.http
      .put<PerfilesResponse>(
        `${AppConfig.APIREST_URL}/api/PerfilConvencionista/Actualizar/${perfil.id}`,
        {
          id: perfil.id,
          nombre: perfil.nombre,
          activo: perfil.activo,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaPerfil(perfilId: number): Observable<PerfilesResponse> {
    return this.http
      .delete<PerfilesResponse>(
        `${AppConfig.APIREST_URL}/api/PerfilConvencionista/${perfilId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
