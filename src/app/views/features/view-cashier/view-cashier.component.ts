import { Component } from '@angular/core';
import { SidebarCasherComponent } from '../../../sidebar/features/sidebar-casher/sidebar-casher.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth.service';
import { SupabaseService } from '../../../shared/data-access/supabase.service';

@Component({
  selector: 'app-view-cashier',
  standalone: true,
  imports: [SidebarCasherComponent, CommonModule, RouterLink],
  templateUrl: './view-cashier.component.html',
  styleUrl: './view-cashier.component.scss',
})
export class ViewCashierComponent {
  sidebarCollapsed = false;
  userData: any;
  
  constructor(
    private readonly authService: AuthService,
    private readonly supabase: SupabaseService
  ) {}

  async ngOnInit() {
    await this.loadUserData();
  }

  private async loadUserData() {
    try {
      // Obtener la sesión actual
      const {
        data: { session },
      } = await this.supabase.supabaseClient.auth.getSession();

      if (session?.user?.id) {
        // Usar el nuevo método para obtener los datos del usuario
        this.userData = await this.authService.getUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }
}
