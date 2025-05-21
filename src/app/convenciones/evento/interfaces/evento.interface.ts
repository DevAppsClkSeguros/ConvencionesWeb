export interface ConvencionResponse {
  response: Convencion[];
  status: boolean;
  message: string[];
}

export interface Convencion {
  id:               string;
  nombreConvencion: string;
  subtitulo:        string;
  activo:           boolean;
  fecha_inicio:     Date;
  fecha_fin:        Date;
  imagen:           string;
  direccion:        string;
  latitud:          string;
  longitud:         string;
  lugarDestino:     string;
}
