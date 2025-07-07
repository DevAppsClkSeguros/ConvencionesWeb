import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { environment } from 'src/environments/environment'

export class AppConfig {
  public static APIREST_URL: string = environment.apiUrl;

  public static APIREST_MICROSOFT: string =
    'https://graph.microsoft.com/v1.0/users/';

  public static idTokenMS: string = '';

  public static handleErrors(error: HttpErrorResponse) {
    console.log(JSON.stringify(error));
    return throwError(() => new Error(error.message));
  }
}
