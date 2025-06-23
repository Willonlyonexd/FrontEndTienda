import { Component } from '@angular/core';
import { GLOBAL } from '../../services/GLOBAL';
import { ClienteService } from '../../services/cliente.service';
import { VisitanteService } from '../../services/visitante.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { PagoService } from '../../services/pago.service';

declare var paypal:any
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {


  public envio=0
  public user :any=JSON.parse(localStorage.getItem('cliente')!);
  public token = localStorage.getItem('token');
  public carrito:Array<any>=[];
  public loadCarrito=true;
  public total=0
  public subtotal=0
  public url=GLOBAL.url
  public direcciones:any = [];
  direccion_selected:any = {};
  public msm_errorVenta = '';

  public venta:any={};
  public detalles:Array<any>=[];

  public codigo:any=''
  public cupon:any={}
  public msmCupon=''
  public descuento=0

    private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  public stripeLoading = false;
  public stripeError = '';
  public paymentMethod = ''; // 'paypal' | 'stripe' | 'manual'





  constructor(
    private _visitanteService: VisitanteService,
    private _clienteService: ClienteService,
    private _router: Router,
    private toastr: ToastrService,
     private _pagoService: PagoService,

  ){
    this.venta.cliente=this.user._id;
  }

   async ngOnInit() {
    this.initCarrito();
    await this.initStripe();
  }

   async initStripe() {
    try {
      // 🔑 Reemplaza con tu clave pública de Stripe
      this.stripe = await loadStripe('pk_test_51Rc7VHRwN7D13OU4bzDt0uYl16WPVCrxYVpL21E9Zt4Rzgjuc4AsFnCnwLeJraRAT7wK1Eh8fUJN3T8mDLdmTfn4007NHPqwRg');

      if (this.stripe) {
        this.elements = this.stripe.elements({
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#0570de',
              colorBackground: '#ffffff',
              colorText: '#30313d',
              fontFamily: 'system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px'
            }
          }
        });
        console.log('✅ Stripe inicializado correctamente');
      }
    } catch (error) {
      console.error('❌ Error inicializando Stripe:', error);
      this.stripeError = 'Error al cargar el procesador de pagos';
    }
  }

  // 🔥 Crear elemento de tarjeta
  async setupStripeCard() {
    if (!this.elements) return;

    try {
      if (this.cardElement) {
        this.cardElement.unmount();
      }

      this.cardElement = this.elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
        },
      });

      const cardContainer = document.getElementById('stripe-card-element');
      if (cardContainer) {
        this.cardElement.mount(cardContainer);

        this.cardElement.on('change', (event) => {
          if (event.error) {
            this.stripeError = event.error.message || '';
          } else {
            this.stripeError = '';
          }
        });
      }
    } catch (error) {
      console.error('Error configurando tarjeta:', error);
      this.stripeError = 'Error configurando formulario de pago';
    }
  }

  // 🔥 Seleccionar método de pago
  // En tu checkout.component.ts
async selectPaymentMethod(method: string) {
  console.log('🎯 Método seleccionado:', method);
  this.paymentMethod = method;
  this.stripeError = '';
  this.msm_errorVenta = '';

  if (method === 'stripe') {
    console.log('💳 Configurando Stripe...');
    setTimeout(() => {
      this.setupStripeCard();
    }, 300);
  } else if (method === 'paypal') {
    console.log('🅿️ Configurando PayPal...');
    // Limpiar cualquier botón anterior
    this.clearPaypalButtons();
    // Renderizar nuevo botón
    setTimeout(() => {
      this.renderPaypalButton();
    }, 300);
  }
}

clearPaypalButtons() {
  const paypalContainer = document.getElementById('paypal-button-container');
  if (paypalContainer) {
    paypalContainer.innerHTML = ''; // Limpiar contenido anterior
    console.log('🧹 PayPal buttons cleared');
  }
}

  // 🔥 Procesar pago con Stripe usando tu servicio
  // En checkout.component.ts - función pagarConStripe()
