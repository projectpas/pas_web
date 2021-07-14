import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExchangepagesComponent } from './exchangepages.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { QuickAppProMaterialModule } from "../modules/material.module";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { SelectButtonModule } from "primeng/selectbutton";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { AutoCompleteModule } from "primeng/autocomplete";
import { GMapModule } from "primeng/gmap";
import { FileUploadModule } from "primeng/fileupload";
import { RadioButtonModule } from "primeng/radiobutton";
import { StepsModule } from "primeng/steps";
import { DialogModule } from "primeng/dialog";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { InputSwitchModule } from "primeng/inputswitch";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { KeyFilterModule } from "primeng/keyfilter";
import { TooltipModule } from "primeng/tooltip";
import { SpinnerModule } from "primeng/spinner";
import { CheckboxModule } from "primeng/checkbox";
import { PanelModule } from "primeng/panel";
import { SplitButtonModule } from 'primeng/splitbutton';
import { EditorModule } from 'primeng/editor';
import { TabViewModule } from "primeng/tabview";
import { AppSharedModule } from "../app-shared.module";
import { ExchangepagesRoutingRoutes } from "./exchangepages-routing.module";
import { ExchangeQuoteListComponent } from "../components/exchange-quote/exchange-quote-list/exchange-quote-list.component";
import { ExchangeQuoteCreateComponent } from "../components/exchange-quote/exchange-quote-create/exchange-quote-create.component";
import { ExchangeQuoteComponent } from "../components/exchange-quote/exchange-quote/exchange-quote.component";
import { CommonService } from "../services/common.service";
import { ExchangequoteService } from "../services/exchangequote.service";
import { ExchangeQuoteEndpointService } from "../services/exchangequote-endpoint.service";
import { ExchangeQuotePartNumberComponent } from "../components/exchange-quote/shared/components/exchange-quote-part-number/exchange-quote-part-number.component";
import { AddExchangePartNumberComponent } from "../components/exchange-quote/shared/components/add-exchange-part-number/add-exchange-part-number.component";
import { ExchangeCustomerDetailsComponent } from "../components/exchange-quote/shared/components/add-exchange-part-number/exchange-customer-details/exchange-customer-details.component";
import { ExchangePartDetailsComponent } from "../components/exchange-quote/shared/components/add-exchange-part-number/exchange-part-details/exchange-part-details.component";
import { ExchangePartNumberFilterComponent } from "../components/exchange-quote/shared/components/add-exchange-part-number/exchange-part-number-filter/exchange-part-number-filter.component";
import { ExchangeMerginComponent } from "../components/exchange-quote/shared/components/exchange-mergin/exchange-mergin.component";
import { CommonModulesModule } from "../common-modules/common-modules.module";
import { CommonDocumentsModule } from "../components/common-components/common-documents/common-documents.module";
import { ExchangeQuoteApprovalRuleComponent } from "../components/exchange-quote/shared/components/exchange-quote-approval-rule/exchange-quote-approval-rule.component";
import { ExchangeQuoteApproveComponent } from "../components/exchange-quote/shared/components/exchange-quote-approve/exchange-quote-approve.component";
import { ExchangeQuoteCustomerApprovalComponent } from "../components/exchange-quote/shared/components/exchange-quote-customer-approval/exchange-quote-customer-approval.component";
import { ExchangeQuoteAnalysisComponent } from "../components/exchange-quote/exchange-quote-analysis/exchange-quote-analysis.component";
import { ExchangeQuoteChargesComponent } from "../components/exchange-quote/shared/components/exchange-quote-charges/exchange-quote-charges.component";
import { ActionService } from '../Workflow/ActionService';
import { ActionEndpoint } from '../Workflow/action-endpoint.service';
import { ExchangeQuoteFreightComponent } from "../components/exchange-quote/shared/components/exchange-quote-freight/exchange-quote-freight.component";
import { ExchangeQuoteAgreementTemplateComponent } from "../components/exchange-quote/shared/components/exchange-quote-agreement-template/exchange-quote-agreement-template.component";
import { ExchangeQuoteViewComponent } from "../components/exchange-quote/shared/components/exchange-quote-view/exchange-quote-view.component";
import { ExchangeSalesOrderService } from "../services/exchangesalesorder.service";
import { ExchangeSalesOrderEndpointService } from "../services/exchangesalesorder-endpoint.service";
import { ExchangeSalesOrderComponent } from "../components/exchange-sales-order/exchange-sales-order/exchange-sales-order.component";
import { ExchangeSalesOrderCreateComponent } from "../components/exchange-sales-order/exchange-sales-order-create/exchange-sales-order-create.component";
import { ExchangeSalesOrderListComponent } from "../components/exchange-sales-order/exchange-sales-order-list/exchange-sales-order-list.component";
import { ExchangeSalesOrderPartNumberComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-part-number/exchange-sales-order-part-number.component";
import { AddExchangeSalesOrderPartNumberComponent } from "../components/exchange-sales-order/shared/components/add-exchange-sales-order-part-number/add-exchange-sales-order-part-number.component";
import { ExchangeSalesOrderCustomerDetailsComponent } from "../components/exchange-sales-order/shared/components/add-exchange-sales-order-part-number/exchange-sales-order-customer-details/exchange-sales-order-customer-details.component";
import { ExchangeSalesOrderPartDetailsComponent } from "../components/exchange-sales-order/shared/components/add-exchange-sales-order-part-number/exchange-sales-order-part-details/exchange-sales-order-part-details.component";
import { ExchangeSalesOrderPartNumberFilterComponent } from "../components/exchange-sales-order/shared/components/add-exchange-sales-order-part-number/exchange-sales-order-part-number-filter/exchange-sales-order-part-number-filter.component";
import { ExchangeSalesOrderMarginComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-margin/exchange-sales-order-margin.component";
import { AddExchangeSalesOrderReserveUnreservePartNumberComponent } from "../components/exchange-sales-order/shared/components/add-exchange-sales-order-reserve-unreserve-part-number/add-exchange-sales-order-reserve-unreserve-part-number.component";
import { ExchangeSalesOrderPickTicketsComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-pick-tickets/exchange-sales-order-pick-tickets.component";
import { ExchangeSalesOrderPickTicketComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-pick-ticket/exchange-sales-order-pick-ticket.component";
import { ExchangeSalesOrderMultiPickTicketComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-multi-pickTicket/exchange-sales-order-multi-pickTicket.component";
import { ExchangeSalesOrderShippingComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-shipping/exchange-sales-order-shipping.component";
// import { ExchangeSalesOrderShippingLabelComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-shipping-label/exchange-sales-order-shipping-label.component";
// import { ExchangeSalesOrderPackagingLabelComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-Packaging-Label/exchange-sales-order-Packaging-Label.component";
// import { ExchangeSalesOrderMultiPackagingLabelComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-multi-Packaging-Label/exchange-sales-order-multi-Packaging-Label.component";
// import { ExchangeSalesOrderMultiShippingLabelComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-multi-shipping-label/exchange-sales-order-multi-shipping-label.component";
import { ExchangeSalesOrderFreightComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-freight/exchange-sales-order-freight.component";
import { ExchangeSalesOrderChargesComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-charges/exchange-sales-order-charges.component";
import { ExchangeSalesOrderBillingComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-billing/exchange-sales-order-billing.component";
import { ExchangeSalesOrderPrintInvoiceComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-print-invoice/exchange-sales-order-print-invoice.component";
import { ExchangeSalesOrderAnalysisComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-analysis/exchange-sales-order-analysis.component";
import { ExchangeSalesOrderHypoAnalysisComponent } from "../components/exchange-sales-order/shared/components/exchange-sales-order-hypo-analysis/exchange-sales-order-hypo-analysis.component";
@NgModule({
  imports: [
    CommonModule,
    ExchangepagesRoutingRoutes,
    KeyFilterModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
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
    GMapModule,
    RadioButtonModule,
    FileUploadModule,
    DialogModule,
    StepsModule,
    BreadcrumbModule,
    DropdownModule,
    TooltipModule,
    SpinnerModule,
    CheckboxModule,
    PanelModule,
    TabViewModule,
    DropdownModule,
    AppSharedModule,
    EditorModule,
    SplitButtonModule,
    CommonModulesModule,
    CommonDocumentsModule
  ],
  declarations: [
    ExchangepagesComponent,
    ExchangeQuoteListComponent,
    ExchangeQuoteCreateComponent,
    ExchangeQuoteComponent,
    ExchangeQuotePartNumberComponent,
    AddExchangePartNumberComponent,
    ExchangeCustomerDetailsComponent,
    ExchangePartDetailsComponent,
    ExchangePartNumberFilterComponent,
    ExchangeMerginComponent,
    ExchangeQuoteApprovalRuleComponent,
    ExchangeQuoteApproveComponent,
    ExchangeQuoteCustomerApprovalComponent,
    ExchangeQuoteAnalysisComponent,
    ExchangeQuoteChargesComponent,
    ExchangeQuoteFreightComponent,
    ExchangeQuoteAgreementTemplateComponent,
    ExchangeQuoteViewComponent,
    ExchangeSalesOrderComponent,
    ExchangeSalesOrderCreateComponent,
    ExchangeSalesOrderListComponent,
    ExchangeSalesOrderPartNumberComponent,
    AddExchangeSalesOrderPartNumberComponent,
    ExchangeSalesOrderCustomerDetailsComponent,
    ExchangeSalesOrderPartDetailsComponent,
    ExchangeSalesOrderPartNumberFilterComponent,
    ExchangeSalesOrderMarginComponent,
    AddExchangeSalesOrderReserveUnreservePartNumberComponent,
    //ExchangeSalesOrderPickTicketComponent,
    ExchangeSalesOrderPickTicketsComponent,
    //ExchangeSalesOrderMultiPickTicketComponent
    ExchangeSalesOrderShippingComponent,
    // ExchangeSalesOrderShippingLabelComponent,
    // ExchangeSalesOrderPackagingLabelComponent,
    // ExchangeSalesOrderMultiPackagingLabelComponent,
    // ExchangeSalesOrderMultiShippingLabelComponent
    ExchangeSalesOrderFreightComponent,
    ExchangeSalesOrderChargesComponent,
    ExchangeSalesOrderBillingComponent,
    ExchangeSalesOrderPrintInvoiceComponent,
    ExchangeSalesOrderAnalysisComponent,
    ExchangeSalesOrderHypoAnalysisComponent
  ],
  providers: [CommonService, DatePipe, ExchangequoteService, ExchangeQuoteEndpointService, ActionService, ActionEndpoint, ExchangeSalesOrderService, ExchangeSalesOrderEndpointService],
  //entryComponents: [ExchangeSalesOrderPickTicketComponent, ExchangeSalesOrderMultiPickTicketComponent]
})
export class ExchangepagesModule { }