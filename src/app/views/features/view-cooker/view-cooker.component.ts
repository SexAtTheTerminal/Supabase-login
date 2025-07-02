import { Component, inject } from '@angular/core';
import { SidebarCookerComponent } from '../../../sidebar/features/sidebar-cooker/sidebar-cooker.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth.service';
import { SupabaseService } from '../../../shared/data-access/supabase.service';

@Component({
  selector: 'app-view-cooker',
  imports: [SidebarCookerComponent, CommonModule, RouterLink],
  templateUrl: './view-cooker.component.html',
  styleUrl: './view-cooker.component.scss',
})
export class ViewCookerComponent {
  sidebarCollapsed = false;
  userData: any;

  private readonly authService = inject(AuthService);
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);

  async ngOnInit() {
    this.authService.verifyRoleOrSignOut().then((isValid) => {
      if (!isValid) {
        this.router.navigate(['/auth/log-in']);
      }
    });
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
