import { Component } from '@angular/core';
import { SidebarCookerComponent } from '../../../sidebar/features/sidebar-casher/sidebar-casher.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-cashier',
  standalone: true,
  imports: [SidebarCookerComponent, CommonModule, RouterLink],
  templateUrl: './view-cashier.component.html',
  styleUrl: './view-cashier.component.scss',
})
export class ViewCashierComponent {
  sidebarCollapsed = false;

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }
}
