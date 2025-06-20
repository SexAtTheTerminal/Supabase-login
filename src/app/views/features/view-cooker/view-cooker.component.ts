import { Component } from '@angular/core';
import { SidebarCookerComponent } from '../../../sidebar/features/sidebar-cooker/sidebar-cooker.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-cooker',
  imports: [SidebarCookerComponent, CommonModule, RouterLink],
  templateUrl: './view-cooker.component.html',
  styleUrl: './view-cooker.component.scss',
})
export class ViewCookerComponent {
  sidebarCollapsed = false;

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }
}
