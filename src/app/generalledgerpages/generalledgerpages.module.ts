
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { QuickAppProMaterialModule } from "../modules/material.module";
import { CommonModule } from '@angular/common'; //<-- This one
import { RouterModule, Routes } from '@angular/router';
import { GroupByPipe } from '../pipes/group-by.pipe';
import { GeneralledgerPageRoutingModule } from "./generalledgerpages-routing.component";
import { GeneralledgerPageComponent } from "./generalledgerpages.component";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AccountingCalendarComponent } from "../components/general-ledger/accounting-calendar/accounting-calendar.component";
import { JournalsComponent } from "../components/general-ledger/journals/journals.component";
import { OpenClosePeriodComponent } from "../components/general-ledger/open-close-period/open-close-period.component";
import { AccountReportsComponent } from "../components/general-ledger/account-reports/account-reports.component";
import { AccountSetupComponent } from "../components/general-ledger/account-setup/account-setup.component";
import { GeneralLedgerCurrencyComponent } from "../components/general-ledger/general-ledger-currency/general-ledger-currency.component";
import { LegalEntityStructureComponent } from "../components/general-ledger/entity/entity-list/entity-list.component";
import { ManagementStructureComponent } from "../components/general-ledger/entity/entity-setup/entity-setup.component";
import { TreeTableModule } from 'primeng/treetable';
import { EntityEditComponent } from "../components/general-ledger/entity/legal-entity-list/legal-entity-list.component";
//import { TreeNode } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { TreeModule } from 'primeng/tree';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { NodeSetupComponent } from "../components/accounting/general-ledger/node-setup/node-setup.component";
import { NodeSetupService } from "../services/node-setup/node-setup.service";
import { NodeSetupEndpointService } from "../services/node-setup/nodeSetup-endpoint.service";
import { InputSwitchModule } from 'primeng/inputswitch';
import { GlaccountListComponent } from "../components/general-ledger/glaccount-list/glaccount-list.component";
import { GlaccountCreateComponent } from "../components/general-ledger/glaccount-create/glaccount-create.component";
import { AccountCalenderService } from "../services/account-calender/accountcalender.service";
import { AccountCalenderEndpointService } from "../services/account-calender/accountcalender-endpoint.service";
import { PoRoCategoryComponent } from "../components/general-ledger/po-ro-category/po-ro-category.component";
import { POROCategoryEndpoint } from "../services/porocategory/po-ro-category-endpoint.service";
import { POROCategoryService } from "../services/porocategory/po-ro-category.service";
import { AuditModule } from "../audit/audit.module";
import { InterCompanySetupComponent } from "../components/general-ledger/intercompany-setup/intercompany-setup.component";
import { AutoCompleteModule } from "primeng/autocomplete";
import { TooltipModule } from "../../../node_modules/primeng/tooltip";
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AccountListingComponent } from "../components/general-ledger/account-listing/account-listing.component";
import { AccountListingCreateComponent } from "../components/general-ledger/account-listing-create/account-listing-create.component";
import {DropdownModule} from 'primeng/dropdown';

import { CommonService } from "../services/common.service";
import { AccountingListingCalendarComponent } from '../components/general-ledger/accounting-listing-calendar/accounting-listing-calendar.component';
import { OpenCloseLedgerComponent } from '../components/general-ledger/open-close-ledger/open-close-ledger.component';

import { EntityAddComponent } from '../components/general-ledger/entity/legal-entity-add/legal-entity-add.component';
import { LegalEntityStepsComponent } from '../components/general-ledger/entity/legal-entity-steps/legal-entity-steps.component';
import { LegalEntityStepsPrimeNgComponent } from '../components/general-ledger/entity/legal-entity-steps-prime-ng/legal-entity-steps-prime-ng.component';
import { EntityContactComponent } from "../components/general-ledger/entity/legal-entity-contact/legal-entity-contact.component";
import { EntityBankingComponent } from "../components/general-ledger/entity/legal-entity-banking/legal-entity-banking.component";
import { EntityBillingComponent } from "../components/general-ledger/entity/legal-entity-billing/legal-entity-billing.component";
import { EntityShippingComponent } from "../components/general-ledger/entity/legal-entity-shipping/legal-entity-shipping.component";
import { EntityDocumentsComponent } from "../components/general-ledger/entity/legal-entity-documents/legal-entity-documents.component";
import { LegalEntityGeneralInformationComponent } from "../components/general-ledger/entity/legal-entity-general-information/legal-entity-general-information.component";
import { AppSharedModule } from "../app-shared.module";
import {EditorModule} from 'primeng/editor';
import { CommonDocumentsComponent } from "../components/common-components/common-documents/common-documents.component";


@NgModule({
    imports: [
        FlexLayoutModule,
        FormsModule, ReactiveFormsModule,
        QuickAppProMaterialModule,
        TranslateModule,
        CommonModule,
        GeneralledgerPageRoutingModule,
        TableModule,
        ButtonModule,
        SelectButtonModule,
        InputTextModule,
        MultiSelectModule,
        TreeTableModule,
        TreeModule, DialogModule, CalendarModule, InputSwitchModule,
        AuditModule,
        AutoCompleteModule,
        TooltipModule,
        DropdownModule,BreadcrumbModule,
        FileUploadModule,
        RadioButtonModule,
        AppSharedModule,
        EditorModule
    ],
    declarations: [
        GeneralledgerPageComponent,
        AccountingCalendarComponent,
        JournalsComponent,
        OpenClosePeriodComponent,
        AccountReportsComponent,
        AccountSetupComponent,
        GeneralLedgerCurrencyComponent,
        LegalEntityStructureComponent,
        ManagementStructureComponent,
        EntityEditComponent,
        NodeSetupComponent,
        GlaccountListComponent,
        GlaccountCreateComponent,
        PoRoCategoryComponent,
        InterCompanySetupComponent,
        AccountListingComponent,
        AccountListingCreateComponent,
        AccountingListingCalendarComponent,
        OpenCloseLedgerComponent,
        LegalEntityStepsComponent,
        EntityAddComponent,
        EntityContactComponent,
        EntityBankingComponent,
        EntityBillingComponent,
        EntityShippingComponent,
        EntityDocumentsComponent,
        LegalEntityGeneralInformationComponent,
        LegalEntityStepsPrimeNgComponent,
        CommonDocumentsComponent
    ],
    providers: [
        NodeSetupService,
        NodeSetupEndpointService,
        POROCategoryEndpoint,
        POROCategoryService,
        CommonService


    ],
    exports: [
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        QuickAppProMaterialModule,
        TranslateModule
    ],
    entryComponents: [
    ]
})
export class GeneralledgerPageModule {

}