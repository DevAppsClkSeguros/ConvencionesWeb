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
  eventoId: number;
  nombreEvento: string;
  perfilNombreId?: number;
  perfilNombre: string;
  categoriaNombreId?: number;
  categoriaNombre: string;
  activo: boolean;
}

