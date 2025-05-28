export interface ConvencionistasResponse {
  response: Convencionista[];
  status:   boolean;
  message:  string[];
}

export interface Convencionista {
  id: number;
  clave: string;
  nombreCompleto: string;
  puesto: string;
  telefono: string;
  imagen: string;
  url: string;
  documento: string;
  perfilConvencionistaId: number;
  categoriaUsuarioId: number;
  eventoId: number;
  nombreEvento: string;
}

