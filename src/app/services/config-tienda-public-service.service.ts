import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigTiendaPublicServiceService {

 public url = GLOBAL.url;

  constructor(private _http: HttpClient) { }

  getConfiguracionTienda(): Observable<any> {
    return this._http.get(`${this.url}/config-tienda-public`);
  }

  // Obtener el contacto de la tienda
  getContactoTienda(): Observable<any> {
    return this._http.get(`${this.url}/contacto-public`);
  }
}
