import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitanteService } from '../../services/visitante.service';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.component.html',
  styleUrl: './verificacion.component.css'
})
export class VerificacionComponent {

  public token=''
  public estado=false
  constructor(

    private _router: Router,
    private _route: ActivatedRoute,
    private visitanteService: VisitanteService
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.token = params['token']
      this.initData()
    });
  }


  initData(){
    this.visitanteService.verificacionCliente(this.token).subscribe(
      (response: any) => {
        console.log(response)
        this.estado = response.estado
        
      },
      error => {
        console.log(error)
      }
    )
  }


}
