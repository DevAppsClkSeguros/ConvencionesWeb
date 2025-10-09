export interface ModulosResponse {
  response: Modulo[];
  status:   boolean;
  message:  string[];
}

export interface Modulo {
  id:              number;
  fMod:            Date;
  masterKey:       string;
  keyCode:         string;
  descripcion:     string;
  status:          boolean;
  idTypeResp:      number;
  message:         string;
  fStart:          Date;
  fStop:           Date;
  statusPopUp:     boolean;
  idTypeRespPopUp: number;
  messagePopUp:    string;
}
