import { Component, inject } from '@angular/core';
import { SidebarCasherComponent } from '../../../sidebar/features/sidebar-casher/sidebar-casher.component';
import { NgClass, NgIf, CommonModule } from '@angular/common';
import { ApiPeruService } from '../../../shared/data-access/api-peru.service';
import { catchError, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RegistrarCobroService } from '../../../services/data-access/registrar-cobro/registrar-cobro.service';
import { AuthService } from '../../../auth/data-access/auth.service';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../shared/data-access/supabase.service';



@Component({
  selector: 'app-registrar-cobro',
  imports: [SidebarCasherComponent, NgClass, FormsModule, CommonModule, NgIf],
  templateUrl: './registrar-cobro.component.html',
  styleUrl: './registrar-cobro.component.scss',
})
export class RegistrarCobroComponent {
  totalPaginas: number = 0;
  sidebarCollapsed = false;
  dni: string = '';
  clienteNombres: string = '';
  // TODO:
  clienteCompleto: any = null;
  loading: boolean = false;
  error: string | null = null;
  mesas: any[] = [];
  mesaSeleccionada: { idMesa: number; numeroMesa: string } | null = null;
  pedidoSeleccionado: { nombre: string; cantidad: number; precio: number }[] =
    [];
  totalPedido: number = 0;
  mensajeError: string | null = null;
  datosAregistrar: { idPedido: number; idModalidad: number } | null = null;
  paginaActual: number = 0;

  private readonly _authService = inject(AuthService);

