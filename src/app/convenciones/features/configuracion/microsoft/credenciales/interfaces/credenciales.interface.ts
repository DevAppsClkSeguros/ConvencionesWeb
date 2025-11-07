export interface CredencialesResponse {
  response: Credencial;
  status:   boolean;
  message:  string[];
}

export interface Credencial {
  id:           number;
  tenantId:     string;
  clientId:     string;
  scope:        string;
  grantType:    string;
  clientSecret: string;
  userId:       string;
  email:        string;
}
