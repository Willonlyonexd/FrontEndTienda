import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RecomendacionService } from '../../services/recomendacion.service';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

Swiper.use([Navigation, Pagination]);

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit {

  productosPopulares: any[] = [];

  constructor(private recomendacionService: RecomendacionService) {}

  ngOnInit(): void {
    this.obtenerProductosPopulares();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      new Swiper('.mySwiper', {
        slidesPerView: 1,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }, 500);
  }

  obtenerProductosPopulares(): void {
    this.recomendacionService.obtenerProductosPopulares().subscribe(
      (resp: any) => {
        this.productosPopulares = resp.productos;
      },
      (err: any) => {
        console.error('Error obteniendo productos populares', err);
      }
    );
  }
}
