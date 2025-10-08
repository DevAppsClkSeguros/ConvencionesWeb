import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { FooterComponent } from "@shared/components/footer/footer.component";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-convenciones-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FooterComponent],
  templateUrl: './convenciones-layout.component.html',
})
export class ConvencionesLayoutComponent {
  authService = inject(AuthService);
  usuario: string = '';
  environment = environment;

  menuState = signal<{ [key: string]: boolean }>({
    convencionistas: false,
    reportes: false,
    usuarios: false,
  });

  toggleMenu(menu: string) {
    this.menuState.update((state) => ({
      ...Object.fromEntries(Object.keys(state).map((k) => [k, false])), // cierra todos
      [menu]: !state[menu],
    }));
  }

  isOpen(menu: string) {
    return this.menuState()[menu];
  }

  ngOnInit(): void {
    const datosUsuario = this.authService.getUserData();
    if (datosUsuario) {
      this.usuario = datosUsuario.FirstName;
    }
  }
}
