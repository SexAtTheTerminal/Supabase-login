import { Routes } from '@angular/router';
import { ViewCashierComponent } from '../view-cashier/view-cashier.component';
import { ViewCookerComponent } from '../view-cooker/view-cooker.component';
import { RegistrarCobroComponent } from '../../../modules/pagos/registrar-cobro/registrar-cobro.component';

export default [
  {
    path: 'cashier',
    component: ViewCashierComponent,
  },
  {
    path: 'cashier/pagos/registrar_cobro',
    component: RegistrarCobroComponent,
  },
  {
    path: 'cooker',
    component: ViewCookerComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
] as Routes;
