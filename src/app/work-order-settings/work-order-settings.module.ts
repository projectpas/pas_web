
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { QuickAppProMaterialModule } from "../modules/material.module";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { WorkOrderSettingsRoutingModule } from "./work-order-settings-routing.module";

import { WorkOrderSettingsComponent } from "./work-order-settings.component";


import { CreateWorkOrderSettingsComponent } from "./create-work-order-settings/create-work-order-settings.component";
import { WorkOrderSettingsListComponent } from "./work-order-settings-list/work-order-settings-list.component";
import { CreateWOQuoteSettingsComponent } from "./create-wo-quote-settings/create-wo-quote-settings.component";
import { WOQuoteSettingsListComponent } from "./wo-quote-settings-list/wo-quote-settings-list.component";

import { CommonModule } from '@angular/common'; //<-- This one
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
		WorkOrderSettingsRoutingModule,
		InputSwitchModule,
		CheckboxModule,
		AutoCompleteModule,
		CalendarModule,
		GMapModule
		, RadioButtonModule, FileUploadModule, TreeTableModule, TreeModule  ,
		NgMultiSelectDropDownModule
	],
	declarations: [
        WorkOrderSettingsComponent,
        CreateWorkOrderSettingsComponent,
		WorkOrderSettingsListComponent,
		CreateWOQuoteSettingsComponent,
		WOQuoteSettingsListComponent
	],
    providers: [
        WorkOrderSettingsService,
		WorkOrderSettingsEndpointService
	],
	entryComponents: [
	],


})
export class WorkOrderSettingsModule {

}