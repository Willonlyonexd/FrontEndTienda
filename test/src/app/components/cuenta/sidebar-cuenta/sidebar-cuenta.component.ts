import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { GLOBAL } from '../../../services/GLOBAL';

@Component({
  selector: 'app-sidebar-cuenta',
  templateUrl: './sidebar-cuenta.component.html',
  styleUrl: './sidebar-cuenta.component.css'
})
export class SidebarCuentaComponent {

  public route=''
  public id=''
  public toke=localStorage.getItem('token')
  public ventas:Array<any>=[]
  public url=GLOBAL.url
  constructor(
    private _route: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router
  ){}



  ngOnInit(){
    this._route.params.subscribe(params=>{
      this.id=params["id"]
      this.initData()
    }
  )
  }


  initData(){
    this.clienteService.getVentasCliente(this.id,this.toke).subscribe(
      response=>{
        this.ventas=response.data
        console.log(this.ventas)
      },
      error=>{
        console.log(error)
      }
    )
  }
}
