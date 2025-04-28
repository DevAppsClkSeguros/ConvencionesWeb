import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/interceptor/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  loginError = false;
  credentials = {
    email: '',
    password: '',
  };

  onSubmit() {
    console.log('Credenciales enviadas:', this.credentials);
    this.authService
      .login(this.credentials.email, this.credentials.password)
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.loginError = false;
            this.router.navigateByUrl('/dashboard');
          } else {
            this.loginError = true;
          }
        },
        error: (e) => {
          this.loginError = true;
          console.log('El error del login: ', e);
        },
      });
  }
}
