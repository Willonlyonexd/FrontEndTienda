import { Component, effect } from '@angular/core';
declare var Swiper: any;
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  ngOnInit(){
    const swiper=new Swiper(".mySwiper",{
    })
  }

}

