// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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


import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { PolistComponent } from '../components/vendor/purchase-orders/polist/polist.component';
import { CreatePoComponent } from '../components/vendor/purchase-orders/create-po/create-po.component';
import { PoApprovalComponent } from '../components/vendor/purchase-orders/po-approval/po-approval.component';
import { RoApprovalComponent } from '../components/vendor/repaire-orders/ro-approval/ro-approval.component';
import { PurchaseSetupComponent } from '../components/vendor/purchase-orders/purchase-setup/purchase-setup.component';
import { CreateRoComponent } from '../components/vendor/repaire-orders/create-ro/create-ro.component';
import { RoListComponent } from '../components/vendor/repaire-orders/ro-list/ro-list.component';
import { RoSetupComponent } from '../components/vendor/repaire-orders/ro-setup/ro-setup.component';

import { VendorCapabilitiesListComponent } from "../components/vendor/vendor-caps/vendor-capabilities-list/vendor-capabilities-list.component";
import { AddVendorCapabilitiesComponent } from "../components/vendor/vendor-caps/add-vendor-capabilities/add-vendor-capabilities.component";
import { EditVendorCapabilitiesComponent } from '../components/vendor/vendor-caps/edit-vendor-capabilities/edit-vendor-capabilities.component';
import { RolesGuardService } from '../services/roles-guard.service';
import { CommonService } from '../services/common.service';
import { VendorDocumentsComponent } from '../components/vendor/vendor-documents/vendor-documents.component';
import { VendorCapesComponent } from '../components/vendor/vendor-capes/vendor-capes.component';
import { VendorATAInformationComponent } from '../components/vendor/vendor-ata-information/vendor-ata.component';
import { PoApprovalRuleComponent } from '../components/vendor/purchase-orders/po-approval-rule/po-approval-rule.component';
import {PoSettingsComponent } from "../components/vendor/purchase-orders/po-settings/po-settings.component";
const vendorPagesRoutes: Routes = [
	{
		path: 'vendorpages',
		component: VendorpagesComponent,
		children: [
			{ path: "app-vendors-list", component: VendorsListComponent, data: { name: ['app-vendors-list'], title: "Vendor's List" } },
			{ path: "app-vendor-general-information", component: VendorGeneralInformationComponent, data: { isTab: true, name: ['app-vendor-general-information'], title: "Vendor's General Information" } },
			{ path: "app-vendor-general-information/:id", component: VendorGeneralInformationComponent, data: { isTab: true, name: ['app-vendor-general-information'], title: "Vendor's General Information" } },
			{ path: "app-vendor-contacts/:id", component: VendorContactsComponent, data: { isTab: true, name: ['app-vendor-contacts'], title: "Vendor's Contact" } },
			{ path: 'app-vendor-ata/:id', component: VendorATAInformationComponent },
			{ path: "app-vendor-capes/:id", component: VendorCapesComponent, data: { name: ['app-vendor-capes'], title: "Vendor Capabilities" } },
			{ path: "app-vendor-financial-information/:id", component: VendorFinancialInformationComponent, data: { isTab: true, name: ['app-vendor-financial-information'], title: "Vendor's Financial Information" } },
			{ path: "app-vendor-payment-information/:id", component: VendorPaymentInformationComponent, data: { isTab: true, name: ['app-vendor-payment-information'], title: "Vendor's Payment Information" } },
			{ path: "app-vendor-billing-information/:id", component: VendorBillingInformationComponent, data: { isTab: true, name: ['app-vendor-billing-information'], title: "Vendor's Billing Information" } },
			{ path: "app-vendor-shipping-information/:id", component: VendorShippingInformationComponent, data: { isTab: true, name: ['app-vendor-shipping-information'], title: "Vendor's Shipping Information" } },
			{ path: "app-vendor-warnings/:id", component: VendorWarningsComponent, data: { isTab: true, name: ['app-vendor-warnings'], title: "Vendor Warnings" } },
			{ path: "app-vendor-memo/:id", component: VendorMemoComponent, data: { title: "Vendor Memo" } },
			{ path: "app-vendor-documents/:id", component: VendorDocumentsComponent, data: { title: "Vendor Documents" } },
			{ path: "app-vendor-emails", component: VendorEmailsComponent, data: { title: "Vendor Emails" } },
			{ path: "app-vendor-conversations", component: VendorConversationsComponent, data: { title: "Vendor Conversations" } },
			{ path: "app-polist", component: PolistComponent, data: { title: "PO List" } },
			{ path: "app-create-po", component: CreatePoComponent, data: { title: "Create PO" } },
			{ path: "app-po-approval", component: PoApprovalComponent, data: { title: "Po Approval" } },
			{ path: "app-po-approval-rule", component: PoApprovalRuleComponent, data: { title: "Po Approval Rule"} },
			{ path: "app-ro-approval", component: RoApprovalComponent, data: { title: "Ro Approval" } },
			{ path: "app-purchase-setup", component: PurchaseSetupComponent, data: { title: "Purchase Setup" } },
			{ path: "app-purchase-setup/edit/:id", component: PurchaseSetupComponent, data: { title: "Purchase Setup" } },
			{ path: "app-purchase-setup/vendor/:vendorId", component: PurchaseSetupComponent, data: { title: "Purchase Setup" } },
			{ path: "app-create-ro", component: CreateRoComponent, data: { title: "Create-Ro" } },
			{ path: "app-ro-list", component: RoListComponent, data: { title: "Ro-List" } },
			{ path: "app-ro-setup", component: RoSetupComponent, data: { title: "RO Setup" } },
			{ path: "app-ro-setup/edit/:id", component: RoSetupComponent, data: { title: "RO Setup" } },
			{ path: "workorder-ro-edit/:id/:mpnid", component: RoSetupComponent, data: { title: "RO Setup" } },
			{ path: "workorder-ro-create/:id/:mpnid", component: RoSetupComponent, data: { title: "RO Setup" } },
			//for workorder and subwo
			{ path: "workorder-ro-create/:id/:mpnid/:subWOPartNoId", component: RoSetupComponent, data: { title: "RO Setup" } },
			{ path: "app-ro-setup/vendor/:vendorId", component: RoSetupComponent, data: { title: "RO Setup" } },
			{ path: "app-vendor-capabilities-list", component: VendorCapabilitiesListComponent, data: { title: "capabilities-list" } },
			{ path: "app-add-vendor-capabilities", component: AddVendorCapabilitiesComponent, data: { title: "Add Capabilities" } },
			{ path: "app-add-vendor-capabilities/edit/:id", component: AddVendorCapabilitiesComponent, data: { title: "Edit Capabilities" } },
			{ path: "workorder-po-create/:id/:mpnid", component: PurchaseSetupComponent, data: { title: "Create PO" } },
			//for workorder and subwo
			{ path: "workorder-po-create/:id/:mpnid/:materialsId", component: PurchaseSetupComponent, data: { title: "Create PO" } },
			{ path: "app-po-settings", component: PoSettingsComponent, data: { title: "PO Setting" } },
			// { path: "app-edit-vendor-capabilities", component: EditVendorCapabilitiesComponent, data: { title: "capabilities-edit" } },

		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(vendorPagesRoutes)
	],
	exports: [
		RouterModule
	],
	providers: [
		AuthService, AuthGuard, CommonService
	]
})
export class VendorPagesRoutingModule { }