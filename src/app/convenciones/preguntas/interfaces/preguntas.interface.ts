export interface PreguntasResponse {
  response: Pregunta[];
  status: boolean;
  message: string[];
}

export interface Pregunta {
  id: number;
  texto: string;
}
