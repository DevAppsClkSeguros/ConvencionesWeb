import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';
import { CategoriasRecomendacionResponse } from '../interfaces/categorias-recomendacion.interface';

@Injectable({ providedIn: 'root' })
export class CategoriasRecomendacionService {
  private http = inject(HttpClient);

  obtieneCategoriasRecomendacion(): Observable<CategoriasRecomendacionResponse> {
    return this.http
      .get<CategoriasRecomendacionResponse>(
        `${AppConfig.APIREST_URL}/api/Recomendacion/CategoriaRecomendacion/Listado`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

}
