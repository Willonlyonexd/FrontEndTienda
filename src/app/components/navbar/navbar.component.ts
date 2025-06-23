import { Component } from '@angular/core';
import { GLOBAL } from '../../services/GLOBAL';
import { VisitanteService } from '../../services/visitante.service';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';
import { ConfigTiendaPublicServiceService } from '../../services/config-tienda-public-service.service';
declare var $:any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  public user = JSON.parse(localStorage.getItem('cliente') || 'null');
  public token = localStorage.getItem('token');
  public carrito:Array<any>=[];
  public url=GLOBAL.url;
  public loadCarrito=false;
  public total=0;

  // Nuevas propiedades para el logo
  public logo: string | null = null;
  public loadingLogo = true;

  constructor(
    private _visitanteService: VisitanteService,
    private _clienteService: ClienteService,
    private _router: Router,
    private _configTiendaService: ConfigTiendaPublicServiceService
  ){}

  ngOnInit(){
    this.initCarrito();
    this.cargarLogo(); // Cargar el logo

    this._visitanteService.eventCart.subscribe(response =>{
      this.initCarrito();
    });
  }

  // Nuevo método para cargar el logo
  cargarLogo() {
    this._configTiendaService.getConfiguracionTienda().subscribe(
      response => {
        console.log('Configuración tienda (navbar):', response);
        if (response.success && response.logo) {
          this.logo = this.url + '/getLogo/' + response.logo;
          console.log('Logo URL:', this.logo);
        }
        this.loadingLogo = false;
      },
      error => {
        console.error('Error al cargar el logo:', error);
        this.loadingLogo = false;
      }
    );
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
         this.calcularTotal()
          this.loadCarrito=false;
        },
        error=>{
          console.log(<any>error)
        }
      )
    }

  }

  logout(){
    localStorage.removeItem('cliente');
    localStorage.removeItem('token');
    localStorage.removeItem('carrito')
    this.user=null;
    this._router.navigate(['/'])
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


redirectCarrito(route:any){
  this._router.navigate([route]).then(()=>{

    setTimeout(() => {
      $('#modalShoppingCart').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      $('body').css('padding-right', '0px')
      $('body').css('overflow', 'auto')
    }, 50);

  })
}

}
