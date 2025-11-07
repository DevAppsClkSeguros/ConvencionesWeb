export interface UsuariosResponse {
  response: Usuario[];
  status:   boolean;
  message:  string[];
}

export interface Usuario {
  userName:      string;
  firstName:     null | string;
  lastName:      string;
  email:         string;
  fechaCreacion: Date;
  activo:        boolean;
  roles:         string[];
  password?:      string;
  newPassword?:    string;
}
