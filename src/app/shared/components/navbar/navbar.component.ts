import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppConfig } from '@shared/app-config';
import { AuthService } from '@core/services/auth.service';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'shared-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  usuario: string = '';
  environment = environment;

  ngOnInit(): void {
    const datosUsuario = this.authService.getUserData();
    if (datosUsuario) {
      this.usuario = datosUsuario.FirstName;
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
