import { Component, inject, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../auth/data-access/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-casher',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar-casher.component.html',
  styleUrl: './sidebar-casher.component.scss',
})
export class SidebarCasherComponent {
  private _authService = inject(AuthService);

  private _router = inject(Router);

  sidebarCollapsed = false;
  @Output() sidebarStateChange = new EventEmitter<boolean>();

  isPedidosOpen: boolean = false;
  isPagosOpen: boolean = false;

  async logOut() {
    await this._authService.signOut();
    this._router.navigateByUrl('/auth/log-in');
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.sidebarStateChange.emit(this.sidebarCollapsed);
  }

  togglePedidosDropdown(): void{
    this.isPedidosOpen = !this.isPedidosOpen;
  }

  togglePagosDropdown(): void{
    this.isPagosOpen = !this.isPagosOpen;
  }
}
