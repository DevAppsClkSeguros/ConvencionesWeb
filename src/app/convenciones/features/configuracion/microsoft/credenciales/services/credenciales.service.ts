import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';
import { CredencialesResponse, Credencial } from '../interfaces/credenciales.interface';

@Injectable({ providedIn: 'root' })
export class CredencialesService {
  private http = inject(HttpClient);

  obtieneCredencial(email: string): Observable<CredencialesResponse> {
    return this.http
      .post<CredencialesResponse>(
        `${AppConfig.APIREST_URL}/api/Authentication/ObtenerCredenciales`,
        {
          email: email
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaCredenciales(credencial: Credencial): Observable<CredencialesResponse> {
    return this.http
      .post<CredencialesResponse>(
        `${AppConfig.APIREST_URL}/api/Authentication/GuardarCredenciales`,
        {
          id: credencial.id,
          tenantId: credencial.tenantId,
          clientId: credencial.clientId,
          scope: credencial.scope,
          grantType: credencial.grantType,
          clientSecret: credencial.clientSecret,
          userId: credencial.userId,
          email: credencial.email,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
