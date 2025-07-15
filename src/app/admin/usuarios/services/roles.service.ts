import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfig } from '@shared/app-config';
import { catchError, Observable } from 'rxjs';
import type {
  Rol,
  RolesResponse,
} from '../interfaces/roles.interface';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private http = inject(HttpClient);

  obtieneRoles(): Observable<RolesResponse> {
    return this.http
      .get<RolesResponse>(`${AppConfig.APIREST_URL}/api/Roles/listado`)
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneRol(nombreUsuario: number): Observable<RolesResponse> {
    return this.http
      .get<RolesResponse>(
        `${AppConfig.APIREST_URL}/api/Roles/Detalles/${nombreUsuario}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevoRol(rol: Rol): Observable<RolesResponse> {
    return this.http
      .post<RolesResponse>(`${AppConfig.APIREST_URL}/api/Roles/Nuevo`, {
        nombre: rol.name,
      })
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaRol(rol: Rol): Observable<RolesResponse> {
    return this.http
      .put<RolesResponse>(
        `${AppConfig.APIREST_URL}/api/Roles/Actualizar/${rol.id}`,
        {
          nombre: rol.name,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaRol(nombreUsuario: number): Observable<RolesResponse> {
    return this.http
      .delete<RolesResponse>(
        `${AppConfig.APIREST_URL}/api/Roles/eliminar-rol/${nombreUsuario}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
