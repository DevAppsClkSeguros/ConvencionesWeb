export interface ConvencionistasResponse {
  response: Convencionista[];
  status: boolean;
  message: string[];
}

export interface Convencionista {
  nombreConvencion: string;
  subtitulo: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  imagen: string;
  direccion: string;
  latitud: string;
  longitud: string;
  lugarDestino: string;
}
