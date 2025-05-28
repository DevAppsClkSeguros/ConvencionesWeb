import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap, throwError } from 'rxjs';
import { Login } from './auth.interface';
interface RenewResp {
  token: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiBase =
    'https://dev.developmentservices.com.mx/ApisConvenciones/api/Usuarios';
  private tokenSub = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSub.asObservable();

  constructor(private http: HttpClient) {
    const t = localStorage.getItem('authToken');
    if (t) this.tokenSub.next(t);
  }

  // 2.1 Login: obtén token y guárdalo
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

  // 2.2 Renueva token: úsalo en 401 o cuando quieras
  renewToken() {
    const current = this.tokenSub.value;
    if (!current) return throwError(() => new Error('Sin token para renovar'));
    console.log('Ese es el token actual para la renovación: ', current);
    return this.http
      .get<RenewResp>(`${this.apiBase}/renovar-token`, {
        headers: { Authorization: `Bearer ${current}` },
      })
      .pipe(
        tap((resp) => {
          localStorage.setItem('authToken', resp.token);
          this.tokenSub.next(resp.token);
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
