export interface PreguntasResponse {
  response: Pregunta[];
  status: boolean;
  message: string[];
}

export interface Pregunta {
  id: number;
  texto: string;
}

export interface RespuestasResponse {
  preguntaId: number;
  texto:      string;
  respuestas: Respuesta[];
}

export interface Respuesta {
  preguntaId:           number;
  eventoId:             number;
  convencionistaId:     number;
  claveConvencionista:  string;
  nombreConvencionista: string;
  comentario:           string;
  calificacion:         number;
}
