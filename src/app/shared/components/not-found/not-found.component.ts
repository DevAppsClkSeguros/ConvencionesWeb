import { Location } from '@angular/common';
import { Component, inject, input } from '@angular/core';

@Component({
  selector: 'shared-not-found',
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  location = inject(Location);
  mensaje = input.required<string>()
  goBack() {
    this.location.back();
  }
}
