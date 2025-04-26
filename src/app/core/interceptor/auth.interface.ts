export interface LoginResp {
  token: string /* …otros campos si hay*/;
}
export interface RenewResp {
  token: string;
}
export interface Login {
  token:      string;
  expiracion: Date;
  status:     boolean;
  message:    string[];
}

