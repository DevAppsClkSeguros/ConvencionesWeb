export interface MicrosoftTokenResponse {
  response: Response;
  status: boolean;
  message: string[];
}

export interface Response {
  tokenType:    string;
  expiresIn:    number;
  extExpiresIn: number;
  accessToken:  string;
}
