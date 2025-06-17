import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CategoriasConvensionistaService {
  private http = inject(HttpClient);

  obtieneCategoriasConvencionista() {
    return this.http
      .get(`${AppConfig.APIREST_URL}/api/Categoria/GetCategorias`)
      .pipe(catchError(AppConfig.handleErrors));
  }

}
