import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './item-search.component.html',
  styleUrl: './item-search.component.scss',
})
export class ItemSearchComponent {
  searchTerm = '';
  selectedCategory = '';
  categorias = ['Bebidas', 'Comidas', 'Postres'];

  @Output() close = new EventEmitter<void>();
  @Output() itemSelected = new EventEmitter<any>();

  items = [
    {
      id: 1,
      descripcion: 'Ceviche',
      precio: 25.0,
      tipo: 'CARTA',
      unidad: 'PLATO',
      cantidad: 1,
      precioUnitario: 25.0,
      subtotal: 25.0,
      seleccionado: false,
    },
    {
      id: 2,
      descripcion: 'Lomo Saltado',
      precio: 30.0,
      tipo: 'CARTA',
      unidad: 'PLATO',
      cantidad: 1,
      precioUnitario: 30.0,
      subtotal: 30.0,
      seleccionado: false,
    },
    // ... lista mock para ahora
  ];

  get filteredItems() {
    return this.items.filter(
      (item) =>
        item.descripcion
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) &&
        (this.selectedCategory
          ? item.tipo === this.selectedCategory
          : true)
    );
  }

  seleccionar(item: any) {
    this.itemSelected.emit(item);
  }

  agregarSeleccionados() {
    const seleccionados = this.items.filter((item) => item.seleccionado);
    this.itemSelected.emit(seleccionados);
    // Limpiar selección si deseas
  }
}
