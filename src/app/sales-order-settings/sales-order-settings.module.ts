
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { QuickAppProMaterialModule } from "../modules/material.module";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SalesOrderSettingsRoutingModule } from "./sales-order-settings-routing.module";
import { SalesOrderSettingsComponent } from "./sales-order-settings.component";
import { CreateSalesQuoteSettingsComponent } from "./create-sales-quote-settings/create-sales-quote-settings.component";
import { SalesQuoteSettingsListComponent } from "./sales-quote-settings-list/sales-quote-settings-list.component";

import { CommonModule, DatePipe } from '@angular/common'; //<-- This one
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';


import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from "primeng/autocomplete";
import { GMapModule } from 'primeng/gmap';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TreeTableModule } from "primeng/treetable";
import { TreeModule } from 'primeng/tree';
import { WorkOrderSettingsService } from "../services/work-order-settings.service";
import { WorkOrderSettingsEndpointService } from "../services/work-order-settings-endpoint.service";
import { SingleScreenBreadcrumbService } from '../services/single-screens-breadcrumb.service';
import { BreadcrumbModule } from "primeng/breadcrumb";
import { SharedModule } from "primeng/components/common/shared";
import { DropdownModule } from "primeng/dropdown";
import { CardModule } from "primeng/card";
import { PanelMenuModule } from "primeng/panelmenu";
import { HttpClientModule } from "@angular/common/http";
import { CalendarModule } from "primeng/calendar";
import { SalesQuoteService } from "../services/salesquote.service";
import { SalesQuoteEndpointService } from "../services/salesquote-endpoint.service";
import { CreateSalesOrderSettingsComponent } from "./create-sales-order-settings/create-sales-order-settings.component";
import { SalesOrderSettingsListComponent } from "./sales-order-settings-list/sales-order-settings-list.component";


@NgModule({
	imports: [
		CardModule,
		PanelMenuModule,
		HttpClientModule,
		SharedModule,
		BreadcrumbModule,
		DropdownModule,
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
		SalesOrderSettingsRoutingModule,
		InputSwitchModule,
		CheckboxModule,
		AutoCompleteModule,
		CalendarModule,
		GMapModule
		, RadioButtonModule, FileUploadModule, TreeTableModule, TreeModule,
		NgMultiSelectDropDownModule
	],
	declarations: [
		SalesOrderSettingsComponent,
		CreateSalesQuoteSettingsComponent,
		SalesQuoteSettingsListComponent,
		SalesOrderSettingsListComponent,
		CreateSalesOrderSettingsComponent
	],
	providers: [
		WorkOrderSettingsService,
		WorkOrderSettingsEndpointService,
		SalesQuoteService,
		SalesQuoteEndpointService,
		DatePipe
	],
	entryComponents: [
	],


})
export class SalesOrderSettingsModule {

}