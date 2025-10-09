import { Component, inject, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { FooterComponent } from '@shared/components/footer/footer.component';

@Component({
  selector: 'app-convenciones-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FooterComponent],
  templateUrl: './convenciones-layout.component.html',
})
export class ConvencionesLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);
  usuario: string = '';
  environment = environment;

  menuState = signal<{ [key: string]: boolean }>({
    convencionistas: false,
    reportes: false,
    usuarios: false,
  });

  ngOnInit(): void {
    const datosUsuario = this.authService.getUserData();
    if (datosUsuario) {
      this.usuario = `${datosUsuario.FirstName} ${datosUsuario.LastName}`;
    }
  }

  toggleMenu(menu: string) {
    this.menuState.update((state) => ({
      ...Object.fromEntries(Object.keys(state).map((k) => [k, false])), // cierra todos
      [menu]: !state[menu],
    }));
  }

  isOpen(menu: string) {
    return this.menuState()[menu];
  }

  navegarModulo(modulo: string) {
    this.router.navigateByUrl(`/${modulo}`);
  }
}
