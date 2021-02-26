// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { QuickAppProMaterialModule } from "../modules/material.module";
//import { GroupByPipe } from '../pipes/group-by.pipe';

//import { ReceivingPagesRoutingModule } from "./customerpages-routing.module";

//import { CustomerPagesComponent } from "./customerpages.component";


import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from "primeng/autocomplete";
import { GMapModule } from 'primeng/gmap';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepsModule } from 'primeng/steps';//Prime Ng Steps
import { DialogModule } from 'primeng/dialog'; //Prime Ng Dailog
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common'; //<-- This one


import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { TabViewModule } from 'primeng/tabview';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TooltipModule } from 'primeng/tooltip';

import { ReceivingPagesRoutingModule } from "./receivingpages-routing.module";
import { CustomerWorksListComponent } from "../components/receiving/customer-work/customer-works-list/customer-works-list.component";
import { CustomerWorkSetupComponent } from "../components/receiving/customer-work/customer-work-setup/customer-work-setup.component";
import { CustomerWorkEditComponent } from "../components/receiving/customer-work/customer-work-edit/customer-work-edit.component";
import { ReceivingpagesComponent } from "./receivingpages.component";
import { CalendarModule } from "primeng/calendar";
import { EditPoComponent } from "../components/receiving/po-ro/edit-po/edit-po.component";
import { PurchaseOrderComponent } from "../components/receiving/po-ro/purchase-order/purchase-order.component";
import { ReceivngPoComponent } from "../components/receiving/po-ro/receivng-po/receivng-po.component";
import { ReceivingService } from "../services/receiving/receiving.service";
import { ReceivingEndpointService } from "../services/receiving/receiving-endpoint.service";
import { RepairOrderComponent } from "../components/receiving/repair-order/repair-order.component";
import { ViewPoComponent } from "../components/receiving/po-ro/view-po/view-po.component";
import { EditRoComponent } from "../components/receiving/repair-order/edit-ro/edit-ro.component";
import { RoComponent } from "../components/receiving/repair-order/ro/ro.component";
import { ReceivingRoComponent } from "../components/receiving/repair-order/receiving-ro/receiving-ro.component";
import { ViewRoComponent } from "../components/receiving/repair-order/view-ro/view-ro.component";
import { ShippingService } from "../services/shipping/shipping-service";
import { ShippingEndpoint } from "../services/shipping/shipping-endpoint.service";
//import { POViewListComponent } from "../components/receiving/po-ro/po-view-list/po-view-list.component";
import { CommonService } from "../services/common.service";
import { ROViewListComponent } from "../components/receiving/repair-order/ro-view-list/ro-view-list.component";
import { TagTypeEndpointService } from "../services/tagtype-endpoint.service";
import { TagTypeService } from "../services/tagtype.service";
//import { POViewStockDraftListComponent } from "../components/receiving/po-ro/po-view-draftlist/po-view-draftlist.component";
import { ROViewStockDraftListComponent } from "../components/receiving/repair-order/ro-view-draftlist/ro-view-draftlist.component";
import { DropdownModule } from "primeng/dropdown";
import { CommonDocumentsModule } from "../components/common-components/common-documents/common-documents.module";
import {EditorModule} from 'primeng/editor';
import { VendorPagesModule} from '../vendorpages/vendorpages.module';


@NgModule({
    imports: [
		VendorPagesModule,
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
		DropdownModule,
		ReceivingPagesRoutingModule,
		AutoCompleteModule,
		CommonDocumentsModule,
		EditorModule,
        GMapModule, RadioButtonModule, FileUploadModule, DialogModule, StepsModule, BreadcrumbModule, CalendarModule, InputSwitchModule, CheckboxModule, TreeModule, TreeTableModule, TabViewModule, KeyFilterModule, TooltipModule
	],
	declarations: [
		CustomerWorksListComponent,
		CustomerWorkSetupComponent, 
		CustomerWorkEditComponent,
		EditPoComponent,
		PurchaseOrderComponent,
		ReceivngPoComponent,
        ReceivingpagesComponent,
        RepairOrderComponent,
        ViewPoComponent,
        EditRoComponent,
        RoComponent,
        ReceivingRoComponent,
        ViewRoComponent,
		//POViewListComponent,
		//POViewStockDraftListComponent,
		//ROViewListComponent,
		//ROViewStockDraftListComponent

	],
    providers: [
        ReceivingService,
        ReceivingEndpointService,
        ShippingService,
		ShippingEndpoint,
        CommonService,
        TagTypeEndpointService,
        TagTypeService
	],
	entryComponents: [
	],
})
export class ReceivingPagesModule
{

}