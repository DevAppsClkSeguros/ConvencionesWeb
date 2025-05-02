import { Component, inject, signal } from '@angular/core';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ConvencionistasService } from '../../services/convencionistas.service';

@Component({
  selector: 'convencionistas-list',
  imports: [SearchInputComponent, RouterLink],
  templateUrl: './convencionistas-list.component.html',
})
export class ConvencionistasListComponent {
  convencionistasService = inject(ConvencionistasService);
  router = inject(Router);
  // eventoList: Evento[] = [];
  query = signal('');

  convencionistaResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      if (!request.query) {
        return this.convencionistasService
          .GetConvencionistas()
          .pipe(map((resp) => resp.response));
      } else {
        return this.convencionistasService
          .GetConvencionistas()
          .pipe(map((resp) => resp.response));
      }
    },
  });
}
