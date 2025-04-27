import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VisitanteService } from '../../services/visitante.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
public email=''
public password=''
public msnErrorEmail=''
public msnErrorPassword=''
tienda=''
public btnLoad =false
constructor(
  private route:ActivatedRoute,
  private _visitanteService:VisitanteService,
  private router:Router,
  private toastr:ToastrService
) { }

ngOnInit(): void {
 
  
  
}

loguear(){
  if(!this.email){
    this.msnErrorPassword=''
    this.msnErrorEmail='Ingrese su email'
  }else if(!this.password){
    this.msnErrorEmail=''
    this.msnErrorPassword='Ingrese su contraseña'
  }else{
    this.msnErrorEmail=''
    this.msnErrorPassword=''
    this.btnLoad=true
    this._visitanteService.loginCliente({email:this.email,password:this.password,tenant:this.tienda}).subscribe(
      response=>{
        console.log(response)
        if(response.data!=undefined){
          localStorage.setItem('token',response.jwt)
          localStorage.setItem('cliente',JSON.stringify(response.data))
          this.toastr.success('Bienvenido')
          this.router.navigate(['/tienda'])
        }else{
          if(response.tipo=='email'){
            this.msnErrorEmail=response.message
          }else if(response.tipo=='password'){
            this.msnErrorPassword=response.message
          }
          
        }
        this.btnLoad=false
      }
    )


  }
}
}
