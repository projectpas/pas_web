﻿import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuickAppProMaterialModule } from '../modules/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { StepsModule } from 'primeng/steps';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AccountreceivableRoutingModule } from './accountreceivable-routing.module';
import { OpenCloseArsubledgerComponent } from '../components/accounts-receivable/open-close-ar-subledger/open-close-ar-subledger.component';
import { AccountsReceivableComponent } from './accounts-receivable.component';
import { CustomerInvoiceListComponent } from '../components/accounts-receivable/customer-invoice-list/customer-invoice-list.component';
import { CustomerPaymentListComponent } from '../components/accounts-receivable/customer-payment-listing/customer-payment-list.component';
import { CustomerPaymentCreateComponent } from '../components/accounts-receivable/customer-payment-create/customer-payment-create.component';
import { EditorModule } from 'primeng/editor';
import { AppSharedModule } from '../app-shared.module';
import { CustomerPaymentsService } from '../services/customer-payment.service';
import { CustomerPaymentsEndpointService } from '../services/customer-payments-endpoint.service';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { AddCustomerPaymentComponent } from '../components/accounts-receivable/add-customer-payment/add-customer-payment.component';
import { ReviewCustomerPaymentComponent } from '../components/accounts-receivable/reivew-customer-payments/review-customer-payment.component';
import { CommonDocumentsModule } from "../components/common-components/common-documents/common-documents.module";
import { DropdownModule } from "primeng/dropdown";

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
        AccountreceivableRoutingModule,
        InputSwitchModule,
        CheckboxModule,
        AutoCompleteModule
        , RadioButtonModule,
        CalendarModule, StepsModule, BreadcrumbModule, DialogModule,
        AppSharedModule,
        EditorModule,
        PanelModule,
        TabViewModule,
        CommonDocumentsModule,
        DropdownModule
    ],
    declarations: [
        OpenCloseArsubledgerComponent,
        AccountsReceivableComponent,
        CustomerInvoiceListComponent,
        CustomerPaymentListComponent,
        CustomerPaymentCreateComponent,
        AddCustomerPaymentComponent,
        ReviewCustomerPaymentComponent
    ],
    providers: [
        CustomerPaymentsService,
        CustomerPaymentsEndpointService
    ],
})
export class AccountsreceivableModule {
}