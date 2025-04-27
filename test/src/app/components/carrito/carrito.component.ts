import { Component } from '@angular/core';
import { VisitanteService } from '../../services/visitante.service';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { GLOBAL } from '../../services/GLOBAL';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {

  public user :any=JSON.parse(localStorage.getItem('cliente')!);
  public token = localStorage.getItem('token');
  public carrito:Array<any>=[];
  public loadCarrito=true;
  public total=0
  public url=GLOBAL.url
  constructor(
    private _visitanteService: VisitanteService,
    private _clienteService: ClienteService,
    private _router: Router
  ){}

  ngOnInit(){
    this.initCarrito();

    this._visitanteService.eventCart.subscribe(response =>{
      this.initCarrito();
    })
  }

  initCarrito(){
    this.loadCarrito=true;
    if(this.user==null){
      if(localStorage.getItem('carrito')){
        this.carrito=JSON.parse(localStorage.getItem('carrito')!);
      }else{
        this.carrito=[];
      }
      this.calcularTotal()
    }else{
      this._clienteService.getCarritoCliente(this.token).subscribe(
        response=>{
          console.log("hola")
          this.carrito=response.data;
         console.log(this.carrito)
         this.calcularTotal()
          this.loadCarrito=false;
        },
        error=>{
          console.log(<any>error)
        }
      )
    }
    console.log(this.carrito)
    
  }


  calcularTotal(){
    this.total=0
    if(this.user==null){
      for(const item of this.carrito){
        this.total+=item.precio*item.cantidad
      }
  }else{
    for(const item of this.carrito){
      this.total+=item.producto_variedad.precio*item.cantidad
    }
  
  }
}


quitProductoCarrito(value:any){
  if(this.user==null){
    this.carrito.splice(value,1)
   localStorage.removeItem('carrito')
   localStorage.setItem('carrito',JSON.stringify(this.carrito))
    this.calcularTotal()
    this._visitanteService.eventoCarrito()
  }else{
    this._clienteService.deleteProductoCarrito(value,this.token).subscribe(
      response=>{
        
        if(response.data!=undefined){
          this._visitanteService.eventoCarrito()
          this.initCarrito()
        }else{

        }
      },
      error=>{
        console.log(error)
      }
    )
  }
}

updateCantidadVisitantes(idx:any,value:any){
  this.carrito[idx].cantidad=value
  localStorage.removeItem('carrito')
  localStorage.setItem('carrito',JSON.stringify(this.carrito))
  this.calcularTotal()
  this._visitanteService.eventoCarrito()
}


updateCantidadCliente(id:any,cantidad:any){
  console.log(id,cantidad)
  this._clienteService.updateCantidadProductoCarrito(id,{cantidad:cantidad},this.token).subscribe(
    response=>{
      if(response.data!=undefined){
        
        this.initCarrito()
        this._visitanteService.eventoCarrito()
      }

    })
}

}
