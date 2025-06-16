import { Component, OnInit } from '@angular/core';
import { SidebarCasherComponent } from '../../../sidebar/features/sidebar-casher/sidebar-casher.component';
import { CommonModule } from '@angular/common';
import { DetallesPedidoComponent } from '../../../shared/modals/detalles-pedido/detalles-pedido.component';
import { FormsModule } from '@angular/forms';
import { TablaPedidosComponent } from '../../../shared/modals/tabla-pedidos/tabla-pedidos.component';
import { ConsultarPedidosService } from '../../../services/data-access/consultar-pedidos.service';
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

  ngOnInit(): void {
    this.pedidos = this.consultarPedidosService.obtenerPedidos();
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    const codigo = this.busquedaCodigo.toLowerCase();
    const estado = this.estadoSeleccionado;

    // Filtrar por código y estado
    this.pedidosFiltrados = this.pedidos.filter(
      (pedido) =>
        pedido.codigo.toLowerCase().includes(codigo) &&
        (estado ? pedido.estado === estado : true)
    );

    // Ordenar por fecha según selección
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

  eliminarPedido(pedido: any): void {
    const confirmado = confirm(`¿Eliminar el pedido ${pedido.codigo}?`);
    if (!confirmado) return;

    this.pedidos = this.pedidos.filter((p) => p.codigo !== pedido.codigo);
    this.aplicarFiltros();
    this.mostrarMensajeExito(`Pedido ${pedido.codigo} eliminado correctamente`);
  }

  mostrarMensajeExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    setTimeout(() => (this.mensajeExito = ''), 3000);
  }

  reiniciarFiltros(): void {
    this.busquedaCodigo = '';
    this.estadoSeleccionado = '';
    this.pedidos = this.consultarPedidosService.obtenerPedidos();
    this.aplicarFiltros();
  }

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }
}
