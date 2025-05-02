import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '../../../shared/app-config';
import { HttpClient } from '@angular/common/http';
import { Convencionista } from '../interfaces/convencionistas.interface';

@Injectable({ providedIn: 'root' })
export class ConvencionistasService {
  private http = inject(HttpClient);

  GetConvencionistas(): Observable<Convencionista> {
    return this.http
      .get<Convencionista>(
        `${AppConfig.APIREST_URL}/api/Convencionistas/GetConvencionistas`,
        {
          headers: AppConfig.getCommonHeadersRest(),
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
