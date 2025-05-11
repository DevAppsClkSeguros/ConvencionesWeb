import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/interceptor/auth.service';

@Component({
  selector: 'shared-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  authService = inject(AuthService);
  router = inject(Router);
  
  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login'])
  }
 }
