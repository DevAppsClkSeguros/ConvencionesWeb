export interface DatosAutenticacion {
  tenantId?: string;
  clientId?: string;
  scope?: string;
  grantType?: string;
  clientSecret?: string;
  userId?: string;
  email?: string;
}

export interface CredencialesMicrosoft {
  Error_Existe?: boolean;
  MensajeError?: string | null;
  KeyEncrypted?: string | null;
  Id?: number;
  tenantId?: string;
  clientId?: string;
  scope?: string;
  grantType?: string;
  clientSecret?: string;
  userId?: string;
  email?: string;
}

export interface ConvencionesPorUsuario {
  ExisteError: boolean;
  Mess: string;
  Response: Convenciones[];
}

export interface Convenciones {
  Id: number;
  Titulo: string;
  SubTitulo: string;
}
