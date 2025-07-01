import { Routes } from '@angular/router';
import { ViewCashierComponent } from '../view-cashier/view-cashier.component';
import { ViewCookerComponent } from '../view-cooker/view-cooker.component';
import { RegistrarCobroComponent } from '../../../modules/pagos/registrar-cobro/registrar-cobro.component';
import { ConsultarPedidosComponent } from '../../../modules/pedidos/consultar-pedidos/consultar-pedidos.component';
import { RegistrarPedidosComponent } from '../../../modules/pedidos/registrar-pedidos/registrar-pedidos.component';
import { UpdatePedidosComponent } from '../../../modules/pedidos/update-pedidos/update-pedidos.component';
import { roleGuard } from '../../../auth/data-access/guards/role.guard';
import { notFoundRedirectGuard } from '../../../auth/data-access/guards/not-found-redirect.guard';
import { RedirectComponent } from '../../../shared/components/redirect/redirect.component';
import { ViewAdminComponent } from '../view-admin/view-admin.component';
import { DetailsComponent } from '../../../modules/comprobantes/details/details.component';
import { ReceiptsComponent } from '../../../modules/comprobantes/receipts/receipts.component';
import { RecordComponent } from '../../../modules/comprobantes/record/record.component';

export default [
  {
    path: 'cashier',
    canActivate: [roleGuard(['Cajero'])],
    component: ViewCashierComponent,
  },
  {
    path: 'cashier/pagos/registrar-cobro',
    canActivate: [roleGuard(['Cajero'])],
    component: RegistrarCobroComponent,
  },
  {
    path: 'cashier/pedidos/consultar-pedidos',
    canActivate: [roleGuard(['Cajero'])],
    component: ConsultarPedidosComponent,
  },
  {
    path: 'cashier/pedidos/registrar-pedidos',
    canActivate: [roleGuard(['Cajero'])],
    component: RegistrarPedidosComponent,
  },
  {
    path: 'cooker',
    canActivate: [roleGuard(['Cocinero'])],
    component: ViewCookerComponent,
  },
  {
    path: 'cooker/pedidos/consultar-pedidos',
    canActivate: [roleGuard(['Cocinero'])],
    component: ConsultarPedidosComponent,
  },
  {
    path: 'cooker/pedidos/update-pedidos',
    canActivate: [roleGuard(['Cocinero'])],
    component: UpdatePedidosComponent,
  },
  {
    path: 'admin',
    canActivate: [roleGuard(['Administrador'])],
    component: ViewAdminComponent,
  },
  {
    path: 'admin/details',
    canActivate: [roleGuard(['Administrador'])],
    component: DetailsComponent,
  },
  {
    path: 'admin/receipts',
    canActivate: [roleGuard(['Administrador'])],
    component: ReceiptsComponent,
  },
  {
    path: 'admin/record',
    component: RecordComponent,
  },
  {
    path: '**',
    canActivate: [notFoundRedirectGuard],
    component: RedirectComponent, // opcional: puedes usar un componente vacío si lo requiere el router
  },
] as Routes;
