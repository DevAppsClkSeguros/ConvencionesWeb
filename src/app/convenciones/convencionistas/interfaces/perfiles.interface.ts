export interface PerfilesResponse {
  response: Perfil[];
  status:   boolean;
  message:  string[];
}

export interface Perfil {
  id:     number;
  nombre: string;
  activo: boolean;
}
