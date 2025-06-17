export interface VuelosResponse {
  response: Vuelo[];
  status:   boolean;
  message:  string[];
}

export interface Vuelo {
  id:                 number;
  fecha_Vuelo:        Date;
  reservacion:        string;
  numero_Vuelo:       string;
  asiento:            string;
  origen:             string;
  lugar_Origen:       string;
  hora_Salida:        string;
  destino:            string;
  lugar_Destino:      string;
  hora_Llegada:       string;
  detalle:            string;
  eventoId:           number;
  convencionistasIds: number[];
}