async pagarConStripe() {
  if (!this.stripe || !this.cardElement) {
    this.stripeError = 'Error: Stripe no está inicializado';
    return;
  }

  if (!this.venta.envio) {
    this.msm_errorVenta = 'Seleccione un método de envío';
    return;
  }

  this.stripeLoading = true;
  this.stripeError = '';

  try {
    // 1️⃣ Preparar datos CON LOS NOMBRES CORRECTOS
    const pagoData = {
      // 🔥 CAMBIAR ESTOS NOMBRES
      monto: Math.round(this.total * 100), // amount → monto
      moneda: 'usd', // currency → moneda (y cambiar a 'usd')

      // Información adicional (opcional para backend)
      clienteId: this.user._id,
      clienteEmail: this.user.email,
      clienteNombre: this.user.nombres + ' ' + this.user.apellidos,

      // Información del pedido
      venta: {
        ...this.venta,
        detalles: this.detalles,
        payment_method: 'stripe'
      },

      // Productos del carrito
      productos: this.carrito.map(item => ({
        productoId: item.producto._id,
        variedadId: item.producto_variedad._id,
        cantidad: item.cantidad,
        precio: item.producto_variedad.precio,
        titulo: item.producto.titulo
      })),

      // Totales
      envio: this.envio,
      subtotal: this.subtotal,
      descuento: this.descuento,
      total: this.total
    };

    console.log('📦 Datos del pago enviados:', pagoData);

    // 2️⃣ Llamar a tu servicio
    const response = await this._pagoService.crearPago(pagoData).toPromise();

    console.log('🔄 Respuesta del backend:', response);

    if (!response.client_secret) {
      throw new Error(response.error || response.message || 'Error al crear el intent de pago');
    }

    // 3️⃣ Confirmar pago con Stripe
    const result = await this.stripe.confirmCardPayment(response.client_secret, {
      payment_method: {
        card: this.cardElement,
        billing_details: {
          name: this.user.nombres + ' ' + this.user.apellidos,
          email: this.user.email,
        },
      }
    });

    if (result.error) {
      console.error('❌ Error Stripe:', result.error);
      this.stripeError = result.error.message || 'Error procesando el pago';
    } else {
      console.log('✅ Pago exitoso:', result.paymentIntent);

      // 4️⃣ Guardar venta
      this.crearVentaConStripe(result.paymentIntent);
      this.toastr.success('¡Pago procesado exitosamente! 🎉');
      this._router.navigate(['/cuenta', this.user._id]);
    }

  } catch (error: any) {
    console.error('❌ Error en pago:', error);
    this.stripeError = error.message || 'Error inesperado procesando el pago';
    this.toastr.error('Error procesando el pago');
  } finally {
    this.stripeLoading = false;
  }
}
  // 🔥 Confirmar pago exitoso (opcional)
  confirmarPagoExitoso(ventaId: string, paymentIntentId: string) {
    const confirmData = {
      ventaId: ventaId,
      stripePaymentIntentId: paymentIntentId,
      status: 'paid'
    };

    // Podrías crear otro endpoint para confirmar
    // this._pagoService.confirmarPago(confirmData).subscribe(...);
  }

  // 🔥 Crear venta con información de Stripe
  crearVentaConStripe(paymentIntent: any) {
    this.venta.detalles = this.detalles;
    this.venta.payment_method = 'stripe';
    this.venta.stripe_payment_intent = paymentIntent.id;
    this.venta.payment_status = 'paid';

    this._clienteService.createVentaCliente(this.venta, this.token).subscribe(
      response => {
        console.log('✅ Venta guardada:', response);
      },
      error => {
        console.error('❌ Error guardando venta:', error);
      }
    );
  }

  // 🔄 Modificar función pagar existente
  pagar() {
    if (this.paymentMethod === 'stripe') {
      this.pagarConStripe(); // 🔥 Usar Stripe
    } else if (this.paymentMethod === 'manual') {
      // Tu lógica original
      if (!this.venta.envio) {
        this.msm_errorVenta = 'Seleccione un método de envío';
      } else {
        this.venta.detalles = this.detalles;
        this.venta.payment_method = 'manual';
        this._clienteService.createVentaCliente(this.venta, this.token).subscribe(
          response => {
            console.log(response);
            this.toastr.success('Venta realizada con éxito');
            this._router.navigate(['/cuenta', this.user._id]);
          },
          error => {
            console.log(<any>error);
          }
        );
      }
    }
  }

