import { NgModule } from '@angular/core';
import { AccountsReceivableComponent } from './accounts-receivable.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { OpenCloseArsubledgerComponent } from '../components/accounts-receivable/open-close-ar-subledger/open-close-ar-subledger.component';
import { CustomerInvoiceListComponent } from '../components/accounts-receivable/customer-invoice-list/customer-invoice-list.component';


const accountReceivablePagesRoutes: Routes = [
    {
        path: 'accountreceivablepages',
        component: AccountsReceivableComponent,
        children: [
            { path: "app-customer-invoice-list", component: CustomerInvoiceListComponent, data: { title: "Customer Invoice List" } },
            { path: "app-open-close-ar-subledger", component: OpenCloseArsubledgerComponent, data: { title: "open-close-AR-subledger" } }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(accountReceivablePagesRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthService, AuthGuard
    ]

})
export class AccountreceivableRoutingModule {
}