import { Component } from '@angular/core';
import { SidebarAdminComponent } from '../../../sidebar/features/sidebar-admin/sidebar-admin.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-details',
  imports: [ CommonModule, SidebarAdminComponent, RouterLink ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  
  sidebarCollapsed = false;
    onSidebarToggle(state: boolean): void {
      this.sidebarCollapsed = state;
    }

}