import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'shared-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent { }
