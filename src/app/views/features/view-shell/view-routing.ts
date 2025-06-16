import { Routes } from '@angular/router';
import { ViewCashierComponent } from '../view-cashier/view-cashier.component';
import { ViewCookerComponent } from '../view-cooker/view-cooker.component';
import { RegistrarCobroComponent } from '../../../modules/pagos/registrar-cobro/registrar-cobro.component';
import { ConsultarPedidosComponent } from '../../../modules/pedidos/consultar-pedidos/consultar-pedidos.component';
import { RegistrarPedidosComponent } from '../../../modules/pedidos/registrar-pedidos/registrar-pedidos.component';
import { ViewAdminComponent } from '../view-admin/view-admin.component';
import { DetailsComponent } from '../../../admin/features/details/details.component';
import { ReceiptsComponent } from '../../../admin/features/receipts/receipts.component';

export default [
  {
    path: 'cashier',
    component: ViewCashierComponent
  },
  {
    path: 'cashier/pagos/registrar-cobro',
    component: RegistrarCobroComponent,
  },
  {
    path: 'cashier/pedidos/consultar-pedidos',
    component: ConsultarPedidosComponent
  },
  {
    path: 'cashier/pedidos/registrar-pedidos',
    component: RegistrarPedidosComponent
  },
  {
    path: 'cooker',
    component: ViewCookerComponent,
  },
  {
    path: 'admin',
    component: ViewAdminComponent,
  },
  {
    path: 'admin/details',
    component: DetailsComponent,
  },
  {
    path: 'admin/receipts',
    component: ReceiptsComponent,
  },
  {
    path: '**',
    redirectTo: '/cashier',
  }
] as Routes;
