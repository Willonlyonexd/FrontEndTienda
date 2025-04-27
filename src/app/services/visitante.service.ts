import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisitanteService {
  public url = GLOBAL.url;
  public eventCart = new EventEmitter();

  constructor(private _http: HttpClient) {}

  createClienteTienda(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + '/createClienteTienda', data, { headers });
  }

  loginCliente(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + '/loginCliente', data, { headers });
  }

  verificacionCliente(token: any) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + '/verificacionCliente/' + token, { headers });
  }

  // ✅ Actualizado: admite filtros y paginación
  getProductosTienda(
    page: number = 1,
    limit: number = 10,
    genero?: string,
    categorias?: string,
    precio?: string
  ): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Construir la query string con los parámetros opcionales
    let query = `?page=${page}&limit=${limit}`;
    if (genero) query += `&genero=${genero}`;
    if (categorias) query += `&categorias=${categorias}`;
    if (precio) query += `&precio=${precio}`;

    // Llamar al backend con la URL construida
    return this._http.get(`${this.url}/getProductosTienda${query}`, { headers });
  }

  getCategoriasTienda(clasificacion: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + '/getCategoriasTienda/' + clasificacion, { headers });
  }

  getProductoTienda(slug: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + '/getProductoTienda/' + slug, { headers });
  }

  aplicarCupon(codigo: any, data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.put(this.url + '/aplicarCupon/' + codigo, data, { headers });
  }

  eventoCarrito() {
    this.eventCart.emit(true);
  }
}
