// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { QuickAppProMaterialModule } from "../modules/material.module";
import { GroupByPipe } from '../pipes/group-by.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common'; //<-- This one
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from "primeng/autocomplete";
import { GMapModule } from 'primeng/gmap';
import { AddActionsDialogComponent } from '../components/dialogs/add-actions-dialog/add-actions-dialog.component';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepsModule } from 'primeng/steps';//Prime Ng Steps
import { DialogModule } from 'primeng/dialog'; //Prime Ng Dailog
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputSwitchModule } from "primeng/inputswitch";
import { CalendarModule } from "primeng/calendar";
import { AccountingPagesComponent } from "./accounting-pages.component";
//import { NodeSetupComponent } from "../components/accounting/general-ledger/node-setup/node-setup.component";
import { AccountingPagesRoutingModule } from "./accountingpages-routing.module";
import { CreateBatchComponent } from "../components/accounting/general-ledger/Journals/create-batch/create-batch.component";
import { ViewBatchTsComponent } from "../components/accounting/general-ledger/Journals/view-batch/view-batch.component";
import { JournelService } from "../services/journals/journals.service";
import { JournelsEndpointService } from "../services/journals/journals-endpoint.service";
import { CreateJournelComponent } from "../components/accounting/general-ledger/Journals/create-journel/create-journel.component";
import { ImportComponent } from "../components/accounting/general-ledger/Journals/import/import.component";
import { ScheduleComponent } from "../components/accounting/general-ledger/Journals/schedule/schedule.component";
import { JournelStepsComponent } from "../components/accounting/general-ledger/Journals/journel-steps/journel-steps.component";
import { ListJournelComponent } from "../components/accounting/general-ledger/Journals/list-journel/list-journel.component";



@NgModule({
    imports: [
        FlexLayoutModule,
        FormsModule, ReactiveFormsModule,
        QuickAppProMaterialModule,
        TranslateModule,
        CommonModule,
        TableModule,
        ButtonModule,
        SelectButtonModule,
        InputTextModule,
        MultiSelectModule,
        InputSwitchModule,
        AutoCompleteModule,
        CalendarModule,
        GMapModule, RadioButtonModule, FileUploadModule, DialogModule, StepsModule, BreadcrumbModule, AccountingPagesRoutingModule
    ],
    declarations: [AccountingPagesComponent,
        // NodeSetupComponent,
        CreateBatchComponent,
        ViewBatchTsComponent,
        CreateJournelComponent,
        ImportComponent,
        ScheduleComponent,
        JournelStepsComponent,
        ListJournelComponent

    ],
    providers: [JournelService, JournelsEndpointService

    ],
    entryComponents: [
    ]
})
export class AccountingPagesModule {

}