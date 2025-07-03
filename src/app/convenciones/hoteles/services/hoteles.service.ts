import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { AppConfig } from '@shared/app-config';
import type { Hotel, HotelesResponse } from '../interfaces/hoteles.interface';

@Injectable({ providedIn: 'root' })
export class HotelesService {
  private http = inject(HttpClient);

  obtieneHoteles(): Observable<HotelesResponse> {
    return this.http
      .get<HotelesResponse>(`${AppConfig.APIREST_URL}/api/Hotel/GetHoteles`)
      .pipe(catchError(AppConfig.handleErrors));
  }

  obtieneHotel(hotelId: number): Observable<HotelesResponse> {
    return this.http
      .get<HotelesResponse>(
        `${AppConfig.APIREST_URL}/api/Hotel/GetHotelXEvento/${hotelId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  nuevoHotel(hotel: Hotel): Observable<HotelesResponse> {
    return this.http
      .post<HotelesResponse>(`${AppConfig.APIREST_URL}/api/Hotel/NuevoHotel`, {
        nombreHotel: hotel.nombreHotel,
        telefono: hotel.telefono,
        direccion: hotel.direccion,
        latitud: hotel.latitud,
        longitud: hotel.longitud,
        imagen: hotel.url,
        eventoId: hotel.eventoId,
      })
      .pipe(catchError(AppConfig.handleErrors));
  }

  actualizaHotel(hotel: Hotel): Observable<HotelesResponse> {
    return this.http
      .put<HotelesResponse>(
        `${AppConfig.APIREST_URL}/api/Hotel/ActualizarHotel/${hotel.id}`,
        {
          nombreHotel: hotel.nombreHotel,
          telefono: hotel.telefono,
          direccion: hotel.direccion,
          latitud: hotel.latitud,
          longitud: hotel.longitud,
          imagen: hotel.url,
          eventoId: hotel.eventoId,
        }
      )
      .pipe(catchError(AppConfig.handleErrors));
  }

  eliminaHotel(HotelId: number): Observable<HotelesResponse> {
    return this.http
      .delete<HotelesResponse>(
        `${AppConfig.APIREST_URL}/api/Hotel/${HotelId}`
      )
      .pipe(catchError(AppConfig.handleErrors));
  }
}
