
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.scss']
})
export class SidebarAdminComponent {
  private _authService = inject(AuthService);

  private _router = inject(Router);
  @Output() sidebarStateChange = new EventEmitter<boolean>();

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.sidebarStateChange.emit(this.sidebarCollapsed);
  }

  isCollapsed = false;
  isComprobantesOpen: boolean = false;
  isPagosOpen: boolean = false;
  isLogoOpen: boolean = false;
  sidebarCollapsed = false;


  
  async logOut() {
    await this._authService.signOut();
    // Redirige al usuario a la página de login.
    this._router.navigateByUrl('/auth/log-in');
  }

  toggleLogo(): void {
    this.isLogoOpen = !this.isLogoOpen;
  }
   toggleComprobantesDropdown(): void {
    this.isComprobantesOpen = !this.isComprobantesOpen;
  }


  

}
