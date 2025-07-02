import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { AppConfig } from '@shared/app-config';
import { MicrosoftTokenResponse } from './microsoft.interface';

@Injectable({ providedIn: 'root' })
export class MicrosoftAuthService {
  private tokenMicrosoft: string | null = null;
  private tokenExpira: number | null = null; // timestamp

  constructor(private http: HttpClient) {
    const t = localStorage.getItem('msToken');
    const exp = localStorage.getItem('msTokenExp');

    if (t) this.tokenMicrosoft = t;
    if (exp) this.tokenExpira = +exp;
  }

  obtenerTokenMicrosoft(email: string) {
    const url = `${AppConfig.APIREST_URL}/api/Authentication/ObtenerToken`;

    return this.http.post<MicrosoftTokenResponse>(url, { email }).pipe(
      map((resp) => {
        const token = resp.response.accessToken;
        const expiraEnSegundos = 3600;
        const ahora = Date.now();
        const expiraTimestamp = ahora + expiraEnSegundos * 1000;

        this.tokenMicrosoft = token;
        this.tokenExpira = expiraTimestamp;

        localStorage.setItem('msToken', token);
        localStorage.setItem('msTokenExp', expiraTimestamp.toString());

        return token;
      })
    );
  }

  getMicrosoftToken(): string | null {
    if (
      this.tokenMicrosoft &&
      this.tokenExpira &&
      Date.now() < this.tokenExpira
    ) {
      return this.tokenMicrosoft;
    }
    return null;
  }

  clearMicrosoftToken() {
    this.tokenMicrosoft = null;
    this.tokenExpira = null;
    localStorage.removeItem('msToken');
    localStorage.removeItem('msTokenExp');
  }
}
