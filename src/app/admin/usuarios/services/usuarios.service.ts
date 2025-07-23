import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfig } from '@shared/app-config';
import { catchError, Observable } from 'rxjs';
import type {
  Usuario,
  UsuariosResponse,
} from '../interfaces/usuarios.interface';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private http = inject(HttpClient);

  obtieneUsuarios(): Observable<UsuariosResponse> {
    return this.http
      .get<UsuariosResponse>(`${AppConfig.APIREST_URL}/api/Usuarios/listado`)
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneUsuario(nombreUsuario: number): Observable<UsuariosResponse> {
    return this.http
      .get<UsuariosResponse>(
        `${AppConfig.APIREST_URL}/api/Usuarios/Detalles/${nombreUsuario}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevoUsuario(usuario: Usuario): Observable<UsuariosResponse> {
    return this.http
      .post<UsuariosResponse>(`${AppConfig.APIREST_URL}/api/Usuarios/Nuevo`, {
        username: usuario.userName,
        firstName: usuario.firstName,
        lastName: usuario.lastName,
        email: usuario.email,
        fechaCreacion: usuario.fechaCreacion,
        activo: usuario.activo,
        password: usuario.password,
        roles: usuario.roles,
      })
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaUsuario(usuario: Usuario): Observable<UsuariosResponse> {
    return this.http
      .put<UsuariosResponse>(
        `${AppConfig.APIREST_URL}/api/Usuarios/Actualizar/${usuario.userName}`,
        {
          username: usuario.userName,
          firstName: usuario.firstName,
          lastName: usuario.lastName,
          email: usuario.email,
          fechaCreacion: usuario.fechaCreacion,
          activo: usuario.activo,
          newPassword: usuario.password,
          roles: usuario.roles,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaUsuario(nombreUsuario: number): Observable<UsuariosResponse> {
    return this.http
      .delete<UsuariosResponse>(
        `${AppConfig.APIREST_URL}/api/Usuarios/EliminarEvento/${nombreUsuario}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
