import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/interceptor/auth.service';
import { FormUtils } from '../core/utils/form-utils';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  loginError = false;
  loading = false;
  credencialesInvalidas = false;
  formUtils = FormUtils;
  myForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authService
      .login(this.myForm.value)
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.router.navigateByUrl('/dashboard');
          } else {
            this.loginError = false;
            this.credencialesInvalidas = true;
          }
        },
        error: (e) => {
          console.log('El error del login: ', e);
        },
        complete: () => {
          this.loading=false;
        }
      });
  }
}
