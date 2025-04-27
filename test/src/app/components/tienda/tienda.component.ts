import { Component } from '@angular/core';
import { VisitanteService } from '../../services/visitante.service';
import { GLOBAL } from '../../services/GLOBAL';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent {
  public url=GLOBAL.url
  public productos:Array<any>=[]
  public ordenarPor='Defecto'
  public producto_const:Array<any>=[]
  public categorias:Array<any>=[]
  public genero='Todos'
  public queryCategorias:Array<any>=[]
  public precio=''
  public tenant=''
  constructor(
    private _visitanteService: VisitanteService,
    private _router: Router,
    private _route: ActivatedRoute
  
  ){ }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params=>{
     if(params['ordenarPor']){
      this.ordenarPor=params['ordenarPor']
     }
     if(params['genero']){
      this.genero=params['genero']
      this.initCategoria()
     }
     if(params['categorias']){
      this.queryCategorias=params['categorias'].split(',')
     }
     if(params['precio']){
      this.precio=params['precio'].split(',')
     }
     this.initData()
     
    })
  }

  initData(){
    this._visitanteService.getProductosTienda().subscribe(
      response=>{
        
        this.productos=response.data
        console.log(this.productos)
        this.producto_const=response.data
        this.initOrden()
        this.initFiltro()
      },
      error=>{
        console.log(error)
      }
    )
  }


  setOrdenarPor(ordenarPor:any){
    this.ordenarPor=ordenarPor
    this.redirect()

  }


  redirect(){
    this._router.navigate(['tienda'],{queryParams:{
      ordenarPor:this.ordenarPor,
      genero:this.genero,
      categorias:this.queryCategorias.join(','),
      precio:this.precio
    }})
  }

  initOrden(){
    if(this.ordenarPor=='A-Z'){
      this.producto_const.sort((a:any,b:any)=>a.titulo.localeCompare(b.titulo))
     }
     if(this.ordenarPor=='Z-A'){
       this.producto_const.sort((a:any,b:any)=>b.titulo.localeCompare(a.titulo))
     }
     if(this.ordenarPor=='Precio menor'){
       this.producto_const.sort((a:any,b:any)=>a.precio-b.precio)
     }
     if(this.ordenarPor=='Precio mayor'){
       this.producto_const.sort((a:any,b:any)=>b.precio-a.precio)
     }
  }

  setFiltro(tipo:any,value:any){
    if(tipo=='Genero'){
      this.genero=value
     this.redirect()
    }else if(tipo=='Precio'){
      this.redirect()
    }
  }


  setCategoria(){
    this.queryCategorias=this.categorias.filter(item=>item.seleccion==true).map(item=>item._id)
    this.redirect()
  }

  initFiltro(){
    let arr_uno=[]
    if(this.genero=='Todos'){
      arr_uno=this.producto_const
    }else{
      arr_uno=this.producto_const.filter(item=>item.clasificacion==this.genero)
    this.productos=arr_uno
    }

    let arr_dos=[]

   if(this.queryCategorias.length>=1){
    for(let item of arr_uno){
      const arr = this.queryCategorias.filter(subitem=>subitem==item.categoria._id)
      if(arr.length>0){
        arr_dos.push(item)
      }
    }

   }else{
    arr_dos=arr_uno
   }

   let arr_tres=[]

   if(!this.precio){
      arr_tres=arr_dos
   }else{
    if(this.precio=='BOB10.00 - BOB49.00'){
      arr_tres=arr_dos.filter(item=>item.precio>=10 && item.precio<=49)
    }else if(this.precio=='BOB50.00 - BOB99.00'){
      arr_tres=arr_dos.filter(item=>item.precio>=50 && item.precio<=99)
    }else if(this.precio=='BOB100.00 - BOB199.00'){
      arr_tres=arr_dos.filter(item=>item.precio>=100 && item.precio<=199)
    }else if(this.precio=='BOB200.00 a mas'){
      arr_tres=arr_dos.filter(item=>item.precio>=200)
    }
   }

    this.productos=arr_tres
  }

  initCategoria(){
    this._visitanteService.getCategoriasTienda(this.genero).subscribe(
      response=>{
        
        this.categorias=response.data
        if(this.queryCategorias.length==0){
          for(let item of this.categorias){
            item.seleccion=true
          }  
        }else{
          for(let item of this.categorias){
            for(let id of this.queryCategorias){
              if(item._id==id){
                item.seleccion=true
              }
          }
        
        }
      }
       this.setCategoria()
      },
      error=>{
        console.log(error)
      }
    )
  }

  seleccion(event:any,idx:any){

    this.categorias[idx].seleccion=event.target.checked
   
  }
  
  selectPrecio(event:any){
  

    let chks=document.querySelectorAll('.chk-precio')
    chks.forEach((element:any)=>{
       if(element.value!=event.target.value){
        if(element.checked){
          element.checked=false
        }
       }
    })
    this.precio=event.target.value
  }

}
