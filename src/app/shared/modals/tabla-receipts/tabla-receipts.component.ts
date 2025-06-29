import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tabla-receipts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tabla-receipts.component.html',
  styleUrls: ['./tabla-receipts.component.scss']
})

export class TablaReceiptsComponent implements OnChanges {
  @Input() pagos: any[] = [];
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
      this.pagos.length / this.elementosPorPagina
    );
    const inicio = (this.pagina - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.paginaActual = this.pagos.slice(inicio, fin);
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

  abrirDetalle(pago: any) {
    this.verDetalle.emit(pago);
  }

  eliminarPago(pago: any) {
    this.eliminar.emit(pago);
    this.pagina = 1;
    this.actualizarPaginacion();
  }
}