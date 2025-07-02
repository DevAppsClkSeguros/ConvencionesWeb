import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { AppConfig } from '@shared/app-config';
import { MicrosoftTokenResponse } from './microsoft.interface';

@Injectable({ providedIn: 'root' })
export class MicrosoftAuthService {
  private tokenMicrosoft: string | null = null;

  constructor(private http: HttpClient) {
    const t = localStorage.getItem('msToken');
    if (t) this.tokenMicrosoft = t;
  }

  obtenerTokenMicrosoft(email: string) {
    const url = `${AppConfig.APIREST_URL}/api/Authentication/ObtenerToken`;
    return this.http.post<MicrosoftTokenResponse>(url, { email }).pipe(
      map((resp) => resp.response.accessToken),
      tap((token) => {
        this.tokenMicrosoft = token;
        localStorage.setItem('msToken', token);
        console.log('Token Microsoft guardado:', token);
      })
    );
  }

  getMicrosoftToken(): string | null {
    return this.tokenMicrosoft;
  }

  clearMicrosoftToken() {
    this.tokenMicrosoft = null;
    localStorage.removeItem('msToken');
  }
}
