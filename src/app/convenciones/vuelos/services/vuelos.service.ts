import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import { HttpClient } from '@angular/common/http';
import type { VuelosResponse, Vuelo } from '../interfaces/vuelos.interface';

@Injectable({ providedIn: 'root' })
export class VuelosService {
  private http = inject(HttpClient);

  obtieneVuelos(): Observable<VuelosResponse> {
    return this.http
      .get<VuelosResponse>(`${AppConfig.APIREST_URL}/api/Vuelos/ListadoVuelos`)
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneVuelo(vueloId: number): Observable<VuelosResponse> {
    return this.http
      .get<VuelosResponse>(
        `${AppConfig.APIREST_URL}/api/Vuelos/DetallesVuelo${vueloId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevoVuelo(vuelo: Vuelo): Observable<VuelosResponse> {
    return this.http
      .post<VuelosResponse>(`${AppConfig.APIREST_URL}/api/Vuelos/NuevoVuelo`, {
        id: vuelo.id,
        fecha_Vuelo: vuelo.fecha_Vuelo,
        reservacion: vuelo.reservacion,
        numero_Vuelo: vuelo.numero_Vuelo,
        asiento: vuelo.asiento,
        origen: vuelo.origen,
        lugar_Origen: vuelo.lugar_Origen,
        hora_Salida: vuelo.hora_Salida,
        destino: vuelo.destino,
        lugar_Destino: vuelo.lugar_Destino,
        hora_Llegada: vuelo.hora_Llegada,
        detalle: vuelo.detalle,
        eventoId: vuelo.eventoId,
        convencionistasIds: vuelo.convencionistasIds,
      })
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaVuelo(vuelo: Vuelo): Observable<VuelosResponse> {
    return this.http
      .post<VuelosResponse>(
        `${AppConfig.APIREST_URL}/api/Vuelos/ActualizarVuelo${vuelo.id}`,
        {
          id: vuelo.id,
          fecha_Vuelo: vuelo.fecha_Vuelo,
          reservacion: vuelo.reservacion,
          numero_Vuelo: vuelo.numero_Vuelo,
          asiento: vuelo.asiento,
          origen: vuelo.origen,
          lugar_Origen: vuelo.lugar_Origen,
          hora_Salida: vuelo.hora_Salida,
          destino: vuelo.destino,
          lugar_Destino: vuelo.lugar_Destino,
          hora_Llegada: vuelo.hora_Llegada,
          detalle: vuelo.detalle,
          eventoId: vuelo.eventoId,
          convencionistasIds: vuelo.convencionistasIds,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaVuelo(vueloId: number): Observable<VuelosResponse> {
    return this.http
      .delete<VuelosResponse>(`${AppConfig.APIREST_URL}/api/Vuelos/${vueloId}`)
      .pipe(catchError(AppConfig.handleErrors));
  }
}
