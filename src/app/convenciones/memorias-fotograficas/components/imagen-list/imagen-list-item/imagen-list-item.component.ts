import { Component, input } from '@angular/core';

@Component({
  selector: 'imagen-list-item',
  imports: [],
  templateUrl: './imagen-list-item.component.html',
})
export class ImagenListItemComponent {

  imagenUrl = input.required<string>()
 }
