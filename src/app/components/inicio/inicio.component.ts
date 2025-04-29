import { Component, OnInit, AfterViewInit } from '@angular/core';
import { VisitanteService } from '../../services/visitante.service';
import { GLOBAL } from '../../services/GLOBAL';
declare var Swiper: any;
declare var bootstrap: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit, AfterViewInit {

  public arrayIds: any;
  public arrayProductos: any[] = [];
  public arrayProductosPopulares: any[] = [];
public url=GLOBAL.url
  public clientearrayIds: any;
  public clientearrayProductos: any[] = [];
  public clientearrayProductosPopulares: any[] = [];
  public loadingHistorico: boolean = false;

  public cliente=localStorage.getItem('cliente') || null;

  constructor(
    private _visitanteService: VisitanteService,
  ) {}

  ngOnInit() {
    const swiper = new Swiper(".mySwiper", {

    });
    this.getProductosPopulares();
    if(this.cliente) {

      const clienteData = JSON.parse(this.cliente);
      this.getProductosPopularesPorCliente(clienteData._id);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {

      if (typeof bootstrap !== 'undefined') {
        const carouselProductos = document.getElementById('carouselProductos');
        if (carouselProductos) {
          new bootstrap.Carousel(carouselProductos, {
            interval: 5000,
            wrap: true
          });
        }


        if (this.cliente) {
          const carouselRecomendados = document.getElementById('carouselRecomendados');
          if (carouselRecomendados) {
            new bootstrap.Carousel(carouselRecomendados, {
              interval: 6000,
              wrap: true
            });
          }
        }
      }
    }, 500);
  }

  getProductosPopulares() {
    this.loadingHistorico = true;
    this._visitanteService.getProductosPopulares().subscribe(
      response => {
        this.arrayProductosPopulares = response.productos;
        this.arrayIds = this.arrayProductosPopulares.map(producto => {
          return { id: producto.producto_id };
        });

        const dataToSend = {
          productos: this.arrayIds
        };

        this.obtenerProductosPorArrayDeIds(dataToSend);
      },
      error => {
        console.log(error);
        this.loadingHistorico = false;
      }
    );
  }

  getProductosPopularesPorCliente(cliente_id: any) {
    console.log('entre');
    this.loadingHistorico = true;
    this._visitanteService.getProductoPopularPorCliente(cliente_id).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        this.clientearrayProductosPopulares = response.recomendaciones;
        this.clientearrayIds = this.clientearrayProductosPopulares.map(producto => {
          return { id: producto.id };
        });

        const dataToSend = {
          productos: this.clientearrayIds
        };

        this.obtenerProductosPorArrayDeIdsCliente(dataToSend);
      },
      error => {
        console.log(error);
        this.loadingHistorico = false;
      }
    );

  }

  obtenerProductosPorArrayDeIdsCliente(data:any){
    console.log('entre cliente');
    console.log(data);
    this._visitanteService.obtenerProductosPorArrayDeIds(data).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        this.clientearrayProductos = response.data || [];
        console.log('Productos populares obtenidos cliente:', this.clientearrayProductos);
        this.loadingHistorico = false;
      },
      error => {
        console.log('Error al obtener detalles de productos:', error);
        this.loadingHistorico = false;
      }
    );
  }



  obtenerProductosPorArrayDeIds(data: any) {
    this._visitanteService.obtenerProductosPorArrayDeIds(data).subscribe(
      response => {
        this.arrayProductos = response.data || [];

        this.loadingHistorico = false;
      },
      error => {
        console.log('Error al obtener detalles de productos:', error);
        this.loadingHistorico = false;
      }
    );
  }


  getProductosGrupo(slideIndex: number): any[] {
    const productosPorSlide = 2;
    const inicio = slideIndex * productosPorSlide;
    return this.arrayProductos.slice(inicio, inicio + productosPorSlide);
  }


  get totalSlides(): number {
    return Math.ceil(this.arrayProductos.length / 2);
  }


  get slideIndices(): number[] {
    return Array(this.totalSlides).fill(0).map((_, i) => i);
  }


  getProductosClienteGrupo(slideIndex: number): any[] {
    const productosPorSlide = 2;
    const inicio = slideIndex * productosPorSlide;
    return this.clientearrayProductos.slice(inicio, inicio + productosPorSlide);
  }


  get clienteTotalSlides(): number {
    return Math.ceil(this.clientearrayProductos.length / 2);
  }


  get clienteSlideIndices(): number[] {
    return Array(this.clienteTotalSlides).fill(0).map((_, i) => i);
  }
}
