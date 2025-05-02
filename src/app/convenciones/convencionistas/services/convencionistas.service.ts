import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '../../../shared/app-config';
import { HttpClient } from '@angular/common/http';
import { Convencionista, ConvencionistasResponse } from '../interfaces/convencionistas.interface';

@Injectable({ providedIn: 'root' })
export class ConvencionistasService {
  private http = inject(HttpClient);

  GetConvencionistas(): Observable<ConvencionistasResponse> {
    return this.http
      .get<ConvencionistasResponse>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/ListadoConvencionistas`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
