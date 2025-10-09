export interface LoginResp {
  token: string
}
export interface RenewResp {
  token: string;
}
export interface Login {
  response: Token;
  status:     boolean;
  message:    string[];
}

export interface Token {
  token: string;
  expiracion: Date;
}
