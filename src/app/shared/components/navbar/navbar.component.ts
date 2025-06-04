import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/interceptor/auth.service';
import { AppConfig } from '@shared/app-config';

@Component({
  selector: 'shared-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  abrirLinkApis() {
    const url = `${AppConfig.APIREST_URL}/swagger/index.html`;
    window.open(url, '_blank');
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }
}
