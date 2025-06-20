import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-detalles-pedido',
  imports: [CommonModule],
  templateUrl: './detalles-pedido.component.html',
  styleUrl: './detalles-pedido.component.scss',
})
export class DetallesPedidoComponent {
  @Input() pedido: any;
  @Output() cerrar = new EventEmitter<void>();

  onClose() {
    this.cerrar.emit();
  }

  pedidoSeleccionado = {
    codigo: '00000001',
    mesa: '05',
    fecha: new Date(),
    estado: 'pendiente', // o 'finalizado'
    items: [
      { nombre: 'Pizza Margarita', cantidad: 2 },
      { nombre: 'Coca-Cola 500ml', cantidad: 1 },
    ],
  };
}
