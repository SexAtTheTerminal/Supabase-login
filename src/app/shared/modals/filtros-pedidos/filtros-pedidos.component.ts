import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtros-pedidos',
  imports: [CommonModule, FormsModule],
  templateUrl: './filtros-pedidos.component.html',
  styleUrl: './filtros-pedidos.component.scss',
})
export class FiltrosPedidosComponent {
  @Input() busquedaCodigo: string = '';
  @Input() estadoSeleccionado: string = '';
  @Input() ordenFecha: string = 'reciente';
  @Input() mostrarFiltroEstado: boolean = true;

  @Output() busquedaCodigoChange = new EventEmitter<string>();
  @Output() estadoSeleccionadoChange = new EventEmitter<string>();
  @Output() ordenFechaChange = new EventEmitter<string>();
  @Output() reiniciar = new EventEmitter<void>();

  emitirBusquedaCodigo(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.busquedaCodigoChange.emit(valor);
  }

  emitirEstadoSeleccionado(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.estadoSeleccionadoChange.emit(valor);
  }

  reiniciarFiltros() {
    this.reiniciar.emit();
  }
}
