import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, throwError } from 'rxjs';
import { Login } from './auth.interface';
import { AppConfig } from '@shared/app-config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiBase = `${AppConfig.APIREST_URL}/api/Usuarios`;
  private tokenSub = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSub.asObservable();

  constructor(private http: HttpClient) {
    const t = localStorage.getItem('authToken');
    if (t) this.tokenSub.next(t);
  }

  login(credenciales: any) {
    return this.http
      .post<Login>(`${this.apiBase}/login`, {
        UserName: credenciales.email,
        Password: credenciales.password,
      })
      .pipe(
        tap((resp) => {
          localStorage.setItem('authToken', resp.response.token);
          this.tokenSub.next(resp.response.token);
        })
      );
  }

  isTokenExpiredOrCloseToExpiry(
    token: string,
    thresholdSeconds: number = 60
  ): boolean {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const now = new Date().getTime() / 1000;
    const expirationTime = decoded.exp;
    const timeLeft = expirationTime - now;
    return timeLeft < thresholdSeconds;
  }

  renewToken() {
    const current = this.tokenSub.value;
    if (!current) return throwError(() => new Error('Sin token para renovar'));
    console.log('Ese es el token actual para la renovación: ', current);
    return this.http
      .get<Login>(`${this.apiBase}/renovar-token`, {
        headers: { Authorization: `Bearer ${current}` },
      })
      .pipe(
        tap((resp) => {
          localStorage.setItem('authToken', resp.response.token);
          this.tokenSub.next(resp.response.token);
          console.log('Token renovado: ', resp.response.token);
        })
      );
  }

  getToken(): string {
    return this.tokenSub.value ?? '';
  }

  logOut() {
    localStorage.removeItem('authToken');
    this.tokenSub.next(null);
  }
}

const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error al decodificar el token', e);
    return null;
  }
};
