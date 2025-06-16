import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../../auth/data-access/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-cooker',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-cooker.component.html',
  styleUrl: './sidebar-cooker.component.scss',
})
export class SidebarCookerComponent {
  private _authService = inject(AuthService);

  private _router = inject(Router);

  sidebarCollapsed = false;
  @Output() sidebarStateChange = new EventEmitter<boolean>();

  isPedidosOpen: boolean = false;
  isPagosOpen: boolean = false;
  isLogoOpen: boolean = false;

  async logOut() {
    await this._authService.signOut();
    this._router.navigateByUrl('/auth/log-in');
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.sidebarStateChange.emit(this.sidebarCollapsed);
  }

  togglePedidosDropdown(): void {
    this.isPedidosOpen = !this.isPedidosOpen;
  }

  toggleLogo(): void {
    this.isLogoOpen = !this.isLogoOpen;
  }
}
