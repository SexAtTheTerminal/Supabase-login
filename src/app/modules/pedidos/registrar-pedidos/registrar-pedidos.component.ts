import { Component } from '@angular/core';
import { SidebarCasherComponent } from "../../../sidebar/features/sidebar-casher/sidebar-casher.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registrar-pedidos',
  imports: [SidebarCasherComponent, CommonModule, RouterLink],
  templateUrl: './registrar-pedidos.component.html',
  styleUrl: './registrar-pedidos.component.scss',
})
export class RegistrarPedidosComponent {

  sidebarCollapsed = false;

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }
}
