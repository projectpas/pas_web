import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExchangepagesComponent } from './exchangepages.component';
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
import { TabViewModule } from "primeng/tabview";
import { AppSharedModule } from "../app-shared.module";
import { ExchangepagesRoutingRoutes } from "./exchangepages-routing.module";
import { ExchangeQuoteListComponent } from "../components/exchange-quote/exchange-quote-list/exchange-quote-list.component";
import { ExchangeQuoteCreateComponent } from "../components/exchange-quote/exchange-quote-create/exchange-quote-create.component";
import { ExchangeQuoteComponent } from "../components/exchange-quote/exchange-quote/exchange-quote.component";
import { CommonService } from "../services/common.service";
import { ExchangequoteService } from "../services/exchangequote.service";
import { ExchangeQuoteEndpointService } from "../services/exchangequote-endpoint.service";
@NgModule({
  imports: [
    CommonModule,
    ExchangepagesRoutingRoutes,
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
    EditorModule,
    SplitButtonModule,
  ],
  declarations: [
    ExchangepagesComponent,
    ExchangeQuoteListComponent,
    ExchangeQuoteCreateComponent,
    ExchangeQuoteComponent
  ],
  providers: [CommonService,DatePipe,ExchangequoteService,ExchangeQuoteEndpointService],
  entryComponents: []
})
export class ExchangepagesModule { }
