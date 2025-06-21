import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla-pedidos',
  imports: [CommonModule, FormsModule],
  templateUrl: './tabla-pedidos.component.html',
  styleUrl: './tabla-pedidos.component.scss',
})
export class TablaPedidosComponent {
  @Input() pedidos: any[] = [];
  @Output() verDetalle = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  pagina = 1;
  elementosPorPagina = 5;
  paginaActual: any[] = [];
  totalPaginas = 1;

  ngOnChanges() {
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(
      this.pedidos.length / this.elementosPorPagina
    );
    const inicio = (this.pagina - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.paginaActual = this.pedidos.slice(inicio, fin);
  }

  paginaAnterior() {
    if (this.pagina > 1) {
      this.pagina--;
      this.actualizarPaginacion();
    }
  }

  paginaSiguiente() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.actualizarPaginacion();
    }
  }

  abrirDetalle(pedido: any) {
    this.verDetalle.emit(pedido);
  }

  eliminarPedido(pedido: any) {
    this.eliminar.emit(pedido);
    // Reiniciar a página 1 luego de eliminar un elemento :v
    this.pagina = 1;
    this.actualizarPaginacion();
  }
}