renderPaypalButton() {
  // Verificar que PayPal esté cargado
  if (typeof paypal === 'undefined') {
    console.error('❌ PayPal SDK no está cargado');
    return;
  }

  // Verificar que el contenedor exista
  const paypalContainer = document.getElementById('paypal-button-container');
  if (!paypalContainer) {
    console.error('❌ Contenedor de PayPal no encontrado');
    return;
  }

  // Limpiar contenedor antes de renderizar
  paypalContainer.innerHTML = '';

  console.log('🅿️ Renderizando botón PayPal...');

  try {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        console.log('💰 Creando orden PayPal, total:', this.total);
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.total.toString(),
              currency_code: 'USD' // o 'BOB' si PayPal lo soporta
            },
            description: `Pedido de tienda - ${this.carrito.length} productos`
          }]
        });
      },

      onApprove: (data: any, actions: any) => {
        console.log('✅ PayPal aprobado:', data);

        return actions.order.capture().then((details: any) => {
          console.log('💳 Pago capturado:', details);

          // Preparar datos de la venta
          this.venta.detalles = this.detalles;
          this.venta.payment_method = 'paypal';
          this.venta.paypal_order_id = data.orderID;
          this.venta.paypal_transaction_id = details.id;
          this.venta.payment_status = 'completed';

          console.log('📦 Guardando venta:', this.venta);

          // Guardar en tu backend
          this._clienteService.createVentaCliente(this.venta, this.token).subscribe(
            response => {
              console.log('✅ Venta guardada:', response);
              this.toastr.success('¡Pago con PayPal exitoso! 🎉');
              this._router.navigate(['/cuenta', this.user._id]);
            },
            error => {
              console.error('❌ Error guardando venta:', error);
              this.toastr.error('Error al procesar la venta');
            }
          );
        });
      },

      onError: (err: any) => {
        console.error('❌ Error PayPal:', err);
        this.toastr.error('Error procesando pago con PayPal');
      },

      onCancel: (data: any) => {
        console.log('❌ PayPal cancelado:', data);
        this.toastr.warning('Pago cancelado');
      }

    }).render('#paypal-button-container');

    console.log('✅ Botón PayPal renderizado');

  } catch (error) {
    console.error('❌ Error renderizando PayPal:', error);
  }
}
  initCarrito(){
    this.loadCarrito=true;
    if(this.user==null){
      if(localStorage.getItem('carrito')){
        this.carrito=JSON.parse(localStorage.getItem('carrito')!);

      }else{
        this.carrito=[];
      }
      this.calcularTotal()
    }else{
      this._clienteService.getCarritoCliente(this.token).subscribe(
        response=>{
          this.carrito=response.data;
          console.log(this.carrito)
          for(const item of this.carrito){
            this.detalles.push({
              producto:item.producto._id,
              variedad:item.producto_variedad._id,
              cliente:this.user._id,
              cantidad:item.cantidad,
              precio:item.producto_variedad.precio
            })
          }

          console.log(this.detalles)

         this.calcularTotal()
          this.loadCarrito=false;
        },
        error=>{
          console.log(<any>error)
        }
      )
    }


  }

  calcularTotal(){
    this.subtotal=0
    if(this.user==null){
      for(const item of this.carrito){
        this.subtotal+=item.precio*item.cantidad
      }
  }else{
    for(const item of this.carrito){
      this.subtotal+=item.producto_variedad.precio*item.cantidad
    }

    this.total=this.subtotal

  }

  this.venta.total=this.total
}

  setEnvio(){
    console.log(this.envio)
    this.total=this.subtotal+parseFloat(this.envio.toString())
    this.venta.envio=this.envio
    this.venta.total=this.total
  }

  select_direccion(item:any){}



aplicarCupon(){
  const categorias:any=[]
  const productos:any=[]
  this.carrito.forEach(element=>{
    categorias.push(element.producto.categoria)
    productos.push(element.producto._id)
  })
  this._visitanteService.aplicarCupon(this.codigo,{total:this.total,categorias,productos}).subscribe(
    response=>{
      console.log(response)
      if(response.data!=undefined){
        this.cupon=response.data
        this.msmCupon=''
        this.descuento=(this.cupon.descuento/100)*this.total
        this.total=this.total-this.descuento
      }else{
        this.msmCupon=response.message
      }

    },
    error=>{
      console.log(<any>error)
    }
  )
}
}
