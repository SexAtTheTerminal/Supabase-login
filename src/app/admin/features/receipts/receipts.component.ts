import { Component } from '@angular/core';
import { SidebarAdminComponent } from '../../../sidebar/features/sidebar-admin/sidebar-admin.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-receipts',
  imports: [SidebarAdminComponent, CommonModule, RouterLink],
  templateUrl: './receipts.component.html',
  styleUrl: './receipts.component.scss'
})
export class ReceiptsComponent {
  sidebarCollapsed = false;
  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }
}
