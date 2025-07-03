import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-usuarios.component.html',
  styleUrl: './tabla-usuarios.component.scss'
})
export class TablaUsuariosComponent {
 @Input() usuarios: any[] = [];
  @Output() editarUsuario = new EventEmitter<any>();
  @Output() eliminarUsuario = new EventEmitter<any>();

  pagina = 1;
  elementosPorPagina = 5;
  paginaActual: any[] = [];
  totalPaginas = 1;

  ngOnChanges() {
    this.actualizarPaginacion();
  }

  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(
      this.usuarios.length / this.elementosPorPagina
    );
    const inicio = (this.pagina - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.paginaActual = this.usuarios.slice(inicio, fin);
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
}