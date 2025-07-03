import { Routes } from '@angular/router';

export default [
  {
    path: 'log-in',
    loadComponent: () => import('../auth-log-in/auth-log-in.component'),
  },
  {
    path: '**',
    redirectTo: 'log-in',
  },
] as Routes;
