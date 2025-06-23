import { Component, OnInit } from '@angular/core';
import { ConfigTiendaPublicServiceService } from '../../services/config-tienda-public-service.service';
import { GLOBAL } from '../../services/GLOBAL';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public contacto: any = {};
  public loadingContacto = true;
  public currentYear = new Date().getFullYear();

  // Nuevas propiedades para el logo
  public url = GLOBAL.url;
  public logo: string | null = null;
  public loadingLogo = true;

  constructor(
    private _configTiendaService: ConfigTiendaPublicServiceService
  ) {}

  ngOnInit(): void {
    this.cargarContacto();
    this.cargarLogo(); // Nuevo método para cargar el logo
  }

  cargarContacto() {
    this._configTiendaService.getContactoTienda().subscribe(
      response => {
        console.log('Información de contacto:', response);
        if (response.success && response.contacto) {
          this.contacto = response.contacto;
        }
        this.loadingContacto = false;
      },
      error => {
        console.error('Error al cargar información de contacto:', error);
        this.loadingContacto = false;
      }
    );
  }

  // Nuevo método para cargar el logo
  cargarLogo() {
    this._configTiendaService.getConfiguracionTienda().subscribe(
      response => {
        if (response.success && response.logo) {
          this.logo = this.url + '/getLogo/' + response.logo;
          console.log('Logo URL (footer):', this.logo);
        }
        this.loadingLogo = false;
      },
      error => {
        console.error('Error al cargar el logo en footer:', error);
        this.loadingLogo = false;
      }
    );
  }
}
