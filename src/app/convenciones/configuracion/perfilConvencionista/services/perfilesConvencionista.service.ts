import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PerfilesConvensionistaService {
  private http = inject(HttpClient);

  obtienePerfilesConvencionista() {
    return this.http
      .get(`${AppConfig.APIREST_URL}/api/Perfiles/GetPerfiles`)
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtienePerfilConvencionista(idConvencionista: number) {

  }
}
