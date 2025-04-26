import { Component, inject, OnInit } from '@angular/core';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../interfaces/evento.interface';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'evento-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './evento-list.component.html',
})
export class EventoComponent implements OnInit {

  eventoService = inject(EventoService);
  eventoList: Evento[] = [];

  ngOnInit(): void {
    this.eventoService.getEventos().
    subscribe({
      next: (data) => {
        console.log("DataEvento: ", data);
        this.eventoList = data.response;
      }
    })
  }
 }
