import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppConfig } from '@shared/app-config';
import { AuthService } from '@core/interceptor/auth.service';

@Component({
  selector: 'shared-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  nombreUsuario: string = '';

  ngOnInit(): void {
    const datosUsuario = this.authService.getUserData();
    if (datosUsuario) {
      this.nombreUsuario = datosUsuario.Nombre;
    }
  }

  abrirLinkApis() {
    const url = `${AppConfig.APIREST_URL}/swagger/index.html`;
    window.open(url, '_blank');
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
