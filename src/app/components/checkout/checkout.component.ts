import { Component } from '@angular/core';
import { GLOBAL } from '../../services/GLOBAL';
import { ClienteService } from '../../services/cliente.service';
import { VisitanteService } from '../../services/visitante.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var paypal:any
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

 
  public envio=0
  public user :any=JSON.parse(localStorage.getItem('cliente')!);
  public token = localStorage.getItem('token');
  public carrito:Array<any>=[];
  public loadCarrito=true;
  public total=0
  public subtotal=0
  public url=GLOBAL.url
  public direcciones:any = [];
  direccion_selected:any = {};
  public msm_errorVenta = '';

  public venta:any={};
  public detalles:Array<any>=[];

  public codigo:any=''
  public cupon:any={}
  public msmCupon=''
  public descuento=0



  constructor(
    private _visitanteService: VisitanteService,
    private _clienteService: ClienteService,
    private _router: Router,
    private toastr: ToastrService
  ){
    this.venta.cliente=this.user._id;
  }

  ngOnInit(){
    //17 04 2025 se corrigo que al momento de ingresar al checkout permite moverse con libertar
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.classList.remove('modal-open', 'overflow-hidden');
    //----
    this.initCarrito();
    this.renderPaypalButton();
    
  }

 
  renderPaypalButton(){
    paypal.Buttons({

      
      createOrder: (data:any, actions:any)=> {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.total,
               
              }
            }] 
          })

      },

        // Call your server to finalize the transaction
        onApprove: (data:any, actions:any)=> {
          console.log(data);
          
          this.venta.detalles = this.detalles;
          console.log(this.venta);
          this._clienteService.createVentaCliente(this.venta,this.token).subscribe(
            response=>{
              console.log(response);
              
            }
          );
          
      },
  }).render('#paypal-button-container');
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
          this.carrito=response.data;
          console.log(this.carrito)
          for(const item of this.carrito){
            this.detalles.push({
              producto:item.producto._id,
              variedad:item.producto_variedad._id,
              cliente:this.user._id,
              cantidad:item.cantidad,
              precio:item.producto_variedad.precio
            })
          }

          console.log(this.detalles)

         this.calcularTotal()
          this.loadCarrito=false;
        },
        error=>{
          console.log(<any>error)
        }
      )
    }
    
    
  }

  calcularTotal(){
    this.subtotal=0
    if(this.user==null){
      for(const item of this.carrito){
        this.subtotal+=item.precio*item.cantidad
      }
  }else{
    for(const item of this.carrito){
      this.subtotal+=item.producto_variedad.precio*item.cantidad
    }
    
    this.total=this.subtotal
    
  }

  this.venta.total=this.total
}

  setEnvio(){
    console.log(this.envio)
    this.total=this.subtotal+parseFloat(this.envio.toString())
    this.venta.envio=this.envio
    this.venta.total=this.total
  }

  select_direccion(item:any){}


  pagar(){
    if(!this.venta.envio){
        this.msm_errorVenta='Seleccione un metodo de envio'
    }else{
      this.venta.detalles=this.detalles
    this._clienteService.createVentaCliente(this.venta,this.token).subscribe(
      response=>{
        console.log(response)
        this.toastr.success('Venta realizada con exito')
        this._router.navigate(['/cuenta',this.user._id])
       
      },
      error=>{
        console.log(<any>error)
      }
    )
  }
  
}

aplicarCupon(){
  const categorias:any=[]
  const productos:any=[]
  this.carrito.forEach(element=>{
    categorias.push(element.producto.categoria)
    productos.push(element.producto._id)
  })
  this._visitanteService.aplicarCupon(this.codigo,{total:this.total,categorias,productos}).subscribe(
    response=>{
      console.log(response)
      if(response.data!=undefined){
        this.cupon=response.data
        this.msmCupon=''
        this.descuento=(this.cupon.descuento/100)*this.total
        this.total=this.total-this.descuento
      }else{
        this.msmCupon=response.message
      }
  
    },
    error=>{
      console.log(<any>error)
    }
  )
}
}
