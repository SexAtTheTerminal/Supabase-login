import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filtros-receipts',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filtros-receipts.component.html',
  styleUrls: ['./filtros-receipts.component.scss'],
})
export class FiltrosReceiptsComponent {
  @Input() busquedaCodigo: string = '';
  @Input() metodoSeleccionado: string = '';
  @Input() ordenFecha: string = 'reciente';

  @Output() busquedaCodigoChange = new EventEmitter<string>();
  @Output() metodoSeleccionadoChange = new EventEmitter<string>();
  @Output() ordenFechaChange = new EventEmitter<string>();
  @Output() reiniciar = new EventEmitter<void>();

  metodosPago: string[] = ['Efectivo', 'Online'];

  emitirBusquedaCodigo(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.busquedaCodigoChange.emit(valor);
  }

  emitirMetodoSeleccionado(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.metodoSeleccionadoChange.emit(valor);
  }

  reiniciarFiltros() {
    this.reiniciar.emit();
  }
}
