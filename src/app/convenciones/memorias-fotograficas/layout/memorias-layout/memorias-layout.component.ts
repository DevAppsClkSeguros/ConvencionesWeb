import { Component } from '@angular/core';
import { MemorasNavbarComponent } from "../../components/memoras-navbar/memoras-navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-memorias-layout',
  imports: [MemorasNavbarComponent, RouterOutlet],
  templateUrl: './memorias-layout.component.html',
})
export class MemoriasLayoutComponent { }
