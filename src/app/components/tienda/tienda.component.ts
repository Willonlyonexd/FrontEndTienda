import { Component } from '@angular/core';
import { VisitanteService } from '../../services/visitante.service';
import { GLOBAL } from '../../services/GLOBAL';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';  // Importación de PageEvent

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent {
  public url = GLOBAL.url;
  public productos: Array<any> = [];
  public ordenarPor = 'Defecto';
  public producto_const: Array<any> = [];
  public categorias: Array<any> = [];
  public genero = 'Todos';
  public queryCategorias: Array<any> = [];
  public precio = '';
  public tenant = '';

  // 🔄 Paginación
  public page: number = 1;
  public limit: number = 10;
  public total: number = 0;

  constructor(
    private _visitanteService: VisitanteService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      if (params['ordenarPor']) this.ordenarPor = params['ordenarPor'];
      if (params['genero']) this.genero = params['genero'];
      if (params['categorias']) this.queryCategorias = params['categorias'].split(',');
      if (params['precio']) this.precio = params['precio'];

      this.initCategoria(); // carga categorías con selección
      this.initData();
    });
  }

  initData() {
    const categoriasStr = this.queryCategorias.join(',');

    // convertir 'BOB10.00 - BOB49.00' a '10-49'
    let precioRange = '';
    if (typeof this.precio === 'string') {
      const match = this.precio.match(/(\d+).+?(\d+)?/);
      if (match) {
        const min = match[1];
        const max = match[2] || '9999'; // para "200 a más"
        precioRange = `${min}-${max}`;
      }
    }

    // Llamar al backend con los filtros correctos
    this._visitanteService.getProductosTienda(
      this.page,
      this.limit,
      this.genero !== 'Todos' ? this.genero : undefined,
      categoriasStr || undefined,
      precioRange || undefined
    ).subscribe(
      response => {
        this.productos = response.data;
        this.total = response.total;
        this.producto_const = response.data;
        this.initOrden();
      },
      error => {
        console.error(error);
      }
    );
  }

  // Cambiar aquí para aceptar un PageEvent en lugar de un número
  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;  // Deberías usar pageIndex para obtener la página actual
    this.limit = event.pageSize;
    this.initData();
  }

  setOrdenarPor(ordenarPor: any) {
    this.ordenarPor = ordenarPor;
    this.redirect();
  }

  redirect() {
    this._router.navigate(['tienda'], {
      queryParams: {
        ordenarPor: this.ordenarPor,
        genero: this.genero,
        categorias: this.queryCategorias.join(','),
        precio: this.precio
      }
    });
  }

  initOrden() {
    if (this.ordenarPor == 'A-Z') {
      this.producto_const.sort((a: any, b: any) => a.titulo.localeCompare(b.titulo));
    }
    if (this.ordenarPor == 'Z-A') {
      this.producto_const.sort((a: any, b: any) => b.titulo.localeCompare(a.titulo));
    }
    if (this.ordenarPor == 'Precio menor') {
      this.producto_const.sort((a: any, b: any) => a.precio - b.precio);
    }
    if (this.ordenarPor == 'Precio mayor') {
      this.producto_const.sort((a: any, b: any) => b.precio - a.precio);
    }
  }

  setFiltro(tipo: any, value: any) {
    if (tipo == 'Genero') {
      this.genero = value;
      this.redirect();
    } else if (tipo == 'Precio') {
      this.redirect();
    }
  }

  setCategoria() {
    this.queryCategorias = this.categorias.filter(item => item.seleccion === true).map(item => item._id);
    this.redirect();
  }

  initCategoria() {
    this._visitanteService.getCategoriasTienda(this.genero).subscribe(
      response => {
        this.categorias = response.data;
        if (this.queryCategorias.length === 0) {
          for (let item of this.categorias) {
            item.seleccion = true;
          }
        } else {
          for (let item of this.categorias) {
            if (this.queryCategorias.includes(item._id)) {
              item.seleccion = true;
            }
          }
        }
        this.setCategoria();
      },
      error => {
        console.log(error);
      }
    );
  }

  seleccion(event: any, idx: any) {
    this.categorias[idx].seleccion = event.target.checked;
  }

  selectPrecio(event: any) {
    let chks = document.querySelectorAll('.chk-precio');
    chks.forEach((element: any) => {
      if (element.value !== event.target.value && element.checked) {
        element.checked = false;
      }
    });
    this.precio = event.target.value;
  }
}