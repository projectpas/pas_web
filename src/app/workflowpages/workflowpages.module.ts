// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
//import { QuickAppProMaterialModule } from "../modules/material.module";
//import { GroupByPipe } from '../pipes/group-by.pipe';

//import { ReceivingPagesRoutingModule } from "./customerpages-routing.module";

//import { CustomerPagesComponent } from "./customerpages.component";

import { CommonModule, DatePipe } from '@angular/common'; //<-- This one
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { GMapModule } from 'primeng/gmap';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepsModule } from 'primeng/steps'; //Prime Ng Steps
import { DialogModule } from 'primeng/dialog'; //Prime Ng Dailog
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputSwitchModule } from 'primeng/inputswitch';
import {EditorModule} from 'primeng/editor';
import { CalendarModule } from 'primeng/calendar';

import { WorkflowListComponent } from '../components/workflow/workflow-list/workflow-list.component';
import { WorkFlowPagesRoutingModule } from './workflowpages-routing.module';

import { WorkFlowPagesComponent } from './workflowpages.component';
import { WorkflowCreateComponent } from '../components/workflow/workflow-create/workflow-create.component';
import { AccordionModule } from 'primeng/accordion';

import { TabViewModule } from 'primeng/tabview';
import { WorkflowCreateTestComponent } from '../Workflow/Workflow-Create.component';
import { ActionService } from '../Workflow/ActionService';
import { ActionEndpoint } from '../Workflow/action-endpoint.service';
import { ChargesCreateComponent } from '../shared/Charges-Create.component';
import { DirectionsCreateComponent } from '../shared/Directions-Create.component';
import { EquipmentCreateComponent } from '../shared/Equipment-Create.component';
import { ExpertiseCreateComponent } from '../shared/Expertise-Create.component';
import { MaterialListCreateComponent } from '../shared/Material-List-Create.component';
import { PublicationCreateComponent } from '../shared/Publication-Create.component';
import { ExclusionsCreateComponent } from '../shared/Exclusions-Create.component';
import { MeasurementCreateComponent } from '../shared/Measurement-Create.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {
  MatIconModule,
  MatSelectModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { StarComponent } from '../shared/star.component';
import { AssetService } from '../services/asset/Assetservice';
import { AssetEndpoint } from '../services/asset/Asset-endpoint.service';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { SpinnerModule } from 'primeng/spinner';
import { ToolbarModule } from 'primeng/toolbar';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PercentService } from '../services/percent.service';
import { PercentEndpoint } from '../services/percent-endpoint.service';
import { AircraftManufacturerService } from '../services/aircraft-manufacturer/aircraftManufacturer.service';
import { AircraftManufacturerEndpointService } from '../services/aircraft-manufacturer/aircraftManufacturer-endpoint.service';
import { AircraftModelEndpointService } from '../services/aircraft-model/aircraft-model-endpoint.service';
import { AircraftModelService } from '../services/aircraft-model/aircraft-model.service';
import { DashNumberService } from '../services/dash-number/dash-number.service';
import { DashNumberEndpointService } from '../services/dash-number/dash-number-endpoint.service';
import { WorkOrderService } from '../services/work-order/work-order.service';
import { WorkOrderEndpointService } from '../services/work-order/work-order-endpoint.service';
import { WorkOrderQuoteService } from '../services/work-order/work-order-quote.service';
import { QuoteEndpointService } from '../services/work-order/work-order-quote.endpoint.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NTAEAlternateComponent } from '../components/item-masters/item-master-stock/ntae-alternate/ntae-alternate.component';
import { ItemmasterPagesComponent } from '../itemmasterpages/itemmasterpages.component';
import { ItemMasterListComponent } from '../components/item-masters/item-master-list/item-master-list.component';
import { ItemMasterSetupComponent } from '../components/item-masters/item-master-setup/item-master-setup.component';
import { ItemMasterStockComponent } from '../components/item-masters/item-master-stock/item-master-stock.component';
import { ItemMasterNonStockComponent } from '../components/item-masters/item-master-non-stock/item-master-non-stock.component';
import { ItemMasterExchangeComponent } from '../components/item-masters/item-master-exchange/item-master-exchange.component';
import { ItemMasterEquipmentComponent } from '../components/item-masters/item-master-equipment/item-master-equipment.component';
import { ItemMasterLoanComponent } from '../components/item-masters/item-master-loan/item-master-loan.component';
import { ItemMasterCreateCapabilitiesComponent } from '../components/item-masters/Capabilities/item-master-create-capabilities/item-master-create-capabilities.component';
import { ItemMasterCapabilitiesListComponent } from '../components/item-masters/Capabilities/item-master-capabilities-list/item-master-capabilities-list.component';
import { ItemMasterExchangeLoanComponent } from '../components/item-masters/item-master-exch-loan/item-master-exch-loan.component';
import { ItemmasterpagesModule } from '../itemmasterpages/itemmasterpages.module';



