import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { VerificacionComponent } from './components/verificacion/verificacion.component';
import { TiendaComponent } from './components/tienda/tienda.component';
import { ProductoComponent } from './components/producto/producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SidebarCuentaComponent } from './components/cuenta/sidebar-cuenta/sidebar-cuenta.component';
import { PerfilComponent } from './components/cuenta/perfil/perfil.component';

const routes: Routes = [
  {path:'',component:InicioComponent},
  {path:'registro',component:RegistroComponent},
  {path:'login',component:LoginComponent},
  {path:'cuenta/:id',component:SidebarCuentaComponent},
 
  {path:':tienda/cuenta-verificacion/:token',component:VerificacionComponent},

  {path:'tienda',component:TiendaComponent},

  {path:'tienda/:slug',component:ProductoComponent},

  {path:'carrito',component:CarritoComponent},
  {path:'checkout',component:CheckoutComponent},
  { path: 'producto/:id', component: ProductoComponent },

  
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
