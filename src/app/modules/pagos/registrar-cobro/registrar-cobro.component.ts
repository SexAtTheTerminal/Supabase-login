import { Component } from '@angular/core';
import { SidebarCasherComponent } from "../../../sidebar/features/sidebar-casher/sidebar-casher.component";
import { NgClass } from '@angular/common';
import { ApiPeruService } from '../../../shared/data-access/api-peru.service';
import { catchError, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RegistrarCobroService } from '../../../services/data-access/registrar-cobro/registrar-cobro.service';

@Component({
  selector: 'app-registrar-cobro',
  imports: [
    SidebarCasherComponent,
    NgClass,
    FormsModule,
    CommonModule,
    NgIf],
  templateUrl: './registrar-cobro.component.html',
  styleUrl: './registrar-cobro.component.scss'
})

export class RegistrarCobroComponent {
  sidebarCollapsed = false;
  dni: string = '';
  clienteNombres: string = '';
  loading: boolean = false;
  error: string | null = null;
  mesas: any[] = [];
  mesaSeleccionada: { idMesa: number; numeroMesa: string } | null = null;
  pedidoSeleccionado: { nombre: string; cantidad: number; precio: number }[] = [];
  totalPedido: number = 0;
  mensajeError: string | null = null;
  datosAregistrar: { idPedido: number, idModalidad: number }[] = [];

  constructor(
    private apiPeruService: ApiPeruService,
    private registrarCobroService: RegistrarCobroService,
  ) {}

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }

  async ngOnInit() {
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

    this.apiPeruService.buscarPorDni(this.dni).pipe(
      catchError(err => {
        this.loading = false;
        this.error = 'Error al buscar el DNI. Por favor, intente de nuevo';
        console.error('Error en la llamada a la API:', err);
        return throwError(() => new Error('Error al buscar DNI'));
      })
    ).subscribe(response => {
      this.loading = false;
      console.log(`Respuesta COMPLETA de la API: ${response}`);

      const apiData = response.data;

      console.log('Valor de apiData:', apiData);


      if (response && response.success && apiData && apiData.nombres && apiData.apellido_paterno) {
        this.clienteNombres = `${apiData.nombres} ${apiData.apellido_paterno} ${apiData.apellido_materno || ''}`;
        this.error = null;
        console.log('Cliente encontrado:', this.clienteNombres);
      } else {
        this.error = 'No se encontró información para el DNI proporcionado';
        this.clienteNombres = '';
      }
    });
  }

  async mostrarPedidosMesas(mesaSeleccionada: { idMesa: number; numeroMesa: string } | null): Promise<void> {
    if (!mesaSeleccionada) return;

    try {
      const resultado = await this.registrarCobroService.obtenerPedidosdelaMesa(mesaSeleccionada.idMesa);

      this.pedidoSeleccionado = resultado?.[0]?.items || [];
      this.totalPedido = this.pedidoSeleccionado.reduce((total, item) => total + (item.precio || 0), 0);

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
      const resultado = await this.registrarCobroService.obtenerIds(mesaSeleccionada.idMesa);
      this.datosAregistrar = resultado || [];
      console.log(this.datosAregistrar);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      return;
    }

    try {
      if (this.datosAregistrar && this.datosAregistrar.length > 0) {
        for (const dato of this.datosAregistrar) {
          await this.registrarCobroService.registrarPagoConPedidoCompleto(
            dato.idPedido,
            dato.idModalidad,
            montoTotal,
            dniCliente
          );
        }
      } else {
        this.mensajeError = 'No hay pedidos para registrar.';
      }
    } catch (error) {
      console.error('Error al registrar cobro', error);
      return;
    }

    alert('Pedido registrado correctamente');
    return;
  }

}
