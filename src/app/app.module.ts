import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, withFetch, provideHttpClient } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegistroComponent } from './components/registro/registro.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { VerificacionComponent } from './components/verificacion/verificacion.component';
import { TiendaComponent } from './components/tienda/tienda.component';
import { BarComponent } from './components/bar/bar.component';
import { ProductoComponent } from './components/producto/producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SidebarCuentaComponent } from './components/cuenta/sidebar-cuenta/sidebar-cuenta.component';
import { PerfilComponent } from './components/cuenta/perfil/perfil.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// Angular Material imports
import { MatPaginatorModule } from '@angular/material/paginator'; // Paginación
import { MatButtonModule } from '@angular/material/button'; // Botones
import { MatCardModule } from '@angular/material/card'; // Tarjetas
import { MatIconModule } from '@angular/material/icon'; // Iconos
import { MatSelectModule } from '@angular/material/select'; // Selects (para filtros)
import { MatInputModule } from '@angular/material/input'; // Inputs (para filtros)
import { MatFormFieldModule } from '@angular/material/form-field'; // Form field (para inputs)
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Para checkboxes


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    RegistroComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    VerificacionComponent,
    TiendaComponent,
    BarComponent,
    ProductoComponent,
    CarritoComponent,
    CheckoutComponent,
    SidebarCuentaComponent,
    PerfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,  // Para paginación
    MatCheckboxModule,  // Para checkboxes
    BrowserAnimationsModule,  // Make sure this is added
    MatButtonModule,  // Para botones
    MatMenuModule,  // Asegúrate de que MatMenuModule esté importado
    MatPaginatorModule,  // Add this line
    MatFormFieldModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
