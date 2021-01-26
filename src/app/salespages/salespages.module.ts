// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";

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
import { AddActionsDialogComponent } from "../components/dialogs/add-actions-dialog/add-actions-dialog.component";
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

import { SalesPagesRoutingModule } from "./salespages-routing.module";
import { SalesPagesComponent } from "./salespages.component";
import { SalesQuoteListComponent } from "../components/sales/quotes/sales-quote-list/sales-quote-list.component";
import { SalesQuoteCreateComponent } from "../components/sales/quotes/sales-quote-create/sales-quote-create.component";
import { CustomerService } from "../services/customer.service";
import { SalesQuoteComponent } from "../components/sales/quotes/sales-quote/sales-quote-component";
import { SalesQuoteService } from "../services/salesquote.service";
import { SalesQuoteEndpointService } from "../services/salesquote-endpoint.service";
import { TabViewModule } from "primeng/tabview";
import { ManagementStructureComponent } from "../components/sales/quotes/shared/components/management-structure/management-structure.component";
import { SalesApproveComponent } from "../components/sales/quotes/shared/components/sales-approve/sales-approve.component";
import { SalesPartNumberComponent } from "../components/sales/shared/components/sales-part-number/sales-part-number.component";
import { AddSalesPartNumberComponent } from "../components/sales/shared/components/add-sales-part-number/add-sales-part-number.component";
import { SalesAddressComponent } from "../components/sales/quotes/shared/components/sales-address/sales-address.component";
import { CustomerDetailComponent } from "../components/sales/shared/components/add-sales-part-number/customer-details/customer-detail.component";
import { PartNumberFilterComponent } from "../components/sales/shared/components/add-sales-part-number/part-number-filter/part-number-filter.component";
import { PartDetailsComponent } from "../components/sales/shared/components/add-sales-part-number/part-details/part-details.component";
import { ItemMasterService } from "../services/itemMaster.service";
import { SalesPartNumbersComponent } from "../components/sales/quotes/shared/components/sales-part-number/sales-part-numbers.component";
import { StocklinePartDetailsComponent } from "../components/sales/shared/components/add-sales-part-number/stockline-part-details/stockline-part-details.component";
import { MarginDetail } from "../components/sales/shared/models/margin-detail";
import { SalesMarginComponent } from "../components/sales/shared/components/sales-margin/sales-margin..component";
//Sales Order Components - Start
import { SalesOrderListComponent } from "../components/sales/order/sales-order-list/sales-order-list.component";
import { SalesOrderCreateComponent } from "../components/sales/order/sales-order-create/sales-order-create.component";
import { SalesOrderComponent } from "../components/sales/order/sales-order/sales-order-component";
import { SalesOrderService } from "../services/salesorder.service";
import { SalesOrderEndpointService } from "../services/salesorder-endpoint.service";
import { SalesOrderAddressComponent } from "../components/sales/order/shared/components/sales-address/sales-address.component";
import { SalesOrderApproveComponent } from "../components/sales/order/shared/components/sales-approve/sales-approve.component";
import { SalesOrderPartNumbersComponent } from "../components/sales/order/shared/components/sales-part-number/sales-part-numbers.component";
import { SalesCustomerApprovalsComponent } from "../components/sales/quotes/shared/components/sales-customer-approvals/sales-customer-approvals.component";
import { SalesQuoteViewComponent } from "../components/sales/quotes/shared/components/sales-quote-view/sales-quote-view.component";
import { SalesOrderPartNumberComponent } from "../components/sales/order/shared/components/sales-order-part-number/sales-order-part-number.component";
import { ToDecimalPipe } from '../pipes/to-decimal.pipe';
import { SalesOrderPartActionsComponent } from "../components/sales/shared/components/sales-order-part-actions/sales-order-part-actions.component";
import { SalesOrderViewComponent } from "../components/sales/order/shared/components/sales-order-view/sales-order-view.component";
import { AppSharedModule } from "../app-shared.module";
import { WorkOrderPagesModule } from "../workorderpages/workorderpages.module";
import { SalesOrderCustomerApprovalComponent } from "../components/sales/order/shared/components/sales-order-customer-approval/sales-order-customer-approval.component";
import { TwoDecimalGlobalNumberFormatPipe } from "../pipes/two-decimal-global-number-format-pipe.pipe";
import { SalesOrderActionsComponent } from "../components/sales/order/sales-order-actions/sales-order-actions.component";
import { SalesOrderConfirmationModalComponent } from "../components/sales/order/sales-order-confirmation-modal/sales-order-confirmation-modal.compoent";
import { SalesQuotePrintTemplateComponent } from "../components/sales/shared/components/sales-quote-print-template/sales-quote-print-template.component";
import { ItemmasterpagesModule } from "../itemmasterpages/itemmasterpages.module";
import { SalesOrderCopyComponent } from "../components/sales/order/sales-order-copy/sales-order-copy.component";
import { SalesStockLineDetailsViewComponent } from "../components/sales/shared/components/sales-stockline-part-details-view/sales-stockline-part-details-view.component";
import { SalesQuoteDocumentsComponent } from "../components/sales/quotes/sales-document/salesQuote-document.component";


