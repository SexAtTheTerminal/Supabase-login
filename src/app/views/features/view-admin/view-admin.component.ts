import { Component } from '@angular/core';
import { SidebarAdminComponent } from '../../../sidebar/features/sidebar-admin/sidebar-admin.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-admin',
  standalone: true,
  imports: [SidebarAdminComponent, CommonModule, RouterLink],
  templateUrl: './view-admin.component.html',
  styleUrl: './view-admin.component.scss',
})
export class ViewAdminComponent {
  sidebarCollapsed = false;

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }

  goToReceipts() {
    // Implementación real que navega a la ruta de comprobantes
  }
}
