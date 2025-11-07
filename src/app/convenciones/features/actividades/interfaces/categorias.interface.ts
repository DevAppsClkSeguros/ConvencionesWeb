export interface CategoriasResponse {
  response: Categoria[];
  status:   boolean;
  message:  string[];
}

export interface Categoria {
  id:     number;
  nombre: string;
  activo: boolean;
}
