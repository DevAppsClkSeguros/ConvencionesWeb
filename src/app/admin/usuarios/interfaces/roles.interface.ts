export interface RolesResponse {
  response: Rol[];
  status:   boolean;
  message:  string[];
}

export interface Rol {
  id:               string;
  name:             string;
  normalizedName:   string;
  concurrencyStamp: null | string;
}
