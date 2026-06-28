import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MedioDePago {
  private URL?: string;
  private API?: string

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'medio-de-pago';
  }

  funt_retorna_medio_de_pago_s() {
    return this.http.get(`${this.URL}/${this.API}`);
  }
}
