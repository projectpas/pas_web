import { WoCustomerDetailComponent } from './../components/work-order/work-order-setup/work-order-materials-add/wo-customer-detail/wo-customer-detail.component';
import { WorkOrderMaterialsAddComponent } from './../components/work-order/work-order-setup/work-order-materials-add/work-order-materials-add.component';
import { WorkOrderPickticketComponent } from './../components/work-order/work-order-setup/work-order-pickticket/work-order-pickticket.component';
import { WoqApprovalRuleComponent } from './../components/work-order/work-order-setup/woq-approval-rule/woq-approval-rule.component';
import { CommonModulesModule } from './../common-modules/common-modules.module';
import { WoApprovalRuleComponent } from './../components/work-order/work-order-setup/wo-approval-rule/wo-approval-rule.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common'; //<-- This one
import { WorkOrdersPagesRoutingModule } from './workorderpages-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditorModule } from 'primeng/editor';
import { WorkOrderPagesComponent } from './workorderpages.component';
import { DirectLabourAddComponent } from '../components/work-order/work-order-setup/direct-labour-add/direct-labour-add.component';
import { WorkOrderAddComponent } from '../components/work-order/work-order-setup/work-order-add/work-order-add.component';
import { ManualEntryLaborHoursComponent } from '../components/work-order/work-order-setup/labor/manual-entry-labor-hours/manual-entry-labor-hours.component';
import { SystemGeneratedLaborHoursComponent } from '../components/work-order/work-order-setup/labor/system-generated-labor-hours/system-generated-labor-hours.component';
import { BarCodeScannedLaborHoursComponent } from '../components/work-order/work-order-setup/labor/bar-code-scanned-labor-hours/bar-code-scanned-labor-hours.component';
import { WorkOrderEquipmentListComponent } from '../components/work-order/work-order-setup/work-order-equipment/work-order-equipment-list/work-order-equipment-list.component';
import { WorkOrderEquipmentCheckInOutComponent } from '../components/work-order/work-order-setup/work-order-equipment/work-order-equipment-check-in-out/work-order-equipment-check-in-out.component';
import { WorkOrderCompleteMaterialListComponent } from '../components/work-order/work-order-setup/work-order-complete-material-list/work-order-complete-material-list.component';
import { WorkOrderReserveIssueComponent } from '../components/work-order/work-order-setup/work-order-reserve-issue/work-order-reserve-issue.component';
import { WorkOrderMemoComponent } from '../components/work-order/work-order-setup/work-order-memo/work-order-memo.component';
import { WorkOrderDocumentsComponent } from '../components/work-order/work-order-setup/work-order-documents/work-order-documents.component';
import { WorkOrderAnalysisComponent } from '../components/work-order/work-order-setup/work-order-analysis/work-order-analysis.component';
import { WorkOrderBillingComponent } from '../components/work-order/work-order-setup/work-order-billing/work-order-billing.component';
import { WorkOrderQuoteComponent } from '../components/work-order/work-order-setup/work-order-quote/work-order-quote.component';
import { WorkOrderQuoteListComponent } from '../components/work-order/work-order-setup/work-order-quote-list/work-order-quote-list.component';
import { WorkOrderShippingComponent } from '../components/work-order/work-order-setup/work-order-shipping/work-order-shipping.component';
import { WorkOrderListComponent } from '../components/work-order/work-order-list/work-order-list.component';
import { WoSummarizedDataComponent } from '../components/work-order/work-order-setup/work-order-summarizedview/wo-summarized-data.component';
import { LabourComponent } from '../components/work-order/work-order-setup/work-order-summarizedview/components/labour/labour.component';
import { SummarizedShippingComponent } from '../components/work-order/work-order-setup/work-order-summarizedview/components/shipping/shipping.component';
import { SummarizedDocumentComponent } from '../components/work-order/work-order-setup/work-order-summarizedview/components/document/summarised-document.component';
import { SummarizedChargesComponent } from '../components/work-order/work-order-setup/work-order-summarizedview/components/summarised-charges/summarised-charges.component';
import { SummarizedFreightComponent } from '../components/work-order/work-order-setup/work-order-summarizedview/components/summarised-freight/summarised-freight.component';
import { CommunicationComponent } from '../components/work-order/work-order-setup/work-order-summarizedview/components/communication/communication.component';
import { AnalysisComponent } from '../components/work-order/work-order-setup/work-order-summarizedview/components/analysis/analysis.component';
import { MaterialListSummarisedComponent } from '../components/work-order/work-order-setup/work-order-summarizedview/components/material-list/material-list.component';
import { WOReturnToCustomerComponent } from '../components/work-order/work-order-setup/wo-return-to-customer/wo-return-to-customer.component';
import { WorkOrderLaborComponent } from '../components/work-order/work-order-setup/work-order-labor/work-order-labor.component';
import { WorkOrderLabourAnalysisComponent } from '../components/work-order/work-order-setup/work-order-labour-analysis/work-order-labour-analysis.component';
import { WorkOrderReportComponent } from '../components/reports/workorder/workorder-report.component';
import { PurchaseOrderReportComponent } from '../components/reports/purchase-order/purchase-order-report.component';
import { ReceivingLogReportComponent } from '../components/reports/receiving-log/receiving-log-report.component';
import { InventoryReportComponent } from '../components/reports/inventory/inventory-report.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { WorkOrderService } from '../services/work-order/work-order.service';
import { WorkOrderEndpointService } from '../services/work-order/work-order-endpoint.service';
import { WorkOrderPartNumberService } from '../services/work-order/work-order-part-number.service';
import { WorkOrderPartNumberEndpointService } from '../services/work-order/work-order-part-number-endpoint.service';
import { DirectLabourComponent } from '../components/work-order/direct-labour/direct-labour.component';
import { WorkFlowPagesModule } from '../workflowpages/workflowpages.module';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { WorkOrderAssetsComponent } from '../components/work-order/work-order-setup/work-order-assets/work-order-assets.component';
import { WorkOrderAddressesComponent } from '../components/work-order/work-order-setup/work-order-addresses/work-order-addresses.component';
import { TooltipModule } from 'primeng/tooltip';
import { CommonService } from '../services/common.service';
import { MatIconModule } from "@angular/material/icon";
import { TabViewModule } from 'primeng/tabview';
import { WorkOrderSmartComponent } from '../components/work-order/work-order-setup/work-order-smart/work-order-smart.component';
import { WorkOrderViewComponent } from '../components/work-order/work-order-setup/work-order-view/work-order-view.component';
import { AccordionModule } from 'primeng/accordion';
import { CommunicationService } from '../shared/services/communication.service';
import { ShippingComponent } from '../shared/components/shipping/shipping.component';
import { SalesQuoteService } from '../services/salesquote.service';
import { SalesQuoteEndpointService } from "../services/salesquote-endpoint.service";
import { WorkFlowtService } from '../services/workflow.service';
import { AssetmanagementModule } from '../assetmanagement/assetmanagement.module';
import { WorkOrderChargesComponent } from '../components/work-order/work-order-setup/work-order-charges/work-order-charges.component';
import { WorkOrderExclusionsComponent } from '../components/work-order/work-order-setup/work-order-exclusions/work-order-exclusions.component';
import { SubWorkOrderListComponent } from '../components/work-order/work-order-setup/work-order-subwo-list/work-order-subwo-list.component';
import { SubWorkOrderComponent } from '../components/work-order/work-order-setup/work-order-sub-wo/work-order-subwo.component';
import { MatTooltipModule } from '@angular/material';
import { WorkOrderQuoteService } from '../services/work-order/work-order-quote.service';
import { QuoteEndpointService } from '../services/work-order/work-order-quote.endpoint.service';
import { WorkOrderROListComponent } from '../components/work-order/work-order-setup/work-order-ro-list/work-order-ro-list.component';
import { WorkOrderROCreateComponent } from '../components/work-order/work-order-setup/work-order-ro-create/work-order-ro-create.component';
import { WorkOrderFreightComponent } from '../components/work-order/work-order-setup/work-order-freight/work-order-freight.component';
import { QuoteViewComponent } from '../shared/quote-view.component';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonTeardownComponent } from '../components/work-order/work-order-setup/work-order-teardown/common-teardown/common-teardown.component';
import { TeardownOverviewComponent } from '../components/work-order/work-order-setup/work-order-teardown/teardown-overview/teardown-overview.component';
import { MemoComponent } from '../shared/components/memo/memo.component';
import { EmailComponent } from '../shared/components/email/email.component';
import { PhoneComponent } from '../shared/components/phone/phone.component';
import { TextComponent } from '../shared/components/text/text.component';
import { SalesOrderService } from '../services/salesorder.service';
import { SalesOrderEndpointService } from '../services/salesorder-endpoint.service';
import { FormatTimePipe } from '../pipes/timer-pipe';
import { TreeTableModule } from 'primeng/treetable';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonDocumentsModule } from '../components/common-components/common-documents/common-documents.module';
import { CommonCommunicationModule } from '../components/common-components/common-communication/common-communiation.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { WoPartNumberFilterComponent } from '../components/work-order/work-order-setup/work-order-materials-add/wo-part-number-filter/wo-part-number-filter.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    WorkOrdersPagesRoutingModule,
    TableModule,
    ButtonModule,
    SelectButtonModule,
    InputTextModule,
    MultiSelectModule,
    AutoCompleteModule,
    WorkFlowPagesModule,
    CalendarModule,
    DropdownModule,
    CheckboxModule,
    RadioButtonModule,
    InputSwitchModule,
    TooltipModule,
    TabViewModule,
    AccordionModule,
    AssetmanagementModule,
    WorkFlowPagesModule,
    MatTooltipModule,
    FileUploadModule,
    NgMultiSelectDropDownModule,
    EditorModule,
    TreeTableModule,
    BreadcrumbModule,
    CommonDocumentsModule,
    CommonCommunicationModule,
    SplitButtonModule,
    CommonModulesModule,
  ],
  declarations: [
    WorkOrderPagesComponent,
    WorkOrderAddComponent,
    ManualEntryLaborHoursComponent,
    SystemGeneratedLaborHoursComponent,
    BarCodeScannedLaborHoursComponent,
    WorkOrderEquipmentListComponent,
    WorkOrderChargesComponent,
    WorkOrderExclusionsComponent,
    WorkOrderEquipmentCheckInOutComponent,
    WorkOrderEquipmentCheckInOutComponent,
    WorkOrderCompleteMaterialListComponent,
    WorkOrderReserveIssueComponent,
    WorkOrderMemoComponent,
    WorkOrderDocumentsComponent,
    WorkOrderAnalysisComponent,
    WorkOrderBillingComponent,
    WorkOrderQuoteComponent,
    WorkOrderQuoteListComponent,
    WorkOrderShippingComponent,
    WorkOrderListComponent,
    DirectLabourComponent,
    DirectLabourAddComponent,
    WorkOrderLaborComponent,
    WorkOrderLabourAnalysisComponent,
    WorkOrderReportComponent,
    PurchaseOrderReportComponent,
    ReceivingLogReportComponent,
    InventoryReportComponent,
    FormatTimePipe,
    WoSummarizedDataComponent,
    LabourComponent,
    MaterialListSummarisedComponent,
    WOReturnToCustomerComponent,
    WorkOrderAssetsComponent,
    WorkOrderAddressesComponent,
    WorkOrderSmartComponent,
    WorkOrderViewComponent,
    SubWorkOrderListComponent,
    SubWorkOrderComponent,
    WorkOrderROListComponent,
    WorkOrderROCreateComponent,
    WorkOrderFreightComponent,
    QuoteViewComponent,
    CommonTeardownComponent,
    TeardownOverviewComponent,
    MemoComponent,
    EmailComponent,
    PhoneComponent,
    TextComponent,
    ShippingComponent,
    SummarizedShippingComponent,
    SummarizedDocumentComponent,
    SummarizedChargesComponent,
    SummarizedFreightComponent,
    CommunicationComponent,
    AnalysisComponent,
    WoApprovalRuleComponent,
    WoqApprovalRuleComponent,
    WorkOrderPickticketComponent,
    WorkOrderMaterialsAddComponent,
    WoCustomerDetailComponent,
    WoPartNumberFilterComponent, 
  ],
  entryComponents: [],
  providers: [
    WorkFlowtService,
    WorkOrderService,
    WorkOrderEndpointService,
    WorkOrderPartNumberService,
    WorkOrderPartNumberEndpointService,
    CommonService,
    WorkOrderQuoteService,
    QuoteEndpointService,
    CommunicationService,
    SalesOrderService,
    SalesOrderEndpointService,
    SalesQuoteService,
    SalesQuoteEndpointService,
    DatePipe
  ],
  exports: [SubWorkOrderComponent, EmailComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class WorkOrderPagesModule { }