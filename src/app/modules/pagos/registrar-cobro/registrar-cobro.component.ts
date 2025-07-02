import { Component, inject } from '@angular/core';
import { SidebarCasherComponent } from '../../../sidebar/features/sidebar-casher/sidebar-casher.component';
import { NgClass, NgIf, CommonModule } from '@angular/common';
import { ApiPeruService } from '../../../shared/data-access/api-peru.service';
import { catchError, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RegistrarCobroService } from '../../../services/data-access/registrar-cobro/registrar-cobro.service';
import { AuthService } from '../../../auth/data-access/auth.service';
import { Router } from '@angular/router';

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

  buscarClientePorDni(): void {
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

    this.apiPeruService
      .buscarPorDni(this.dni)
      .pipe(
        catchError((err) => {
          this.loading = false;
          this.error = 'Error al buscar el DNI. Por favor, intente de nuevo';
          console.error('Error en la llamada a la API:', err);
          return throwError(() => new Error('Error al buscar DNI'));
        })
      )
      .subscribe((response) => {
        this.loading = false;
        console.log(`Respuesta COMPLETA de la API: ${response}`);

        const apiData = response.data;

        console.log('Valor de apiData:', apiData);

        if (
          response &&
          response.success &&
          apiData &&
          apiData.nombres &&
          apiData.apellido_paterno
        ) {
          this.clienteNombres = `${apiData.nombres} ${
            apiData.apellido_paterno
          } ${apiData.apellido_materno || ''}`;
          this.error = null;
          console.log('Cliente encontrado:', this.clienteNombres);
        } else {
          this.error = 'No se encontró información para el DNI proporcionado';
          this.clienteNombres = '';
        }
      });
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
        await this.registrarCobroService.registrarPagoConPedidoCompleto(
          this.datosAregistrar.idPedido,
          this.datosAregistrar.idModalidad,
          montoTotal,
          dniCliente
        );
      } else {
        this.mensajeError = 'No hay pedidos para registrar.';
        return;
      }
    } catch (error) {
      console.error('Error al registrar cobro', error);
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
}
