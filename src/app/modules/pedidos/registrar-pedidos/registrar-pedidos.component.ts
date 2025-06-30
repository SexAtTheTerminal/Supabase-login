import { Component, OnInit } from '@angular/core';
import { SidebarCookerComponent } from '../../../sidebar/features/sidebar-casher/sidebar-casher.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemSearchComponent } from '../../../shared/modals/item-search/item-search.component';
import { RegistrarPedidosService } from '../../../services/data-access/registrar-pedidos/registrar-pedidos.service';

interface Producto {
  descripcion: string;
  tipo: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Mesa {
  idMesa: number;
  numeroMesa: string;
}

interface Modalidad {
  idModalidad: number;
  nombreModalidad: string;
}

@Component({
  selector: 'app-registrar-pedidos',
  imports: [
    SidebarCookerComponent,
    CommonModule,
    RouterLink,
    FormsModule,
    ItemSearchComponent,
  ],
  templateUrl: './registrar-pedidos.component.html',
  styleUrl: './registrar-pedidos.component.scss',
})
export class RegistrarPedidosComponent implements OnInit {
  sidebarCollapsed = false;
  items: any[] = [];
  mesas: any[] = [];
  modalidades: any[] = [];
  showItemSearch = false;
  modalidadSeleccionada: Modalidad | null = null;
  mesaSeleccionada: Mesa | null = null;

  constructor(
    private readonly registrarPedidosService: RegistrarPedidosService
  ) {}

  async ngOnInit() {
    this.mesas = await this.registrarPedidosService.obtenerMesas();
    this.modalidades = await this.registrarPedidosService.obtenerModalidad();
  }

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }

  agregarItem(item: any) {
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

  async registrarPedido() {
    const montoTotal = this.items.reduce((acc, item) => acc + item.subtotal, 0);
    console.log(montoTotal);
    const exito = await this.registrarPedidosService.agregarPedidoConDetalles(
      this.mesaSeleccionada!.idMesa,
      this.modalidadSeleccionada!.idModalidad,
      montoTotal,
      false,
      this.items
    );

    if (exito) {
      alert('Pedido registrado correctamente');
      this.limpiarVentana();
    } else {
      alert('Ocurrió un error al registrar el pedido');
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

  limpiarVentana() {
    this.items = [];
    this.mesaSeleccionada = null;
    this.modalidadSeleccionada = null;
  }
}
