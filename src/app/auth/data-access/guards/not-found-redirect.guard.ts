import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';

export const notFoundRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.currentRole;

  switch (role) {
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
      break;
  }

  return false;
};
