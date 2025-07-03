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
  fecha: Date;
  eventoId: number;
  nombreEvento: null;
  categoria_ActividadesId: number;
  nombreCategoriaAct: null;
  convencionistasIds: number[];
}
