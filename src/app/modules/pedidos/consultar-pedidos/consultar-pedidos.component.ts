import { Component, OnInit } from '@angular/core';
import { SidebarCasherComponent } from '../../../sidebar/features/sidebar-casher/sidebar-casher.component';
import { CommonModule } from '@angular/common';
import { DetallesPedidoComponent } from '../../../shared/modals/detalles-pedido/detalles-pedido.component';
import { FormsModule } from '@angular/forms';
import { TablaPedidosComponent } from '../../../shared/modals/tabla-pedidos/tabla-pedidos.component';
import { ConsultarPedidosService } from '../../../services/data-access/consultar-pedidos/consultar-pedidos.service';
import { FiltrosPedidosComponent } from '../../../shared/modals/filtros-pedidos/filtros-pedidos.component';

@Component({
  selector: 'app-consultar-pedidos',
  imports: [
    SidebarCasherComponent,
    CommonModule,
    DetallesPedidoComponent,
    FormsModule,
    TablaPedidosComponent,
    FiltrosPedidosComponent,
  ],
  templateUrl: './consultar-pedidos.component.html',
  styleUrl: './consultar-pedidos.component.scss',
})
export class ConsultarPedidosComponent implements OnInit {
  sidebarCollapsed = false;

  // Filtros
  busquedaCodigo = '';
  estadoSeleccionado = '';
  ordenFecha: string = 'reciente';

  // Datos
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];

  // UI
  mensajeExito = '';
  modalAbierto = false;
  pedidoSeleccionado: any = null;

  // Resumen
  resumen = { finalizados: 0, pendientes: 0 };

  constructor(
    private readonly consultarPedidosService: ConsultarPedidosService
  ) {}

  async ngOnInit() {
    this.pedidos = await this.consultarPedidosService.obtenerPedidosDesdeDB();
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    const codigo = this.busquedaCodigo.toLowerCase();
    const estado = this.estadoSeleccionado;

    // Filtrar por código y estado wasaaa
    this.pedidosFiltrados = this.pedidos.filter(
      (pedido) =>
        pedido.codigo.toLowerCase().includes(codigo) &&
        (estado ? pedido.estado === estado : true)
    );

    // Ordenar por fecha wasaaaa
    this.pedidosFiltrados.sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return this.ordenFecha === 'reciente'
        ? fechaB.getTime() - fechaA.getTime()
        : fechaA.getTime() - fechaB.getTime();
    });

    this.actualizarResumen();
  }

  actualizarResumen(): void {
    const finalizados = this.pedidosFiltrados.filter(
      (p) => p.estado === 'finalizado'
    ).length;
    const pendientes = this.pedidosFiltrados.filter(
      (p) => p.estado === 'pendiente'
    ).length;
    this.resumen = { finalizados, pendientes };
  }

  abrirModal(pedido: any): void {
    this.pedidoSeleccionado = pedido;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  async eliminarPedido(pedido: any): Promise<void> {
    const confirmado = confirm(`¿Eliminar el pedido ${pedido.codigo}?`);
    if (!confirmado) return;

    const exito = await this.consultarPedidosService.eliminarPedido(
      pedido.idPedido
    );

    if (exito) {
      this.pedidos = this.pedidos.filter((p) => p.idPedido !== pedido.idPedido);
      this.aplicarFiltros();

      this.mostrarMensajeExito(
        `Pedido ${pedido.codigo} eliminado correctamente`
      );
    } else {
      alert('Ocurrió un error al eliminar el pedido');
    }
  }

  mostrarMensajeExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    setTimeout(() => (this.mensajeExito = ''), 3000);
  }

  async reiniciarFiltros() {
    this.busquedaCodigo = '';
    this.estadoSeleccionado = '';
    this.pedidos = await this.consultarPedidosService.obtenerPedidosDesdeDB();
    this.aplicarFiltros();
  }

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }
}
