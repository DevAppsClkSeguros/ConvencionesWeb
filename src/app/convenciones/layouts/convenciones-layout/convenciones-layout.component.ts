import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { FooterComponent } from "@shared/components/footer/footer.component";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-convenciones-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FooterComponent],
  templateUrl: './convenciones-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvencionesLayoutComponent {
  authService = inject(AuthService);
  usuario: string = '';
  environment = environment;

  ngOnInit(): void {
    const datosUsuario = this.authService.getUserData();
    if (datosUsuario) {
      this.usuario = datosUsuario.FirstName;
    }
  }
}
