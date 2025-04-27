import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  public url=GLOBAL.url
  constructor(
    private _http:HttpClient
  ){}

  addProductoCarrito(data:any,token:any):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json').set('Autorization',token)
    return this._http.post(this.url+'/addProductoCarrito',data,{headers:headers})
  }

  getCarritoCliente(token:any):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json').set('Autorization',token)
    return this._http.get(this.url+'/getCarritoCliente',{headers:headers})
  }

  deleteProductoCarrito(id:any,token:any):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json').set('Autorization',token)
    return this._http.delete(this.url+'/deleteProductoCarrito/'+id,{headers:headers})
  }


  updateCantidadProductoCarrito(id:any,data:any,token:any):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json').set('Autorization',token)
    return this._http.put(this.url+'/updateCantidadProductoCarrito/'+id,data,{headers:headers})
  }

  createVentaCliente(data:any,token:any):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json').set('Autorization',token)
    return this._http.post(this.url+'/createVentaCliente',data,{headers:headers})
  }

  getVentasCliente(id:any,token:any):Observable<any>{
    let headers= new HttpHeaders().set('Content-Type','application/json').set('Autorization',token)
    return this._http.get(this.url+'/getVentasCliente/'+id,{headers:headers})
  }
}
