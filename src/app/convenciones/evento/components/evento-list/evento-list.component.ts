import { Component, inject, OnInit } from '@angular/core';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'evento-list',
  imports: [],
  templateUrl: './evento-list.component.html',
})
export class EventoComponent implements OnInit {

  eventoService = inject(EventoService)

  ngOnInit(): void {
    this.eventoService.getEventos().
    subscribe({
      next: (data) => {
        console.log("DataEvento: ", data);
      }
    })
  }
 }
