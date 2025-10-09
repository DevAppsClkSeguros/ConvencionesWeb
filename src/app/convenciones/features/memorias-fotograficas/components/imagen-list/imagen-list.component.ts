import { Component, input } from '@angular/core';
import { ImagenListItemComponent } from "./imagen-list-item/imagen-list-item.component";
import type { Imagen } from '../../interfaces/imagen.interface';

@Component({
  selector: 'imagen-list',
  imports: [ImagenListItemComponent],
  templateUrl: './imagen-list.component.html',
})
export class ImagenListComponent {
  imagenes = input.required<Imagen[][]>();
}
