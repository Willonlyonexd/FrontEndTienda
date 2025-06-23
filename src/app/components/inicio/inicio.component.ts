import { Component, OnInit, AfterViewInit } from '@angular/core';
import { VisitanteService } from '../../services/visitante.service';

import { GLOBAL } from '../../services/GLOBAL';
import { ConfigTiendaPublicServiceService } from '../../services/config-tienda-public-service.service';
declare var Swiper: any;
declare var bootstrap: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit {

  public arrayIds: any;
  public arrayProductos: any[] = [];
  public arrayProductosPopulares: any[] = [];
  public url = GLOBAL.url;
  public clientearrayIds: any;
  public clientearrayProductos: any[] = [];
  public clientearrayProductosPopulares: any[] = [];
  public loadingHistorico: boolean = false;

  public cliente = localStorage.getItem('cliente') || null;

  // Nueva propiedad para el banner
  public banner: string | null = null;
  public loadingBanner: boolean = true;

  constructor(
    private _visitanteService: VisitanteService,
    private _configTiendaService: ConfigTiendaPublicServiceService
  ) {}

  ngOnInit() {
    // Cargar la configuración del banner
    this.cargarConfiguracionTienda();

    // Inicializar Swiper (solo si no hay banner configurado)
    this.initSwiper();

    this.getProductosPopulares();
    if(this.cliente) {
      const clienteData = JSON.parse(this.cliente);
      this.getProductosPopularesPorCliente(clienteData._id);
    }
  }

cargarConfiguracionTienda() {
  this.loadingBanner = true;
  this._configTiendaService.getConfiguracionTienda().subscribe(
    response => {
      console.log('Respuesta de configuración de tienda:', response);

      if (response.success && response.banner) {
        this.banner = this.url + '/getBanner/' + response.banner;
        console.log('Banner URL configurada:', this.banner);

        // Verifica si la imagen existe
        this.verificarImagenExiste(this.banner);
      } else {
        console.log('No se encontró un banner configurado');
        this.banner = null;
        this.loadingBanner = false;
        this.initSwiper(); // Inicializa Swiper solo si no hay banner
      }
    },
    error => {
      console.error('Error al cargar la configuración de la tienda:', error);
      this.banner = null;
      this.loadingBanner = false;
      this.initSwiper(); // Inicializa Swiper en caso de error
    }
  );
}

verificarImagenExiste(url: string) {
  const img = new Image();
  img.onload = () => {
    console.log('✅ Imagen del banner cargada correctamente');
    this.loadingBanner = false;
  };
  img.onerror = () => {
    console.error('❌ Error al cargar la imagen del banner');
    this.banner = null;
    this.loadingBanner = false;
    this.initSwiper(); // Inicializa Swiper si la imagen falla
  };
  img.src = url;
}

initSwiper() {
  console.log('Inicializando Swiper...');
  setTimeout(() => {
    try {
      const swiper = new Swiper(".mySwiper", {});
      console.log('✅ Swiper inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar Swiper:', error);
    }
  }, 100);
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

  // ... El resto de métodos permanecen igual
  getProductosPopulares() {

  }

  getProductosPopularesPorCliente(cliente_id: any) {

  }

  obtenerProductosPorArrayDeIdsCliente(data: any) {
    this._visitanteService.obtenerProductosPorArrayDeIds(data).subscribe(
      response => {
        this.clientearrayProductos = response.data || [];
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
