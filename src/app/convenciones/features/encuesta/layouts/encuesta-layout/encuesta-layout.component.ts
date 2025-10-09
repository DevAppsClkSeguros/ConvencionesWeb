import { Component } from '@angular/core';
import { EncuestaNavbarComponent } from "../../components/encuesta-navbar/encuesta-navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-encuesta-layout',
  imports: [EncuestaNavbarComponent, RouterOutlet],
  templateUrl: './encuesta-layout.component.html',
})
export class EncuestaLayoutComponent { }
