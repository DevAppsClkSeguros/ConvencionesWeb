export interface HotelesResponse {
  response: Hotel[];
  status:   boolean;
  message:  string[];
}

export interface Hotel {
  id:          number;
  nombreHotel: string;
  telefono:    string;
  direccion:   string;
  latitud:     string;
  longitud:    string;
  imagen:      string;
  eventoId:    number;
  url:         string;
}
