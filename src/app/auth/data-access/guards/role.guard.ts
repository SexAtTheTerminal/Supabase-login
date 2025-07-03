import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export function roleGuard(expectedRoles: string[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.currentRole;

    // Si no tiene rol o el rol no está en los permitidos
    if (!userRole || !expectedRoles.includes(userRole)) {
      // Redireccionamos a la ruta por defecto de su rol
      switch (userRole) {
        case 'Cocinero':
          router.navigateByUrl('/cooker');
          break;
        case 'Cajero':
          router.navigateByUrl('/cashier');
          break;
        case 'Administrador':
          router.navigateByUrl('/admin');
          break;
        default:
          router.navigateByUrl('/auth/log-in');
      }

      return false;
    }

    return true;
  };
}
