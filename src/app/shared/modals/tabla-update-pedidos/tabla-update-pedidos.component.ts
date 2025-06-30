import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla-update-pedidos',
  imports: [CommonModule, FormsModule],
  templateUrl: './tabla-update-pedidos.component.html',
  styleUrl: './tabla-update-pedidos.component.scss',
})
export class TablaUpdatePedidosComponent implements OnChanges {
  @Input() pedidos: any[] = [];
  @Output() verDetalle = new EventEmitter<any>();
  @Output() estadoActualizado = new EventEmitter<{
    pedido: any;
    nuevoEstado: string;
  }>();

  pagina = 1;
  elementosPorPagina = 8;
  paginaActual: any[] = [];
  totalPaginas = 1;

  ngOnChanges() {
    this.pedidos.forEach((pedido) => {
      pedido.estadoTemp = pedido.estado; // Inicializa estado temporal
    });
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

  confirmarCambioEstado(pedido: any) {
    if (pedido.estado !== pedido.estadoTemp) {
      this.estadoActualizado.emit({ pedido, nuevoEstado: pedido.estadoTemp });
    } else {
      alert('Este pedido ya tiene el estado seleccionado');
    }
  }

  abrirDetalle(pedido: any) {
    this.verDetalle.emit(pedido);
  }
}
