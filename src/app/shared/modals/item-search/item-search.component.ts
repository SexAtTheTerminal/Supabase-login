import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistrarPedidosService } from '../../../services/data-access/registrar-pedidos/registrar-pedidos.service';

@Component({
  selector: 'app-item-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './item-search.component.html',
  styleUrl: './item-search.component.scss',
})
export class ItemSearchComponent implements OnInit {

  searchTerm = '';
  selectedCategory = '';
  categorias = ['Bebidas', 'Comidas', 'Postres'];

  @Output() close = new EventEmitter<void>();
  @Output() itemSelected = new EventEmitter<any>();

  constructor( private readonly registrarPedidosService: RegistrarPedidosService){}
  items: any[] = [];

  async ngOnInit() {
    this.items = await this.registrarPedidosService.obtenerProductosDesdeDB();
  }
  
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
