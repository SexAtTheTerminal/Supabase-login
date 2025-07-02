import { Component } from '@angular/core';
import { SidebarAdminComponent } from '../../../sidebar/features/sidebar-admin/sidebar-admin.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth.service';
import { SupabaseService } from '../../../shared/data-access/supabase.service';

@Component({
  selector: 'app-view-admin',
  standalone: true,
  imports: [SidebarAdminComponent, CommonModule, RouterLink],
  templateUrl: './view-admin.component.html',
  styleUrl: './view-admin.component.scss',
})
export class ViewAdminComponent {
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
