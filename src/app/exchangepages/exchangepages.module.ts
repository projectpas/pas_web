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
import { ExchangeQuotePartNumberComponent } from "../components/exchange-quote/shared/components/exchange-quote-part-number/exchange-quote-part-number.component";
import { AddExchangePartNumberComponent } from "../components/exchange-quote/shared/components/add-exchange-part-number/add-exchange-part-number.component";
import { ExchangeCustomerDetailsComponent } from "../components/exchange-quote/shared/components/add-exchange-part-number/exchange-customer-details/exchange-customer-details.component";
import { ExchangePartDetailsComponent } from "../components/exchange-quote/shared/components/add-exchange-part-number/exchange-part-details/exchange-part-details.component";
import { ExchangePartNumberFilterComponent } from "../components/exchange-quote/shared/components/add-exchange-part-number/exchange-part-number-filter/exchange-part-number-filter.component";
import { ExchangeMerginComponent } from "../components/exchange-quote/shared/components/exchange-mergin/exchange-mergin.component";
import { CommonModulesModule } from "../common-modules/common-modules.module";
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
    CommonModulesModule,
  ],
  declarations: [
    ExchangepagesComponent,
    ExchangeQuoteListComponent,
    ExchangeQuoteCreateComponent,
    ExchangeQuoteComponent,
    ExchangeQuotePartNumberComponent,
    AddExchangePartNumberComponent,
    ExchangeCustomerDetailsComponent,
    ExchangePartDetailsComponent,
    ExchangePartNumberFilterComponent,
    ExchangeMerginComponent
  ],
  providers: [CommonService,DatePipe,ExchangequoteService,ExchangeQuoteEndpointService],
  entryComponents: []
})
export class ExchangepagesModule { }
