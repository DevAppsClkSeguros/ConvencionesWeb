export class AppConfig {
  public static APIREST_URL: string =
    'https://dev.developmentservices.com.mx/ApisConvenciones';

  public static getCommonHeadersRest() {
    return {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer ' +
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOb21icmVVc3VhcmlvIjoiUHJpRGV2Iiwicm9sZSI6IkFkbWluMkFjdHVhbGl6YWRvIiwiZXhwIjoxNzQ2MzgwMjczfQ.9C-1AsVFzqIVCKTxFFtTT2IoQRR9bFmAc4g5qzeeFB4',
    };
  }
}
