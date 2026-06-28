import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientesFeService {
  private URL: string;
  private API: string;
  private API2: string;
  private API3: string;
  private API4: string;
  private API5: string;
  private API6: string;

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint
    this.API = 'tipo-documento';
    this.API2 = 'municipio';
    this.API3 = 'tipo-organizacion';
    this.API4 = 'tipo-regimen';
    this.API5 = 'tipo-responsabilidad';
    this.API6 = 'clientes-fe';
  }

  funct_retorna_tipo_identificacion_s() {
    return this.http.get(`${this.URL}/${this.API}`);
  }

  funct_retorna_municipio_s() {
    return this.http.get(`${this.URL}/${this.API2}`);
  }

  funct_retorna_tipo_organizacion_s() {
    return this.http.get(`${this.URL}/${this.API3}`);
  }

  funct_retorna_tipo_regimen_s() {
    return this.http.get(`${this.URL}/${this.API4}`);
  }

  funct_retorna_tipo_responsabilidad_s() {
    return this.http.get(`${this.URL}/${this.API5}`);
  }

  funct_registra_clientes_fe_s(data: any[]) {
    return this.http.post(`${this.URL}/${this.API6}`, data);
  }

  funct_retorna_one_cliente_s(ident: any) {
    return this.http.get(`${this.URL}/${this.API6}/${ident}`);
  }

  funct_retorna_all_clientes_fe_s() {
    return this.http.get(`${this.URL}/${this.API6}`);
  }


}
