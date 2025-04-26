import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'evento-update',
  imports: [],
  templateUrl: './evento-update.component.html',
})
export class EventoUpdateComponent {
  location = inject(Location);

  goBack() {
    this.location.back();
  }
}
