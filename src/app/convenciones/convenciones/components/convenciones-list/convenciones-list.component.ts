import { Component, inject, OnInit, signal } from '@angular/core';
import { ConvencionesService } from '../../services/convenciones.service';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IconRefreshComponent } from "@shared/icons/icon-refresh/icon-refresh.component";
import { IconAddComponent } from "@shared/icons/icon-add/icon-add.component";

@Component({
  selector: 'convenciones-list',
  imports: [DatePipe, RouterLink, IconRefreshComponent, IconAddComponent],
  templateUrl: './convenciones-list.component.html',
})
export class ConvencionesListComponent implements OnInit {
  convencionesService = inject(ConvencionesService);
  router = inject(Router);
  // eventoList: Evento[] = [];
  query = signal('');

  eventoResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      if (!request.query) {
        return this.convencionesService
          .getEventos()
          .pipe(map((resp) => resp.response));
      } else {
        return this.convencionesService
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