  constructor(
    private readonly apiPeruService: ApiPeruService,
    private readonly registrarCobroService: RegistrarCobroService,
    private readonly supabaseService: SupabaseService, // Servicio para manejar las consultas a la base de datos Supabase
    private readonly router: Router
  ) {}

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }

  async ngOnInit() {
    this._authService.verifyRoleOrSignOut().then((isValid) => {
      if (!isValid) {
        this.router.navigate(['/auth/log-in']);
      }
    });
    this.mesas = await this.registrarCobroService.obtenerMesas();
  }

  // DNI API

  async buscarClientePorDni(): Promise<void> {
    this.clienteNombres = '';
    this.error = null;

    if (!this.dni) {
      this.error = 'Por favor, ingrese un número de DNI correcto';
      return;
    }

    if (!/^\d{8}$/.test(this.dni)) {
      this.error = 'El DNI debe ser numérico y tener 8 dígitos';
      return;
    }

    this.loading = true;

    try {
      // TODO: Vamos a verificar si el cliente se encuentra registrado en Supabase
      const clienteExistente = await this.supabaseService.verificarClienteExiste(this.dni);

      if (clienteExistente) {
        this.clienteCompleto = clienteExistente;
        this.clienteNombres = `${clienteExistente.nombreCliente} ${clienteExistente.apellPaterno} ${clienteExistente.apellMaterno || ''}`;
        this.loading = false;
        console.log('Cliente con historial de Compras en Supabase');
        return;
      }

      // TODO: Si el cliente no se encuentra en Supabase, buscar en la API de Perú
      this.apiPeruService.buscarPorDni(this.dni).pipe(
        catchError((err) => {
          this.loading = false;
          this.error = 'Error al buscar el DNI. Por favor, intente de nuevo';
          console.error('Error en la llamada a la API:', err);
          return throwError(() => new Error('Error al buscar DNI'));
        })
      ).subscribe(async (response) => {
        this.loading = false;

        if (response && response.success && response.data) {
          const apiData = response.data;

          // TODO: Guardar un nuevo cliente en nuestra base de datos Supabase, para evitar consumir las posibilidad de llamar a la API.
          try {
            const clienteParaGuardar = {
              dni: this.dni,
              nombres: apiData.nombres,
              apellido_paterno: apiData.apellido_paterno,
              apellido_materno: apiData.apellido_materno || ''
            };

            const clienteGuardado = await this.supabaseService.guardarCliente(clienteParaGuardar);

            this.clienteCompleto = clienteGuardado[0];
            this.clienteNombres = `${apiData.nombres} ${apiData.apellido_paterno} ${apiData.apellido_materno || ''}`;
            this.error = null;

            console.log('Cliente guardado en Supabase');
            alert('Cliente registrado en Supabase exitosamente');

          } catch (supabaseError) {
            console.error('Error al guardar en Supabase:', supabaseError);
            this.error = 'Error al guardar cliente en la base de datos';
          }
        } else {
          this.error = 'No se encontró información para el DNI proporcionado';
          this.clienteNombres = '';
        }
      });

    } catch (error) {
        this.loading = false;
        this.error = 'Error al verificar cliente';
        console.error('Error:', error);
    }
  }

  async mostrarPedidosMesas(
    mesaSeleccionada: { idMesa: number; numeroMesa: string } | null,
    nPedido: number
  ): Promise<void> {
    if (!mesaSeleccionada) return;

    try {
      const resultado = await this.registrarCobroService.obtenerPedidosdelaMesa(
        mesaSeleccionada.idMesa
      );

      this.pedidoSeleccionado = resultado?.[nPedido] || [];
      this.totalPedido = this.pedidoSeleccionado.reduce(
        (total, item) => total + (item.cantidad * item.precio || 0),
        0
      );
      this.paginaActual = nPedido + 1;
      this.totalPaginas = resultado.length;

      console.log('Pedido seleccionado:', this.pedidoSeleccionado);
    } catch (error) {
      console.error('Error al mostrar pedidos:', error);
      this.pedidoSeleccionado = [];
    }
  }

  async registrarPago(
  mesaSeleccionada: { idMesa: number; numeroMesa: string } | null,
  montoTotal: number,
  dniCliente: string
  ) {
    if (!mesaSeleccionada) {
      this.mensajeError = 'Debe seleccionar una mesa.';
      return;
    }

    try {
      const resultado = await this.registrarCobroService.obtenerIds(
        mesaSeleccionada.idMesa
      );
      this.datosAregistrar = resultado?.[this.paginaActual - 1] || null;
      console.log('Ids a registrar', this.datosAregistrar);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      return;
    }

    try {
      if (this.datosAregistrar) {
        const pagoData = {
          pedido_id: this.datosAregistrar.idPedido,
          modalidad_id: this.datosAregistrar.idModalidad,
          monto_total: montoTotal,
          dni_cliente: dniCliente
        };

        console.log('Registrando pago en Supabase:', pagoData);
        await this.supabaseService.registrarPago(pagoData);
        console.log('Pago registrado en Supabase correctamente');


      } else {
        this.mensajeError = 'No hay pedidos para registrar.';
        return;
      }
    } catch (error) {
      console.error('Error al registrar cobro', error);
      this.mensajeError = 'Error al registrar el pago: ' + error;
      return;
    }

    alert('Pedido registrado correctamente');
    window.location.reload();
    return;
  }

  paginaAnterior(
    mesaSeleccionada: { idMesa: number; numeroMesa: string } | null
  ) {
    if (this.paginaActual === 1) return;

    this.paginaActual = this.paginaActual - 1;
    this.mostrarPedidosMesas(mesaSeleccionada, this.paginaActual - 1);
  }

  paginaSiguiente(
    mesaSeleccionada: { idMesa: number; numeroMesa: string } | null
  ) {
    if (this.paginaActual === this.totalPaginas) return;

    this.paginaActual = this.paginaActual + 1;
    this.mostrarPedidosMesas(mesaSeleccionada, this.paginaActual - 1);
  }

  // TODO: Con esta función se confirma el pago con el cliente seleccionado.
  async confirmarPagoConCliente(): Promise<void> {
    if (!this.mesaSeleccionada) {
      this.mensajeError = 'Debe seleccionar una mesa.';
      return;
    }

    if (!this.clienteCompleto) {
      this.mensajeError = 'Debe buscar un cliente primero.';
      return;
    }
    await this.registrarPago(this.mesaSeleccionada, this.totalPedido, this.dni);

  }





}
