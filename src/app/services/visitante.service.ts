import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisitanteService {
  public url=GLOBAL.url
  public eventCart=new EventEmitter();
  constructor(
    private  _http: HttpClient
  ) {}

  createClienteTienda(data:any,):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json')
    return this._http.post(this.url+'/createClienteTienda',data,{headers:headers})
  }

  loginCliente(data:any):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json')
    return this._http.post(this.url+'/loginCliente',data,{headers:headers})
  }

  verificacionCliente(token:any){
    let headers= new HttpHeaders().set('Content-Type','application/json')
    return this._http.get(this.url+'/verificacionCliente/'+token,{headers:headers})
  }


  getProductosTienda(page: number, limit: number ):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json')
    let params = new HttpParams()
    .set('page', page)
    .set('limit', limit);
    return this._http.get(this.url+'/getProductosTienda/',{headers:headers,params: params})
  }

  getCategoriasTienda(clasificacion:any):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json')
    return this._http.get(this.url+'/getCategoriasTienda/'+clasificacion,{headers:headers})
  }

  getProductoTienda(slug:any):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json')
    return this._http.get(this.url+'/getProductoTienda/'+slug,{headers:headers})
  }

  aplicarCupon(codigo:any,data:any):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json')
    return this._http.put(this.url+'/aplicarCupon/'+codigo,data,{headers:headers})
  }

  eventoCarrito(){
    this.eventCart.emit(true)
  }


  getProductosPopulares():Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json')
    return this._http.get(this.url+'/api/recomendaciones/populares',{headers:headers})
  }

  getProductoPopularPorCliente(cliente_id:any):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json')
    return this._http.get(this.url+'/api/recomendaciones/'+cliente_id,{headers:headers})
  }

  obtenerProductosPorArrayDeIds(data:any):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json')
    return this._http.post(this.url+'/getProductosByArrayId',data,{headers:headers})
  }

}
