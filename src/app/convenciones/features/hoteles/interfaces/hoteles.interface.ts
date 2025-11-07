export interface ApiResponse<T> {
  response: T;
  status: boolean;
  message: string[];
}

export interface Hotel {
  id:                 number;
  nombreHotel:        string;
  telefono:           string;
  direccion:          string;
  latitud:            string;
  longitud:           string;
  imagen:             string;
  eventoId:           number;
  nombreEvento:       string;
  url:                string;
  detalles:           string;
  convencionistasIds: number[];
}

export type HotelesResponse = ApiResponse<Hotel[]>;
export type HotelResponse = ApiResponse<Hotel>;
