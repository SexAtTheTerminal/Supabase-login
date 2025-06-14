import { Component } from '@angular/core';
import { SidebarCasherComponent } from '../../../sidebar/features/sidebar-casher/sidebar-casher.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemSearchComponent } from '../../../shared/modals/item-search/item-search.component';

interface Producto {
  descripcion: string;
  tipo: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

@Component({
  selector: 'app-registrar-pedidos',
  imports: [
    SidebarCasherComponent,
    CommonModule,
    RouterLink,
    FormsModule,
    ItemSearchComponent,
  ],
  templateUrl: './registrar-pedidos.component.html',
  styleUrl: './registrar-pedidos.component.scss',
})
export class RegistrarPedidosComponent {
  sidebarCollapsed = false;
  items: any[] = [];
  mesas: any[] = ['Mesa #1', 'Mesa #2', 'Mesa #3'];
  modalidades: any[] = ['En Mesa', 'Delivery'];
  cocineros: any[] = ['Cocinero #1', 'Cocinero #2', 'Cocinero #3'];
  showItemSearch = false;
  modalidadSeleccionada: string = '';
  cocineroSeleccionado: string = '';
  mesaSeleccionada: string = '';

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }

  agregarItem2(item: any) {
    // Aquí agregas el ítem a tu tabla dinámica
    const isCopy = this.items.some((i) => i.id === item.id);

    if (!isCopy) {
      const nuevo = {
        ...item,
      };
      this.items.push(nuevo);
    } else {
      console.log('Ya fue agregado');
    }
  }

  eliminarItem(item: any) {
    this.items = this.items.filter((i) => i !== item);
  }

  incrementarCantidad(item: any) {
    if (item.cantidad == null) item.cantidad = 0;
    item.cantidad++;
  }

  actualizarCantidad(item: any, delta: number) {
    item.cantidad = Math.max(1, item.cantidad + delta);
    item.subtotal = item.cantidad * item.precioUnitario;
  }

  limpiarItems() {
    this.items = [];
  }
}
