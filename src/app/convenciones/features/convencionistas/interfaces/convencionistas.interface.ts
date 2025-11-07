export interface ApiResponse<T> {
  response: T;
  status: boolean;
  message: string[];
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

export interface Paginado {
  totalRegistros: number;
  paginaActual: number;
  tamanoPagina: number;
  totalPaginas: number;
  listado: Convencionista[];
}

export type ConvencionistasResponse = ApiResponse<Convencionista[]>;
export type ConvencionistaResponse = ApiResponse<Convencionista>;
export type ConvencionistasResponsePaginado = ApiResponse<Paginado>;
