import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { QuickAppProMaterialModule } from "../modules/material.module";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ExchangeSalesOrderSettingsRoutingModule } from "./exchange-sales-order-settings-routing.module";
import { ExchangeSalesOrderSettingsComponent } from "./exchange-sales-order-settings.component";
import { CreateExchangeQuoteSettingsComponent } from "./create-exchange-quote-settings/create-exchange-quote-settings.component";
import { ExchangeQuoteSettingsListComponent } from "./exchange-quote-settings-list/exchange-quote-settings-list.component";
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
import { BreadcrumbModule } from "primeng/breadcrumb";
import { SharedModule } from "primeng/components/common/shared";
import { DropdownModule } from "primeng/dropdown";
import { CardModule } from "primeng/card";
import { PanelMenuModule } from "primeng/panelmenu";
import { HttpClientModule } from "@angular/common/http";
import { CalendarModule } from "primeng/calendar";
import { ExchangequoteService } from "../services/exchangequote.service";
import { ExchangeQuoteEndpointService } from "../services/exchangequote-endpoint.service";
import { CreateExchangeSalesOrderSettingsComponent } from "./create-exchange-sales-order-settings/create-exchange-sales-order-settings.component";
import { ExchangeSalesOrderSettingsListComponent } from "./exchange-sales-order-settings-list/exchange-sales-order-settings-list.component";

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
		ExchangeSalesOrderSettingsRoutingModule,
		InputSwitchModule,
		CheckboxModule,
		AutoCompleteModule,
		CalendarModule,
		GMapModule
		, RadioButtonModule, FileUploadModule, TreeTableModule, TreeModule,
		NgMultiSelectDropDownModule
	],
	declarations: [
		ExchangeSalesOrderSettingsComponent,
		CreateExchangeQuoteSettingsComponent,
		ExchangeQuoteSettingsListComponent,
		ExchangeSalesOrderSettingsListComponent,
		CreateExchangeSalesOrderSettingsComponent
	],
	providers: [
		ExchangequoteService,
		ExchangeQuoteEndpointService,
		DatePipe
	],
	entryComponents: [
	],
})
export class ExchangeSalesOrderSettingsModule {}