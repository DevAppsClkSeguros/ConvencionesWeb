import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AppConfig } from '@shared/app-config';
import type { Login } from '../interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiBase = `${AppConfig.APIREST_URL}/api/Usuarios`;
  private tokenSub = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSub.asObservable();

  userRoles = signal<string[]>([]);

  constructor(private http: HttpClient) {
    const t = localStorage.getItem('authToken');
    if (t) {
      this.tokenSub.next(t);
      this.updateUserRoles(t);
    }
  }

  private updateUserRoles(token: string) {
    try {
      const decoded: any = jwtDecode(token);
      const roles = decoded.Roles;

      if (Array.isArray(roles)) {
        this.userRoles.set(roles);
      } else if (typeof roles === 'string') {
        this.userRoles.set([roles]);
      } else {
        this.userRoles.set([]);
      }
    } catch (err) {
      console.error('Error al decodificar roles:', err);
      this.userRoles.set([]);
    }
  }

  login(credenciales: any) {
    return this.http
      .post<Login>(`${this.apiBase}/login`, {
        UserName: credenciales.email,
        Password: credenciales.password,
      })
      .pipe(
        tap((resp) => {
          const token = resp.response.token;
          localStorage.setItem('authToken', token);
          this.tokenSub.next(token);
          this.updateUserRoles(token);
        })
      );
  }

  isTokenExpiredOrCloseToExpiry(
    token: string,
    thresholdSeconds: number = 60
  ): boolean {
    const decoded = jwtDecode(token);
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
          const token = resp.response.token;
          localStorage.setItem('authToken', token);
          this.tokenSub.next(token);
          this.updateUserRoles(token);
          console.log('Token renovado: ', token);
        })
      );
  }

  getToken(): string {
    return this.tokenSub.value ?? '';
  }

  getUserData(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  hasRole(role: string): boolean {
    return this.userRoles().includes(role);
  }

  logOut() {
    localStorage.removeItem('authToken');
    this.tokenSub.next(null);
    this.userRoles.set([]);
  }
}
