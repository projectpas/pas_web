import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { AccountingPagesComponent } from './accounting-pages.component';
import { CreateBatchComponent } from '../components/accounting/general-ledger/Journals/create-batch/create-batch.component';
import { ViewBatchTsComponent } from '../components/accounting/general-ledger/Journals/view-batch/view-batch.component';
import { CreateJournelComponent } from '../components/accounting/general-ledger/Journals/create-journel/create-journel.component';
import { ImportComponent } from '../components/accounting/general-ledger/Journals/import/import.component';
import { ScheduleComponent } from '../components/accounting/general-ledger/Journals/schedule/schedule.component';
import { ListJournelComponent } from '../components/accounting/general-ledger/Journals/list-journel/list-journel.component';
//import { NodeSetupComponent } from '../components/accounting/general-ledger/node-setup/node-setup.component';

const accountingPagesRoutes: Routes = [
    {
        path: 'accountpages',
        component: AccountingPagesComponent,
        children: [
            { path: "app-view-batch", component: ViewBatchTsComponent, data: { title: "ViewBatch" } },
            { path: "app-create-batch", component: CreateBatchComponent, data: { title: "CreateBatch" } },            
            { path: "app-import", component: ImportComponent, data: { title: "import Component" } },
            
            { path: "app-list-journel", component: ListJournelComponent, data: { title: "Journel List" } },
            { path: "app-create-journel", component: CreateJournelComponent, data: { title: "Create Journel" } },            
            { path: "app-schedule", component: ScheduleComponent, data: { title: "Schedule" } },
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(accountingPagesRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthService, AuthGuard
    ]
})
export class AccountingPagesRoutingModule { }