import { CommonService } from "../services/common.service";
import { SalesOrderDocumentComponent } from "../components/sales/order/shared/components/sales-document/sales-order-document.component";
import { SalesOrderpickTicketComponent } from "../components/sales/order/sales-order-pickTicket/sales-order-pickTicket.component";
import { SalesReserveUnreserveComponent } from "../components/sales/shared/components/add-reserve-unreserve-part-number/add-reserve-unreserve-part-number";
import { MemoComponent } from '../components/sales/shared/components/memo/memo.component';
import { EmailComponent } from '../components/sales/shared/components/email/email.component';
import { PhoneComponent } from '../components/sales/shared/components/phone/phone.component';
import { TextComponent } from '../components/sales/shared/components/text/text.component';
import { SalesOrderConfirmationListComponent } from "../components/sales/order/sales-order-confirmation-list/sales-order-confirmation-list.component";
import { SalesOrderQuoteChargesComponent } from "../components/sales/shared/components/sales-order-quote-charges/sales-order-quote-charges.component";
import { SalesOrderQuoteFreightComponent } from "../components/sales/shared/components/sales-order-quote-freight/sales-order-quote-freight.component";
import { SalesOrderFreightComponent } from "../components/sales/order/shared/components/sales-order-freight/sales-order-freight.component";
import { SalesOrderChargesComponent } from "../components/sales/order/shared/components/sales-order-charges/sales-order-charges.component";
import { SalesOrderBillingComponent } from "../components/sales/order/shared/components/sales-order-billing/sales-order-billing.component";
import { SalesOrderShippingComponent } from "../components/sales/order/shared/components/sales-order-shipping/sales-order-shipping.component";
import { SalesQuoteAnalysisComponent } from "../components/sales/quotes/sales-quote-analysis/sales-quote-analysis.component";
import { SalesOrderAnalysisComponent } from "../components/sales/order/sales-order-analysis/sales-order-analysis.component";
import { SOQApprovalRuleComponent } from "../components/sales/quotes/shared/components/soq-approval-rule/soq-approval-rule.component";
import { AddressModel } from "../models/address.model";
import { CommonModulesModule } from "../common-modules/common-modules.module";
import { CommonCommunicationModule } from "../components/common-components/common-communication/common-communiation.module";
import { CommonDocumentsModule } from "../components/common-components/common-documents/common-documents.module";
import { SOApprovalRuleComponent } from "../components/sales/order/shared/components/so-approval-rule/so-approval-rule.component";
import { SalesOrderPickTicketsComponent } from "../components/sales/order/sales-order-pick-tickets/sales-order-pick-tickets.component";
//import { AddressComponentComponent } from "../components/address-component/address-component.component";
// import { AddressComponentComponent } from "../components/address-component/address-component.component";

//Sales Order Components - End

@NgModule({
  imports: [
    SalesPagesRoutingModule,
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
    WorkOrderPagesModule,
    // VendorPagesModule,
    EditorModule,
    SplitButtonModule,
    ItemmasterpagesModule,
    CommonModulesModule,
        CommonCommunicationModule,
        CommonDocumentsModule
  ],
  declarations: [
    SalesPagesComponent,
    SalesQuoteListComponent,
    SalesOrderConfirmationListComponent,
    SalesQuoteCreateComponent,
    SalesQuoteComponent,
    SalesApproveComponent,
    SalesPartNumberComponent,
    SalesAddressComponent,
    SalesQuoteDocumentsComponent,
    AddSalesPartNumberComponent,
    CustomerDetailComponent,
    PartNumberFilterComponent,
    PartDetailsComponent,
    SalesPartNumbersComponent,
    StocklinePartDetailsComponent,
    SalesMarginComponent,
    SalesOrderListComponent,
    SalesOrderCreateComponent,
    SalesOrderComponent,
    SalesOrderPartNumbersComponent,
    SalesOrderApproveComponent,
    SalesOrderAddressComponent,
    SalesOrderDocumentComponent,
    ManagementStructureComponent,
    SalesCustomerApprovalsComponent,
    SalesQuoteViewComponent,
    SalesOrderViewComponent,
    SalesOrderPartNumberComponent,
    ToDecimalPipe,
    SalesOrderPartActionsComponent,
    SalesOrderCustomerApprovalComponent,
    SalesOrderActionsComponent,
    SalesOrderConfirmationModalComponent,
    SalesQuotePrintTemplateComponent,
    SalesOrderCopyComponent,
    SalesStockLineDetailsViewComponent,
    SalesOrderpickTicketComponent, SalesReserveUnreserveComponent, MemoComponent,
    EmailComponent,
    PhoneComponent,
    TextComponent,
    SalesOrderQuoteFreightComponent,
    SalesOrderQuoteChargesComponent,
    SalesOrderFreightComponent,
    SalesOrderChargesComponent,
    SalesOrderBillingComponent,
    SalesOrderShippingComponent,
    SalesQuoteAnalysisComponent,
    SalesOrderAnalysisComponent,
    SOQApprovalRuleComponent,
    SOApprovalRuleComponent,
    SalesOrderPickTicketsComponent
    //AddressComponentComponent
  ],
  providers: [CommonService, CustomerService, SalesQuoteService, SalesQuoteEndpointService, ItemMasterService, SalesOrderService, SalesOrderEndpointService, DatePipe],
  entryComponents: [SalesQuoteViewComponent, SalesOrderViewComponent, SalesOrderConfirmationModalComponent, SalesOrderCopyComponent, SalesOrderpickTicketComponent, SalesStockLineDetailsViewComponent]
})
export class SalesPagesModule { }
