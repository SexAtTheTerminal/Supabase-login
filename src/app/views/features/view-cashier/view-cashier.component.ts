import { Component } from '@angular/core';
import { SidebarCasherComponent } from '../../../sidebar/features/sidebar-casher/sidebar-casher.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-cashier',
  imports: [SidebarCasherComponent, CommonModule],
  templateUrl: './view-cashier.component.html',
  styleUrl: './view-cashier.component.scss',
})
export class ViewCashierComponent {

  sidebarCollapsed = false;

  onSidebarToggle(state: boolean): void{
    this.sidebarCollapsed = state;
  }
}
