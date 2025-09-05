import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';
import {
  ModulosResponse,
  Modulo,
} from '../interfaces/modulos.interface';

@Injectable({ providedIn: 'root' })
export class ModulosService {
  private http = inject(HttpClient);

  obtieneModulos(): Observable<ModulosResponse> {
    return this.http
      .get<ModulosResponse>(
        `${AppConfig.APIREST_URL}/api/Modulos/Listado`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneModulo(moduloId: string): Observable<ModulosResponse> {
    return this.http
      .get<ModulosResponse>(
        `${AppConfig.APIREST_URL}/api/Modulos/Detalles/${moduloId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevoModulo(modulo: Modulo): Observable<ModulosResponse> {
    return this.http
      .post<ModulosResponse>(`${AppConfig.APIREST_URL}/api/Modulos/Nuevo`, {
        masterKey: modulo.masterKey,
        keyCode: modulo.keyCode,
        descripcion: modulo.descripcion,
        status: modulo.status,
        idTypeResp: modulo.idTypeResp,
        message: modulo.message,
        fStart: modulo.fStart,
        fStop: modulo.fStop,
        statusPopUp: modulo.statusPopUp,
        idTypeRespPopUp: modulo.idTypeRespPopUp,
        messagePopUp: modulo.messagePopUp,
      })
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaModulo(modulo: Modulo): Observable<ModulosResponse> {
    return this.http
      .put<ModulosResponse>(
        `${AppConfig.APIREST_URL}/api/Modulos/Actualizar/${modulo.id}`,
        {
          masterKey: modulo.masterKey,
          keyCode: modulo.keyCode,
          descripcion: modulo.descripcion,
          status: modulo.status,
          idTypeResp: modulo.idTypeResp,
          message: modulo.message,
          fStart: modulo.fStart,
          fStop: modulo.fStop,
          statusPopUp: modulo.statusPopUp,
          idTypeRespPopUp: modulo.idTypeRespPopUp,
          messagePopUp: modulo.messagePopUp,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaModulo(moduloId: number): Observable<ModulosResponse> {
    return this.http
      .delete<ModulosResponse>(
        `${AppConfig.APIREST_URL}/api/Modulos/Eliminar/${moduloId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
