import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitanteService } from '../../services/visitante.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  public cliente: any = {}
  public mensaje: string = ''
  public tienda=''
  public btnLoad =false
  constructor(
    private route:ActivatedRoute,
    private visitanteService: VisitanteService,
    private router:Router,
    private toastr:ToastrService
  ){}

  ngOnInit(){
   
  }


  validar(){
    if(!this.cliente.nombres){
      this.mensaje = 'El campo nombre es obligatorio'
    }else if(!this.cliente.apellidos){
      this.mensaje = 'El campo apellido es obligatorio'
    }else if(!this.cliente.email){
      this.mensaje = 'El campo email es obligatorio'
    }else if(!this.cliente.password){
      this.mensaje = 'El campo password es obligatorio'
    }else if(!this.cliente.passwordConfirmado){
      this.mensaje = 'El campo confirmar password es obligatorio'
    }else if(this.cliente.password != this.cliente.passwordConfirmado){
      this.mensaje = 'Las contraseñas no coinciden'
    }else{
      console.log(this.cliente)
      this.btnLoad = true
      this.visitanteService.createClienteTienda(this.cliente).subscribe(
        response=>{
          console.log(response)
          if(response.data!=undefined){
            this.toastr.success('Registro exitoso')
            this.router.navigate(['/login'])
          }
         this.btnLoad = false
        },
        error=>{
          console.log(error)
          this.mensaje = error.error.message
        }
      )
    }
  }
}
