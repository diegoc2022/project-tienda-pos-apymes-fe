import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataFacturaDian {
  private URL?: string;
  private API?: string

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'facturar-fe';
  }

  funt_envia_factura_dian_s(data: any[]): Observable<any[]> {
    console.log("Data: ", data);


    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any[]>(`${this.URL}/${this.API}`, data, {
      headers
    });
  }
}
