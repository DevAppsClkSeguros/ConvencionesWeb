export interface ApiResponse <T> {
  response: T;
  status: boolean;
  message: string[];
}

export interface Convencion {
  id: number;
  nombreEvento: string;
  subtitulo: string;
  activo: boolean;
  fecha_inicio: Date;
  fecha_fin: Date;
  imagen: string;
  url: string
  direccion: string;
  latitud: string;
  longitud: string;
  lugarDestino: string;
}

export type ConvencionesResponse = ApiResponse<Convencion[]>;
export type ConvencionResponse = ApiResponse<Convencion>;
