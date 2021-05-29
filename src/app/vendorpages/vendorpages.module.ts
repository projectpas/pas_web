import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { QuickAppProMaterialModule } from "../modules/material.module";
import { VendorPagesRoutingModule } from "./vendorpages-routing.module";
import { CommonModulesModule } from "../common-modules/common-modules.module";
import { VendorpagesComponent } from "./vendorpages.component";
import { VendorContactsComponent } from "../components/vendor/vendor-contacts/vendor-contacts.component";
import { VendorFinancialInformationComponent } from "../components/vendor/vendor-financial-information/vendor-financial-information.component";
import { VendorGeneralInformationComponent } from "../components/vendor/vendor-general-information/vendor-general-information.component";
import { VendorPaymentInformationComponent } from "../components/vendor/vendor-payment-information/vendor-payment-information.component";
import { VendorBillingInformationComponent } from "../components/vendor/vendor-billing-information/vendor-billing-information.component";
import { VendorShippingInformationComponent } from "../components/vendor/vendor-shipping-information/vendor-shipping-information.component";
import { VendorWarningsComponent } from "../components/vendor/vendor-warnings/vendor-warnings.component";
import { VendorMemoComponent } from "../components/vendor/vendor-memo/vendor-memo.component";
import { VendorEmailsComponent } from "../components/vendor/vendor-emails/vendor-emails.component";
import { VendorConversationsComponent } from "../components/vendor/vendor-conversations/vendor-conversations.component";
import { VendorsListComponent } from "../components/vendor/vendors-list/vendors-list.component";
import { VendorStepsPrimeNgComponent } from '../components/vendor/vendor-steps-prime-ng/vendor-steps-prime-ng.component';
import { CommonModule } from '@angular/common'; //<-- This one
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from "primeng/autocomplete";
import { VendorClassificationComponent } from "../components/vendor-classification/vendor-classification.component";
import { GMapModule } from 'primeng/gmap';
import { AddActionsDialogComponent } from '../components/dialogs/add-actions-dialog/add-actions-dialog.component';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepsModule } from 'primeng/steps';
import { EditorModule } from 'primeng/editor';
import { BreadcrumbModule } from 'primeng/breadcrumb'; //bread crumb
import { DialogModule } from 'primeng/dialog'; //Prime Ng Dailog
import { CreatePoComponent } from "../components/vendor/purchase-orders/create-po/create-po.component";
import { PoApprovalComponent } from "../components/vendor/purchase-orders/po-approval/po-approval.component";
import { RoApprovalComponent } from '../components/vendor/repaire-orders/ro-approval/ro-approval.component';
import { RoApprovalRuleComponent } from "../components/vendor/repaire-orders/ro-approval-rule/ro-approval-rule.component";
import { RoSettingsComponent } from "../components/vendor/repaire-orders/ro-settings/ro-settings.component";
import { PolistComponent } from "../components/vendor/purchase-orders/polist/polist.component";
import { PurchaseSetupComponent } from "../components/vendor/purchase-orders/purchase-setup/purchase-setup.component";
import { CreateRoComponent } from "../components/vendor/repaire-orders/create-ro/create-ro.component";
import { RoListComponent } from "../components/vendor/repaire-orders/ro-list/ro-list.component";
import { RoSetupComponent } from "../components/vendor/repaire-orders/ro-setup/ro-setup.component";
import { CalendarModule } from 'primeng/calendar'
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VendorCapabilitiesListComponent } from "../components/vendor/vendor-caps/vendor-capabilities-list/vendor-capabilities-list.component";
import { AddVendorCapabilitiesComponent } from "../components/vendor/vendor-caps/add-vendor-capabilities/add-vendor-capabilities.component";
import { EditVendorCapabilitiesComponent } from "../components/vendor/vendor-caps/edit-vendor-capabilities/edit-vendor-capabilities.component";
import { AuthService } from "../services/auth.service";
import { RolesGuardService } from "../services/roles-guard.service";
import { ValidateAccessModule } from "../validateaccess/validateaccess.module";
import { KeyFilterModule } from "primeng/keyfilter";
import { TooltipModule } from 'primeng/tooltip';
import { CommonService } from "../services/common.service";
import { VendorDocumentsComponent } from "../components/vendor/vendor-documents/vendor-documents.component";
import { AircraftModelService } from "../services/aircraft-model/aircraft-model.service";
import { DashNumberService } from "../services/dash-number/dash-number.service";
import { AircraftModelEndpointService } from "../services/aircraft-model/aircraft-model-endpoint.service";
import { DashNumberEndpointService } from "../services/dash-number/dash-number-endpoint.service";
import { DropdownModule } from "primeng/dropdown";
import { VendorCapesComponent } from "../components/vendor/vendor-capes/vendor-capes.component";
import { MatTooltipModule } from '@angular/material/tooltip';
import { VendorATAInformationComponent } from "../components/vendor/vendor-ata-information/vendor-ata.component";
import { SalesOrderEndpointService } from "../services/salesorder-endpoint.service";
import { SalesOrderService } from "../services/salesorder.service";
import { AppSharedModule } from "../app-shared.module";
import { ReceivingService } from "../services/receiving/receiving.service";
import { ReceivingEndpointService } from "../services/receiving/receiving-endpoint.service";
import { AllViewComponent } from "../shared/components/all-view/all-view.component";
//import { AddressComponentComponent } from "../components/address-component/address-component.component";
//import { AllApprovalRuleComponent } from "../components/all-approval-rule/all-approval-rule.component";
//import { CommonDocumentsComponent } from "../components/common-documents/common-documents.component";
import { PoApprovalRuleComponent } from "../components/vendor/purchase-orders/po-approval-rule/po-approval-rule.component";
import { PoSettingsComponent } from "../components/vendor/purchase-orders/po-settings/po-settings.component";
import { CommonDocumentsModule } from "../components/common-components/common-documents/common-documents.module";
import { CommonCommunicationModule } from "../components/common-components/common-communication/common-communiation.module";
import { POViewStockDraftListComponent } from "../components/receiving/po-ro/po-view-draftlist/po-view-draftlist.component";
import { POViewListComponent } from "../components/receiving/po-ro/po-view-list/po-view-list.component";
import { ROViewStockDraftListComponent } from "../components/receiving/repair-order/ro-view-draftlist/ro-view-draftlist.component";
import { ROViewListComponent } from "../components/receiving/repair-order/ro-view-list/ro-view-list.component";	
import { PurchaseOrderPrintTemplateComponent } from "../components/vendor/purchase-orders/purchase-order-print-template/purchase-order-print-template.component";
import { RepairOrderPrintTemplateComponent } from "../components/vendor/repaire-orders/repair-order-print-template/repair-order-print-template.component";	


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
		VendorPagesRoutingModule,
		InputSwitchModule,
		CheckboxModule,
		AutoCompleteModule,
		GMapModule
		, RadioButtonModule, FileUploadModule,
		StepsModule,
		BreadcrumbModule, DialogModule, CalendarModule,
		TreeModule,
		TreeTableModule,
		ValidateAccessModule,
		TabViewModule,
		TooltipModule,
		DropdownModule,
		MatTooltipModule,
		EditorModule,
		AppSharedModule,
		CommonModulesModule,
		CommonDocumentsModule,
		CommonCommunicationModule
	],
	declarations: [
		VendorpagesComponent,
		VendorContactsComponent,
		VendorCapesComponent,
		VendorFinancialInformationComponent,
		VendorGeneralInformationComponent,
		VendorPaymentInformationComponent,
		VendorBillingInformationComponent,
		VendorShippingInformationComponent,
		VendorWarningsComponent,
		VendorMemoComponent,
		VendorEmailsComponent,
		VendorConversationsComponent,
		VendorsListComponent,
		AddActionsDialogComponent,
		VendorStepsPrimeNgComponent,
		CreatePoComponent,
		PoApprovalComponent,
		RoApprovalComponent,
		RoApprovalRuleComponent,
		RoSettingsComponent,
		PoApprovalRuleComponent,
		PolistComponent,
		PurchaseSetupComponent,
		CreateRoComponent,
		RoListComponent,
		RoSetupComponent,
		VendorCapabilitiesListComponent,
		AddVendorCapabilitiesComponent,
		EditVendorCapabilitiesComponent,
		VendorDocumentsComponent,
		VendorATAInformationComponent,
		//AddressComponentComponent,
		//CommonDocumentsComponent,
		//AllApprovalRuleComponent,
		PoSettingsComponent,
		AllViewComponent,
		POViewStockDraftListComponent,
		POViewListComponent,
		ROViewStockDraftListComponent,
		ROViewListComponent,
		PurchaseOrderPrintTemplateComponent,
		RepairOrderPrintTemplateComponent
	],
	providers: [
		VendorClassificationComponent,
		AircraftModelService,
		AircraftModelEndpointService,
		DashNumberService,
		DashNumberEndpointService,
		AuthService,
		SalesOrderService,
		SalesOrderEndpointService,
		ReceivingService,
		ReceivingEndpointService
	],
	entryComponents: [
		AddActionsDialogComponent,
	],
	exports:[PolistComponent,RoListComponent]
})
export class VendorPagesModule {

}