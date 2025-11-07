export interface ActividadesResponse {
  response: Actividad[];
  status:   boolean;
  message:  string[];
}

export interface Actividad {
  id: number;
  titulo: string;
  subtitulo: string;
  especificaciones: string;
  imagen: string;
  url: string;
  fecha: Date;
  eventoId: number;
  nombreEvento: null;
  categoria_ActividadesId: number;
  nombreCategoriaAc: null;
  convencionistasIds: number[];
}
