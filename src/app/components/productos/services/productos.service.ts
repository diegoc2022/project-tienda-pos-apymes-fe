import { Injectable } from '@angular/core';
import Environment from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private URL?: string;
  private API?: string
  private API2?: string
  private API3?: string
  private API4?: string
  private API5?: string

  constructor(private http: HttpClient) {
    this.URL = Environment.endpoint;
    this.API = 'venta-producto';
    this.API2 = 'impuestos';
    this.API3 = 'categoria';
  }

  funct_retorna_productos(): Observable<any> {
    return this.http.get(`${this.URL}/${this.API}`)
  }

  funct_elimina_productos_s(data: any): Observable<any> {
    return this.http.delete(`${this.URL}/${this.API}/${data}`)
  }

  funct_retorna_producto_x_codigo(data: any[]) {
    return this.http.post<any>(`${this.URL}/${this.API}`, data)
  }

  funct_crea_productos(data: any[]) {
    return this.http.post(`${this.URL}/${this.API}`, data);
  }

  funct_edita_codigo_nombre_productos_s(data: any) {
    return this.http.patch(`${this.URL}/${this.API}/codigo/${data.codInicial}`, {
      "codProd": data.codNuevo.toUpperCase(),
      "descripcion": data.nombreProd.toUpperCase()
    });
  }

  funct_edita_precio_ventas_s(cod: any, data: any) {
    return this.http.patch(`${this.URL}/${this.API}/precioVentas/${cod}`, {
      "precio_venta": data
    });
  }

  funct_edita_precio_compras_s(cod: any, data: any) {
    return this.http.patch(`${this.URL}/${this.API}/precioCompras/${cod}`, {
      "precio_compra": data
    });
  }

  funct_ajusta_inventario_s(cod: any, data: any) {
    let cant = parseInt(data);
    return this.http.patch(`${this.URL}/${this.API}/cantidad/${cod}`, {
      "existencia": cant
    });
  }

  funct_retorna_impuestos(): Observable<any> {
    return this.http.get(`${this.URL}/${this.API2}`)
  }

  funct_retorna_categoria(): Observable<any> {
    return this.http.get(`${this.URL}/${this.API3}`)
  }



}
