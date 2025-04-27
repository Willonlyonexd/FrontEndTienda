import { Component } from '@angular/core';
import { VisitanteService } from '../../services/visitante.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from '../../services/GLOBAL';
import { ClienteService } from '../../services/cliente.service';
declare var Flickity: any;
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {

  public slug:any
  public producto:any={}
  public variciones:Array<any>=[]
  public galeria:Array<any>=[]
  url=GLOBAL.url
  public btnLoad=true
  public user:any=JSON.parse(localStorage.getItem('cliente')!)
  public token = localStorage.getItem('token')
  public variacion:any={}
  public cantidad=1
  public mensaje:any={
    texto:''
  }
  public variacionSeleccionada :any=undefined
  constructor(

    private _visitanteService: VisitanteService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _clienteService: ClienteService

  ) { }



  ngOnInit(){
    this._route.params.subscribe(params=>{
      this.slug=params['slug']
      this.initProducto() 
    })
   setTimeout(() => {
    const elementSlider= document.getElementById('productSlider')
    
    new Flickity(elementSlider,{
      "draggable": false,
      "fade": true,
      "pageDots": false,
    })

    const elementNav= document.querySelector('.flickity-nav')

    
    new Flickity(elementNav,{
      "asNavFor": "#productSlider", "contain": true, "wrapAround": false, "pageDots": false,
      "prevNextButtons": false,
      "draggable": false,
      "cellAlign": "left",
    })

   }, 3000);
    
   
  }


  initProducto(){
    console.log(this.slug)
    this.btnLoad=true
    this._visitanteService.getProductoTienda(this.slug).subscribe(
      response=>{
        console.log(response)
        this.producto=response.data.producto
        this.variciones=response.data.variaciones
        if(this.variciones.length>0){
          this.variacionSeleccionada=this.variciones[0]
          this.variacion=this.variacionSeleccionada
        }
        
        this.galeria=response.data.galeria
        this.btnLoad=false
      },
      error=>{
        console.log(error)
      }
    )
  }

  addCarritoNoUser(){
    const arrCarrito=JSON.parse(localStorage.getItem('carrito')!)
    const producto={
      producto:this.producto._id,
      producto_variedad:this.variacion._id,
      cantidad:this.cantidad,
      portada:this.producto.portada,
      titulo:this.producto.titulo,
      variedad:this.variacion.color+' '+this.variacion.talla,
      color:this.variacion.color,
      talla:this.variacion.talla,
      precio:this.variacion.precio,
      slug:this.producto.slug
    }

    if(arrCarrito==null){
      const carrito=[]
      carrito.push(producto)
      localStorage.setItem('carrito',JSON.stringify(carrito))
    }else{
      const carrito=JSON.parse(localStorage.getItem('carrito')!)
      carrito.push(producto)
      localStorage.removeItem('carrito')
      localStorage.setItem('carrito',JSON.stringify(carrito))
    }

    this.mensaje.texto='Producto añadido al carrito'
          this.mensaje.tipo=1
    this._visitanteService.eventoCarrito()
  }


  seleccionVariacion(variacion:any){
    this.variacionSeleccionada=variacion
    this.variacion=variacion
    
  }

  addCarritoUser(){
    console.log(this.variacion)
    
    if(!this.variacion){
      this.mensaje.texto='Seleccione una variación'
      this.mensaje.tipo=2
    }{
      if(this.variacion.cantidad<this.cantidad){
      this.mensaje.texto='La cantidad seleccionada supera el stock'
      this.mensaje.tipo=2
    }else{
      const producto={
        producto:this.producto._id,
        producto_variedad:this.variacion._id,
        cantidad:this.cantidad,
        
      }
  
      this._clienteService.addProductoCarrito(producto,this.token).subscribe(
        response=>{
          
          if(response.data!=undefined){
            this.mensaje.texto='Producto añadido al carrito'
            this.mensaje.tipo=1
            this._visitanteService.eventoCarrito()
          }else{
            this.mensaje.texto=response.message
            this.mensaje.tipo=2
          }
          
        },
        error=>{
          this.mensaje.texto='Error al añadir el producto al carrito'
            this.mensaje.tipo=2
          console.log(error)
        }
      )
  
    }
  }
}
}
