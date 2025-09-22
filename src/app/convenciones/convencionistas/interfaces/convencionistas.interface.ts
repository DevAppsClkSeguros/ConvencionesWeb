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
  perfilId?: number;
  perfilNombre: string;
  categoriaId?: number;
  categoriaNombre: string;
  activo: boolean;
  seleccionado?: boolean;
}

export interface ConvencionistasResponsePaginado {
  response: Paginado;
  status:   boolean;
  message:  string[];
}

export interface Paginado {
  totalRegistros: number;
  paginaActual:   number;
  tamanoPagina:   number;
  totalPaginas:   number;
  listado:        Convencionista[];
}

