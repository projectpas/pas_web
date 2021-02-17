
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { QuickAppProMaterialModule } from "../modules/material.module";
import { GroupByPipe } from '../pipes/group-by.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { CustomerPagesRoutingModule } from "./customerpages-routing.module";

import { CustomerPagesComponent } from "./customerpages.component";
import {EditorModule} from 'primeng/editor';


import { CustomersListComponent } from "../components/customer/customers-list/customers-list.component";
import { CustomerGeneralInformationComponent } from "../components/customer/customer-general-information/customer-general-information.component";
import { CustomerContactsComponent } from "../components/customer/customer-contacts/customer-contacts.component";
import { CustomerFinancialInformationComponent } from "../components/customer/customer-financial-information/customer-financial-information.component";
import { CustomerBillingInformationComponent } from "../components/customer/customer-billing-information/customer-billing-information.component";
import { CustomerShippingInformationComponent } from "../components/customer/customer-shipping-information/customer-shipping-information-component";
import { CustomerSalesPersonComponent } from "../components/customer/customer-sales-person/customer-sales-person.component";
import { CustomerWarningsComponent } from "../components/customer/customer-warnings/customer-warnings.component";
import { CustomerStepsPrimengComponent } from "../components/customer/customer-steps-primeng/customer-steps-primeng.component";

import{CrmListComponent} from"../components/crm/crm-list/crm-list.component";
import{CrmCreateComponent}from"../components/crm/crm-create/crm-create.component"
import{DealSetupComponent}from"../components/crm/deal-setup/deal-setup.component"


import { LeadStepsPrimengComponent } from "../components/crm/lead-steps-primeng/lead-steps-primeng.component";

import{OpportunitySetupComponent}from"../components/crm/opportunity-setup/opportunity-setup.component"
import{DealsListComponent} from"../components/crm/deals-list/deals-list.component";
import{LeadsListComponent} from"../components/crm/leads-list/leads-list.component";
import{OpportunityListComponent} from"../components/crm/opportunity-list/opportunity-list.component";

import{DealAlternateComponent} from"../components/crm/deal-alternate/deal-alternate.component";
import{CrmTabsComponent} from"../components/crm/crm-tabs/crm-tabs.component";
import { TabViewModule } from 'primeng/tabview';
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
import { DropdownModule } from 'primeng/dropdown';
import { KeyFilterModule } from "primeng/keyfilter";
import { TooltipModule } from 'primeng/tooltip';
import { CustomerAircraftComponent } from "../components/customer/customer-aircraft-information/customer-aircraft.component";
import { CustomerATAInformationComponent } from "../components/customer/customer-ata-information/customer-ata.component";
import { AircraftModelService } from "../services/aircraft-model/aircraft-model.service";
import { AircraftModelEndpointService } from "../services/aircraft-model/aircraft-model-endpoint.service";
import { AircraftManufacturerEndpointService } from "../services/aircraft-manufacturer/aircraftManufacturer-endpoint.service";
import { AircraftManufacturerService } from "../services/aircraft-manufacturer/aircraftManufacturer.service";
import { DashNumberService } from "../services/dash-number/dash-number.service";
import { DashNumberEndpointService } from "../services/dash-number/dash-number-endpoint.service";
import { CustomerDocumentsComponent } from "../components/customer/customer-documents/customer-documents.component";
import { CommonService } from "../services/common.service";
import { TwoDecimalGlobalNumberFormatPipe } from "../pipes/two-decimal-global-number-format-pipe.pipe";
import { AppSharedModule } from "../app-shared.module";
import { CommonDocumentsModule } from "../components/common-components/common-documents/common-documents.module";


 
@NgModule({
    imports: [
        KeyFilterModule,
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
        CustomerPagesRoutingModule,
        AutoCompleteModule,
        CalendarModule,
        GMapModule, RadioButtonModule, FileUploadModule, DialogModule, StepsModule, BreadcrumbModule,
        DropdownModule, TooltipModule,
        AppSharedModule,
        EditorModule,
        TabViewModule,
        CommonDocumentsModule
    ],
    declarations: [
        CustomerPagesComponent,
        CustomersListComponent,
        CustomerGeneralInformationComponent,
        CustomerAircraftComponent,
        CustomerDocumentsComponent,
       
        CustomerContactsComponent,
        CustomerFinancialInformationComponent,
        CustomerBillingInformationComponent,
        CustomerShippingInformationComponent,
        CustomerSalesPersonComponent,
        CustomerWarningsComponent,
        CustomerStepsPrimengComponent,
        LeadStepsPrimengComponent,
        CustomerATAInformationComponent,


        CrmListComponent,
        DealsListComponent,
        LeadsListComponent,
        OpportunityListComponent,
        CrmCreateComponent,
        DealSetupComponent,
        
        OpportunitySetupComponent,

        DealAlternateComponent,
        CrmTabsComponent,


    ],
    exports: [
        CustomerDocumentsComponent,
        CustomerShippingInformationComponent,
        CrmCreateComponent,
        DealSetupComponent,
       
        OpportunitySetupComponent,
        CustomerAircraftComponent,
        CustomerBillingInformationComponent,
        CustomerContactsComponent,

        DealAlternateComponent,
        CrmTabsComponent,
    ],
    providers: [
        AircraftModelService,
        AircraftModelEndpointService,
        AircraftManufacturerEndpointService,
        AircraftManufacturerService,
        DashNumberService,
        DashNumberEndpointService,
        CommonService

    ],
    entryComponents: [        
    ],
    schemas:[
        CUSTOM_ELEMENTS_SCHEMA
    ]

})
export class CustomerPagesModule {

}