@NgModule({
  imports: [
    CardModule,
    CalendarModule,
    EditorModule,
    TableModule,
    InputTextareaModule,
    AutoCompleteModule,
    CheckboxModule,
    DropdownModule,
    SpinnerModule,
    ToolbarModule,
    TooltipModule,
    KeyFilterModule,
    FlexLayoutModule,
    InputSwitchModule,
    FormsModule,
    ReactiveFormsModule,
    //QuickAppProMaterialModule,
    TranslateModule,
    CommonModule,
    TableModule,
    ButtonModule,
    SelectButtonModule,
    InputTextModule,
    MultiSelectModule,
    WorkFlowPagesRoutingModule,
    AutoCompleteModule,
    MatSelectModule,
    MatTabsModule,
    MatIconModule,
    GMapModule,
    RadioButtonModule,
    FileUploadModule,
    DialogModule,
    StepsModule,
    BreadcrumbModule,
    CalendarModule,
    AccordionModule,
    TabViewModule,
    MatTooltipModule,
    NgbModalModule,
    ItemmasterpagesModule,

    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    WorkFlowPagesComponent,
    WorkflowListComponent,
    WorkflowCreateComponent,
    WorkflowCreateTestComponent,

    ChargesCreateComponent,
    DirectionsCreateComponent,
    EquipmentCreateComponent,
    ExpertiseCreateComponent,
    MaterialListCreateComponent,
    PublicationCreateComponent,
    ExclusionsCreateComponent,
    MeasurementCreateComponent,
    StarComponent,
    // NTAEAlternateComponent,
    // ItemmasterPagesComponent,
    // ItemMasterListComponent,
    // ItemMasterSetupComponent,
    // ItemMasterStockComponent,
    // ItemMasterNonStockComponent,
    // ItemMasterEquipmentComponent,
    // ItemMasterExchangeComponent,
    // ItemMasterLoanComponent,
    // ItemMasterCreateCapabilitiesComponent,
    // ItemMasterCapabilitiesListComponent,
    // ItemMasterExchangeLoanComponent,

  ],
  exports: [
    WorkflowCreateTestComponent,
    WorkflowListComponent,
    ChargesCreateComponent,
    DirectionsCreateComponent,
    EquipmentCreateComponent,
    ExpertiseCreateComponent,
    MaterialListCreateComponent,
    PublicationCreateComponent,
    ExclusionsCreateComponent,
    MeasurementCreateComponent
  ],
  providers: [
    ActionService,
    ActionEndpoint,
    AssetService,
    AssetEndpoint,
    PercentService,
    PercentEndpoint,
    PercentService,
    PercentEndpoint,
    AircraftManufacturerService,
    AircraftManufacturerEndpointService,
    AircraftModelService,
    AircraftModelEndpointService,
    DashNumberService,
    DashNumberEndpointService,
    WorkOrderService,
    WorkOrderEndpointService,
    WorkOrderQuoteService,
    QuoteEndpointService
  ],
  entryComponents: []
})
export class WorkFlowPagesModule { }
