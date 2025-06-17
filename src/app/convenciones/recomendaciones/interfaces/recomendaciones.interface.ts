export interface RecomendacionesResponse {
  response: Recomendacion[];
  status:   boolean;
  message:  string[];
}

export interface Recomendacion {
  id:                        number;
  titulo:                    string;
  informacion:               string;
  latitud:                   string;
  longitud:                  string;
  imagen:                    string;
  url:                       string;
  eventoId:                  number;
  categoria_RecomendacionId: number;
}
