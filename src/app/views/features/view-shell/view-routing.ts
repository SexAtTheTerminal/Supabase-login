import { Routes } from '@angular/router';
import { ViewCashierComponent } from '../view-cashier/view-cashier.component';

export default [
    {
        path: '', component:ViewCashierComponent
    },
    {
        path: '**',
        redirectTo: '/',
    }
] as Routes