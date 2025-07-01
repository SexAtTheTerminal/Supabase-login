import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filtros-usuarios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filtros-usuarios.component.html',
  styleUrl: './filtros-usuarios.component.scss'
})
export class FiltrosUsuariosComponent {
@Input() busquedaCodigo: string = '';
  @Input() busquedaNombre: string = '';
  @Input() filtroCargo: string = '';

  @Output() busquedaCodigoChange = new EventEmitter<string>();
  @Output() busquedaNombreChange = new EventEmitter<string>();
  @Output() filtroCargoChange = new EventEmitter<string>();
  @Output() reiniciar = new EventEmitter<void>();
  @Output() crearUsuario = new EventEmitter<void>();

  estados: string[] = [
    'DNI',
    'Nombre y Apellidos',
    'Correo Electrónico'
  ];

  cargos: string[] = [
    'Administrador',
    'Mesero',
    'Cajero',
    'Cocinero',
    'Gerente'
  ];

  emitirBusquedaCodigo(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.busquedaCodigoChange.emit(valor);
  }

  emitirBusquedaNombre(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.busquedaNombreChange.emit(valor);
  }

  emitirFiltroCargo(event: Event) {
    const valor = (event.target as HTMLSelectElement).value;
    this.filtroCargoChange.emit(valor);
  }
  onCrearUsuario() {
  this.crearUsuario.emit();
}

  reiniciarFiltros() {
    this.reiniciar.emit();
  }
}
