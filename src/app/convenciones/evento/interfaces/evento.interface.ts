export interface EventoResponse {
  response: Evento[];
  status:   boolean;
  message:  string[];
}

export interface Evento {
  nombreConvencion: string;
  subtitulo:        string;
  fecha_inicio:     Date;
  fecha_fin:        Date;
  imagen:           string;
  direccion:        string;
  latitud:          string;
  longitud:         string;
  lugarDestino:     string;
}
