import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { AccountsPayblePagesComponent } from './accounts-payble-pages.component';
import { OpenCloseApSubledgerComponent } from '../components/account-payble/open-close-ap-subledger/open-close-ap-subledger.component';

const accountingPaybleRoutes: Routes = [
    {
        path: 'accountpayble',
        component: AccountsPayblePagesComponent,
        children: [

            { path: "app-open-close-ap-subledger", component: OpenCloseApSubledgerComponent, data: { title: "ap-subledger" } },

        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(accountingPaybleRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthService, AuthGuard
    ]
})
export class AccountingPaybleRoutingModule { }