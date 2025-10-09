import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';
import type {
  VersionAppResponse,
  Version,
} from '../interfaces/version-app.interface';

@Injectable({ providedIn: 'root' })
export class VersionAppService {
  private http = inject(HttpClient);

  obtieneVersiones(): Observable<VersionAppResponse> {
    return this.http
      .get<VersionAppResponse>(
        `${AppConfig.APIREST_URL}/api/AppServices/ObtenerVersion`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneVersion(versionId: number): Observable<VersionAppResponse> {
    return this.http
      .get<VersionAppResponse>(
        `${AppConfig.APIREST_URL}/api/AppServices/Detalles/${versionId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaVersion(version: Version): Observable<VersionAppResponse> {
    return this.http
      .put<VersionAppResponse>(
        `${AppConfig.APIREST_URL}/api/AppServices/ActualizarVersion/${version.id}`,
        {
          id: version.id,
          version_Android: version.version_Android,
          version_IOs: version.version_IOs,
          version_Huawei: version.version_Huawei,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
