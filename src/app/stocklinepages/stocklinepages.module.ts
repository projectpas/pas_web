import { NgModule } from "@angular/core";
import { CalendarModule } from 'primeng/calendar';
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { QuickAppProMaterialModule } from "../modules/material.module";
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
import { BreadcrumbModule } from 'primeng/breadcrumb'; //bread crumb
import { DialogModule } from 'primeng/dialog'; //Prime Ng Dailog
import { StepsModule } from "primeng/steps";
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { CommonDocumentsModule } from '../components/common-components/common-documents/common-documents.module';

import {EditorModule} from 'primeng/editor';



import { StockLineListComponent } from "../components/stockline/stock-line-list/stock-line-list.component";
import { StockLineSetupComponent } from "../components/stockline/stock-line-setup/stock-line-setup.component";
import { StockAdjustmentComponent } from "../components/stockline/stock-adjustment/stock-adjustment.component";
import { StocklinePagesRoutingModule } from "./stocklinepages-routing.module";
import { StocklinepagesComponent } from './stocklinepages.component';
import { StockLineEditComponent } from '../components/stockline/stock-line-edit/stock-line-edit.component';
import { AuditModule } from "../audit/audit.module";
import { DropdownModule } from 'primeng/dropdown';
import { StockLineReportViewComponent } from "../components/stockline/stock-line-report/stock-line-report-view.component";
import { KeyFilterModule } from "primeng/keyfilter";

@NgModule({
	imports: [

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
		InputSwitchModule,
		CheckboxModule,
		AutoCompleteModule,
		GMapModule
		, RadioButtonModule, FileUploadModule,
		StepsModule,
		BreadcrumbModule, DialogModule,
		CalendarModule,
		StocklinePagesRoutingModule,
		TreeModule,
		TreeTableModule,
		AuditModule,
		DropdownModule,
		KeyFilterModule,
		EditorModule,
		CommonDocumentsModule,


	],
	declarations: [
		StockLineListComponent,
		StockLineSetupComponent,
		StockAdjustmentComponent,
		StocklinepagesComponent,
        StockLineEditComponent,
        StockLineReportViewComponent
	],
	providers: [

	],
	entryComponents: [

	],


})
export class StocklinePagesModule {

}