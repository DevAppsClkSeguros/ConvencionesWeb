export interface Evento {
  response: Response[];
  status:   boolean;
  message:  string[];
}

export interface Response {
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
