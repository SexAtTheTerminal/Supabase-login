import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarCookerComponent } from '../../../sidebar/features/sidebar-cooker/sidebar-cooker.component';
import { UpdatePedidosService } from '../../../services/data-access/update-pedidos/update-pedidos.service';
import { FiltrosPedidosComponent } from '../../../shared/modals/filtros-pedidos/filtros-pedidos.component';
import { TablaUpdatePedidosComponent } from '../../../shared/modals/tabla-update-pedidos/tabla-update-pedidos.component';
import { DetallesPedidoComponent } from '../../../shared/modals/detalles-pedido/detalles-pedido.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth.service';

@Component({
  selector: 'app-update-pedidos',
  imports: [
    CommonModule,
    FormsModule,
    SidebarCookerComponent,
    FiltrosPedidosComponent,
    TablaUpdatePedidosComponent,
    DetallesPedidoComponent,
  ],
  templateUrl: './update-pedidos.component.html',
  styleUrl: './update-pedidos.component.scss',
})
export class UpdatePedidosComponent {
  sidebarCollapsed = false;

  // Filtros
  busquedaCodigo: string = '';
  estadoSeleccionado: string = '';
  ordenFecha: string = 'reciente';

  // Datos
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];
  pedidoSeleccionado: any = null;

  // Mensajes
  mensajeExito: string = '';
  modalAbierto = false;

  private readonly _authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor(private readonly UpdatePedidosService: UpdatePedidosService) {}

  async ngOnInit(): Promise<void> {
    this._authService.verifyRoleOrSignOut().then((isValid) => {
      if (!isValid) {
        this.router.navigate(['/auth/log-in']);
      }
    });
    this.pedidos = await this.UpdatePedidosService.obtenerPedidos();
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this._authService.verifyRoleOrSignOut().then((isValid) => {
      if (!isValid) {
        this.router.navigate(['/auth/log-in']);
      }
    });
    const codigo = this.busquedaCodigo.toLowerCase();
    const estado = this.estadoSeleccionado;

    // Filtrar por código y estado
    let filtrados = this.pedidos.filter(
      (pedido) =>
        pedido.codigo.toLowerCase().includes(codigo) &&
        (estado ? pedido.estado === estado : true)
    );

    // Ordenar por fecha
    filtrados = filtrados.sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return this.ordenFecha === 'reciente'
        ? fechaB.getTime() - fechaA.getTime()
        : fechaA.getTime() - fechaB.getTime();
    });

    this.pedidosFiltrados = filtrados;
  }

  async reiniciarFiltros(): Promise<void> {
    this.busquedaCodigo = '';
    this.estadoSeleccionado = '';
    this.ordenFecha = 'reciente';
    this.pedidos = await this.UpdatePedidosService.obtenerPedidos();
    this.aplicarFiltros();
  }

  actualizarEstadoPedido(event: { pedido: any; nuevoEstado: string }): void {
    const index = this.pedidos.findIndex(
      (p) => p.codigo === event.pedido.codigo
    );
    if (index !== -1) {
      this.UpdatePedidosService.actualizarEstadoPedido(event.pedido);
      this.mostrarMensajeExito(
        `Estado de pedido ${event.pedido.codigo} actualizado a "${event.nuevoEstado}"`
      );
      setTimeout(() => {
        alert('Pedido actualizado correctamente');
        window.location.reload();
      }, 2000);
    }
  }

  mostrarMensajeExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    setTimeout(() => (this.mensajeExito = ''), 3000);
  }

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }

  abrirModal(pedido: any): void {
    this.pedidoSeleccionado = pedido;
    this.modalAbierto = true;
  }
  cerrarModal(): void {
    this.modalAbierto = false;
  }
}
