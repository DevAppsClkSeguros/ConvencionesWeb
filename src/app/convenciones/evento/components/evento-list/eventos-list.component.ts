import { Component, inject, OnInit, signal } from '@angular/core';
import { EventosService } from '../../services/eventos.service';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'evento-list',
  imports: [DatePipe, RouterLink, SearchInputComponent],
  templateUrl: './eventos-list.component.html',
})
export class EventosListComponent implements OnInit {
  eventosService = inject(EventosService);
  router = inject(Router);
  // eventoList: Evento[] = [];
  query = signal('');

  eventoResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      if (!request.query) {
        return this.eventosService
          .getEventos()
          .pipe(map((resp) => resp.response));
      } else {
        return this.eventosService
          .getEventos()
          .pipe(map((resp) => resp.response));
      }
    },
  });

  ngOnInit(): void {
    // this.eventoService.getEventos().
    // subscribe({
    //   next: (data) => {
    //     console.log("DataEvento: ", data);
    //     this.eventoList = data.response;
    //   }
    // })
  }
}
