import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { QuickAppProMaterialModule } from "../modules/material.module";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ARSettingsRoutingModule } from "./account-receivable-settings-routing.module";
import { ARSettingsComponent } from "./account-receivable-settings.component";
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
import { BreadcrumbModule } from "primeng/breadcrumb";
import { SharedModule } from "primeng/components/common/shared";
import { DropdownModule } from "primeng/dropdown";
import { CardModule } from "primeng/card";
import { PanelMenuModule } from "primeng/panelmenu";
import { HttpClientModule } from "@angular/common/http";
import { CalendarModule } from "primeng/calendar";
import { CreateARSettingsComponent } from "./create-account-receivable-settings/create-account-receivable-settings.component";
import { ARSettingsListComponent } from "./account-receivable-settings-list/account-receivable-settings-list.component";
import { CustomerPaymentsService } from "../services/customer-payment.service";
import { CustomerPaymentsEndpointService } from "../services/customer-payments-endpoint.service";

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
		ARSettingsRoutingModule,
		InputSwitchModule,
		CheckboxModule,
		AutoCompleteModule,
		CalendarModule,
		GMapModule
		, RadioButtonModule, FileUploadModule, TreeTableModule, TreeModule,
		NgMultiSelectDropDownModule
	],
	declarations: [
		ARSettingsComponent,
		ARSettingsListComponent,
		CreateARSettingsComponent
	],
	providers: [
		CustomerPaymentsService,
		CustomerPaymentsEndpointService,
		DatePipe
	],
	entryComponents: [
	],
})
export class ARSettingsModule {}