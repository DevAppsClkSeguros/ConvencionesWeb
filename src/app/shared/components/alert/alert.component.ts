import { Component, inject } from '@angular/core';
import { NotificacionService } from '../../services/notificacion.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'shared-alert',
  imports: [NgClass],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  notificacion = inject(NotificacionService);
}
