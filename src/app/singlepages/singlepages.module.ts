// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { QuickAppProMaterialModule } from "../modules/material.module";
import { CommonModule } from '@angular/common'; //<-- This one
import { RouterModule, Routes } from '@angular/router';
import { GroupByPipe } from '../pipes/group-by.pipe';

import { SinglePagesRoutingModule } from "./singlepages-routing.module";

import { SingleComponent } from "./singlepages.component";
import { ActionsComponent } from '../components/actions/actions.component';
import { TaskAttributesComponent } from '../components/task-attributes/task-attributes.component';
import { AtaMainComponent } from '../components/ata-main/ata-main.component';
import { CreditTermsComponent } from '../components/credit-terms/credit-terms.component';
import { CurrencyComponent } from '../components/currency/currency.component';
import { CustomerClassificationComponent } from '../components/customer-classification/customer-classification.component';
import { DocumentsComponent } from '../components/documents/documents.component';
import { EmployeeExpertiseComponent } from '../components/employee-expertise/employee-expertise.component';
import { FindingsComponent } from '../components/findings/findings.component';
import { IntegrationComponent } from '../components/integration/integration.component';
import { ItemClassificationComponent } from '../components/item-classification/item-classification.component';
import { ItemGroupComponent } from '../components/item-group/item-group.component';
import { JobTitleComponent } from '../components/job-title/job-title.component';
import { PriorityComponent } from '../components/priority/priority.component';
import { ProvisionComponent } from '../components/provision/provision.component';
import { PublicationComponent } from '../components/publication/publication.component';
import { ReasonComponent } from '../components/reason/reason.component';
import { TaxRateComponent } from '../components/tax-rate/tax-rate.component';
import { UnitOfMeasureComponent } from '../components/unit-of-measure/unit-of-measure.component';
import { VendorClassificationComponent } from '../components/vendor-classification/vendor-classification.component';
import { WorkPerformedComponent } from '../components/work-performed/work-performed.component';
import { WorkScopeComponent } from '../components/work-scope/work-scope.component';

import { LeadSourceComponent } from '../components/lead-source/lead-source.component';
import { ActionAttributeMappingComponent } from '../components/action-attribute-mapping/action-attribute-mapping.component';
import { AtaSubChapter1Component } from '../components/ata-sub-chapter1/ata-sub-chapter1.component';
import { AtaSubChapter2Component } from '../components/ata-sub-chapter2/ata-sub-chapter2.component';
import { SiteComponent } from '../components/site/site.component';
import { CapabilitiesComponent } from '../components/capabilities/capabilities.component';
import { FinancialStatementMappingComponent } from '../components/financial-statement-mapping/financial-statement-mapping.component';
import { GlAccountClassComponent } from '../components/gl-account-class/gl-account-class.component';
import { GlCashFlowClassificationComponent } from '../components/gl-cash-flow-classification/gl-cash-flow-classification.component';
import { GlFinancialStatementComponent } from '../components/gl-financial-statement/gl-financial-statement.component';
import { JournalApprovalsComponent } from '../components/journal-approvals/journal-approvals.component';
import { RfqEngineComponent } from '../components/rfq-engine/rfq-engine.component';
import { ActionsEditorComponent } from '../components/actions/actions-editor.component';
import { NodeTypeComponent } from '../components/node-type/node-type.component';
import { Master1099Component } from '../components/master1099/master1099.component';

import {EditorModule} from 'primeng/editor';
//import { DefaultMessagesComponent } from '../components/default-messages/default-messages.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChargesComponent } from '../components/charges/charges.component';
//import { TaxTypeComponent } from '../components/tax-type/tax-type.component';
import { DefaultMessageComponent } from '../components/default-message/default-message.component';
import { TaxTypeComponent } from "../components/tax-type/tax-type.component";
import { ConditionsComponent } from "../components/conditions/conditions.component";


import { InputSwitchModule } from 'primeng/inputswitch';
import { BreadcrumbModule } from 'primeng/breadcrumb'; //bread crumb
import { SingleScreenBreadcrumbService } from "../services/single-screens-breadcrumb.service";
import { WarehouseComponent } from "../components/warehouse/warehouse.component";
import { ManufacturerComponent } from "../components/manufacturer/manufacturer.component";
import { VendorcapabilitiesComponent } from "../components/vendorcapabilities/vendorcapabilities.component";
//import { VendorcapabilitiesComponent } from "../components/vendor-capabilities/vendor-capabilities.component";
import { LocationComponent } from "../components/location/location.component";
import { LaberAndOverheadCostSetupComponent } from "../components/laber-and-overhead-cost-setup/laber-and-overhead-cost-setup.component";
import { ShelfComponent } from "../components/shelf/shelf.component";
import { ShipviaComponent } from "../components/shipvia/shipvia.component";
import { BinComponent } from '../components/bin/bin.component';
import { TreeTableModule } from 'primeng/treetable'; //for site,warehouse,location,shelf,bin
import { CheckboxModule } from 'primeng/checkbox'; //for site,warehouse,location,shelf,bin
import { TreeModule } from 'primeng/tree';
import { DialogModule } from "primeng/dialog";
import { CertificationTypeComponent } from "../components/certification-type/certification-type.component";
import { AssetStatusComponent } from "../components/AssetStatus/asset-status.component";
import { AssetStatusService } from "../services/asset-status/asset-status.service";
import { AssetStatusEndpointService } from "../services/asset-status/assetstatus-endpoint.service";
import { AssetLocationComponent } from "../components/asset-location/asset-location.component";
import { AssetLocationService } from "../services/asset-location/asset-location.service";
import { AssetLocationEndpointService } from "../services/asset-location/asset-location-endpoint.service";
import { AssetAcquisitionTypeComponent } from "../components/asset-acquisition-type/asset-acquisition-type.component";
import { AssetAcquisitionTypeService } from "../services/asset-acquisition-type/asset-acquisition-type.service";
import { AssetAcquisitionTypeEndpointService } from "../services/asset-acquisition-type/asset-acquisition-type-endpoint.service";
import { DepriciationMethodComponent } from "../components/depriciation-method/depriciation-method.component";
import { DepriciationMethodService } from "../services/depriciation-method/depriciation.service";
import { DepriciationMethodEndpointService } from "../services/depriciation-method/depriciationmethod-endpoint.service";
import { DisposalTypeEndpointService } from "../services/disposal-type/disposaltype-endpoint.service";
import { DisposalTypeService } from "../services/disposal-type/disposaltype.service";
import { DisposalTypeComponent } from "../components/disposal-type/disposal-type.component";
import { AssetDepConventionTypeComponent } from "../components/Asset-dep-convention-type/asset-dep-convention-type.component";
import { DepreciationIntervalsService } from "../services/Depreciation -intervals/depreciation-intervals.service ";
import { DepreciationIntervalsEndpoint } from "../services/Depreciation -intervals/depreciation-intervals-endpoint.service";
import { AssetDepConventionTypeService } from "../services/assetDepConventionType/assetDepConventionType.service";
import { AssetDepConventionTypeEndpointService } from "../services/assetDepConventionType/assetDepConventionType-endpoint.service";
import { DepreciationIntervalsComponent } from "../components/depreciation-intervals/depreciation-intervals.component";
import { AssetTypeEndpointService } from "../services/asset-type/asset-type-endpoint.service";
import { AssetTypeService } from "../services/asset-type/asset-type.service";
import { AssetTypeComponent } from "../components/asset-type/asset-type.component";
import { AssetIntangibleTypeEndpointService } from "../services/asset-intangible-type/asset-intangible-type-endpoint.service";
import { AssetIntangibleTypeService } from "../services/asset-intangible-type/asset-intangible-type.service";
import { AssetIntangibleTypeComponent } from "../components/asset-intangible-type/asset-intangible-type.component";
import { AssetIntangibleAttributeTypeEndpointService } from "../services/asset-intangible-attribute-type/asset-intangible-attribute-type-endpoint.service";
import { AssetIntangibleAttributeTypeService } from "../services/asset-intangible-attribute-type/asset-intangible-attribute-type.service";
import { AssetIntangibleAttributeTypeComponent } from "../components/asset-intangible-attribute-type/asset-intangible-attribute-type.component";

import { StageCodeComponent } from "../components/stage-code/stage-code.component";
import { GLAccountCategoryComponent } from "../components/gl-account-category/gl-account-category.component";
import { GLAccountCategoryEndpointService } from "../services/gl-account-category/gl-account-category-endpoint.service";
import { GLAccountCategoryService } from "../services/gl-account-category/gl-account-category.service";
import { ExpenditureCategoryComponent } from '../components/expenditure-category/expenditure-category.component';
import { ExpenditureCategoryEndpointService } from "../services/expenditure-category/expenditure-category-endpoint.service";
import { ExpenditureCategoryService } from "../services/expenditure-category/expenditure-category.service";
import { AssetAttributeTypeComponent } from '../components/asset-attribute-type/asset-attribute-type.component';
import { AssetAttributeTypeEndpointService } from "../services/asset-attribute-type/asset-attribute-type-endpoint.service";
import { AssetAttributeTypeService } from "../services/asset-attribute-type/asset-attribute-type.service";
import { TagTypeComponent } from '../components/tag-type/tag-type.component';
import { AuditModule } from "../audit/audit.module";
import { AircraftManufacturerComponent } from "../components/aircraft-manufacturer/aircraft-manufacturer.component";
import { AircraftManufacturerService } from "../services/aircraft-manufacturer/aircraftManufacturer.service";
import { AircraftManufacturerEndpointService } from "../services/aircraft-manufacturer/aircraftManufacturer-endpoint.service";
import { AircraftModelService } from "../services/aircraft-model/aircraft-model.service";
import { AircraftModelEndpointService } from "../services/aircraft-model/aircraft-model-endpoint.service";
import { AircraftModelComponent } from "../components/aircraft-model/aircraft-model.component";
import { DashnumberComponent } from "../components/dashnumber/dashnumber.component";
import { DashNumberEndpointService } from "../services/dash-number/dash-number-endpoint.service";
import { DashNumberService } from "../services/dash-number/dash-number.service";
import { PaginatorModule } from 'primeng/paginator';
import { CreatePublicationComponent } from "../components/publication/create-publication/create-publication.component";
import { PaginationComponent } from "../shared/pagination/pagination/pagination.component";
import { PaginationService } from "../services/pagination/pagination.service";
import { TooltipModule } from "primeng/tooltip";
import { KeyFilterModule } from 'primeng/keyfilter';
import { PercentComponent } from "../components/percent/percent.component";
import { JobTypeComponent } from '../components/job-type/job-type.component';
import { PercentService } from "../services/percent.service";
import { PercentEndpoint } from "../services/percent-endpoint.service";
import { CommonService } from "../services/common.service";
import { VendorProcess1099Component } from "../components/vendor-process1099/vendor-process1099.component";
import { VendorProcess1099Service } from "../services/vendorprocess1099.service";
import { CapsReportComponent } from "../components/caps-report/caps-report.component";
import { AdjustmentReasonComponent } from "../components/adjustment-reason/adjustment-reason.component";
import { CapabilityTypeComponent } from "../components/capabilitytype/capability-type.component";
import { CapabilityTypeService } from "../services/capability-type.service";
import { StageCodeService } from "../services/work-order-stagecode.service";

import { PublicationTypeComponent } from '../components/publication-type/publication-type.component';

import { TeardownReasonComponent } from "../components/teardown-reason/teardown-reason.component";

import { DocumentTypeComponent } from '../components/document-type/document-type.component';

import { EmployeeTrainingTypeComponent } from "../components/employee-training-type/employee-training-type.component";




@NgModule({
    imports: [
        FlexLayoutModule,
        KeyFilterModule,
        FormsModule, ReactiveFormsModule,
        QuickAppProMaterialModule,
        TranslateModule,
        CommonModule,
        SinglePagesRoutingModule,
        TableModule,
        TooltipModule,
        ButtonModule,
        SelectButtonModule,
        InputTextModule,
        MultiSelectModule,
        AutoCompleteModule,
        EditorModule,
        InputSwitchModule,
        CheckboxModule, BreadcrumbModule, TreeTableModule, CheckboxModule, TreeModule, DialogModule,
        AuditModule, PaginatorModule
    ],
    declarations: [
        CreatePublicationComponent,
        SingleComponent,
        PercentComponent,
        TagTypeComponent,
        TeardownReasonComponent,
        ActionsComponent,
        LeadSourceComponent,
        TaskAttributesComponent,
        AtaMainComponent,
        CreditTermsComponent,
        CurrencyComponent,
        CustomerClassificationComponent,
        DocumentsComponent,
        EmployeeExpertiseComponent,
        FindingsComponent,
        AssetIntangibleTypeComponent,
        AssetIntangibleAttributeTypeComponent,
        AssetTypeComponent,
        StageCodeComponent,
        GLAccountCategoryComponent,
        ExpenditureCategoryComponent,
        AssetAttributeTypeComponent,
        IntegrationComponent,
        ItemClassificationComponent,
        ItemGroupComponent,
        JobTitleComponent,
        JobTypeComponent,
        PriorityComponent,
        DocumentTypeComponent,
        ProvisionComponent,
        PublicationComponent,
        ReasonComponent,
        TaxRateComponent,
        UnitOfMeasureComponent,
        VendorClassificationComponent,
        PublicationTypeComponent,
        WorkPerformedComponent,
        WorkScopeComponent,
        ActionsEditorComponent,
        DefaultMessageComponent,
        ChargesComponent,
        TaxTypeComponent,
        ConditionsComponent,
        ActionAttributeMappingComponent,
        AtaSubChapter1Component,
        AtaSubChapter2Component,
        SiteComponent,
        BinComponent,
        CapabilitiesComponent,
        FinancialStatementMappingComponent,
        GlAccountClassComponent,
        GlCashFlowClassificationComponent,
        NodeTypeComponent,
        Master1099Component,
        GlFinancialStatementComponent,
        JournalApprovalsComponent,
        RfqEngineComponent,
        WarehouseComponent,
        AdjustmentReasonComponent,
        GLAccountCategoryComponent,
        ManufacturerComponent,
        VendorcapabilitiesComponent,
        LocationComponent,
        LaberAndOverheadCostSetupComponent,
        ShelfComponent,
        ShipviaComponent,
        CertificationTypeComponent,
        AssetStatusComponent,
        AssetLocationComponent,
        AssetAcquisitionTypeComponent,
        DisposalTypeComponent,
        DepriciationMethodComponent,
        AssetDepConventionTypeComponent,
        DepreciationIntervalsComponent,
        AircraftManufacturerComponent,
        AircraftModelComponent,
        DashnumberComponent,
        PaginationComponent,
        VendorProcess1099Component,
        CapsReportComponent,
        CapabilityTypeComponent,
        EmployeeTrainingTypeComponent,
    ],
    providers: [
        PercentService,
        PercentEndpoint,
        SingleScreenBreadcrumbService,
        AssetStatusService,
        AssetStatusEndpointService,
        AssetStatusEndpointService,
        AssetLocationService,
        AssetLocationEndpointService,
        AssetAcquisitionTypeService,
        AssetAcquisitionTypeEndpointService,
        DepriciationMethodService,
        DepriciationMethodEndpointService,
        DisposalTypeEndpointService,
        DisposalTypeService,
        DepreciationIntervalsService,
        DepreciationIntervalsEndpoint,
        AssetDepConventionTypeService,
        AssetDepConventionTypeEndpointService,
        AssetTypeService,
        AssetTypeEndpointService,
        AssetIntangibleTypeService,
        AssetIntangibleTypeEndpointService,
       
        AssetIntangibleAttributeTypeService,
        AssetIntangibleAttributeTypeEndpointService,
        StageCodeService,
        GLAccountCategoryService,
        GLAccountCategoryEndpointService,
        ExpenditureCategoryService,
        ExpenditureCategoryEndpointService,
        AssetAttributeTypeService,
        AssetAttributeTypeEndpointService,
        AircraftManufacturerService,
        AircraftManufacturerEndpointService,
        AircraftModelService,
        AircraftModelEndpointService,
        DashNumberService,
        DashNumberEndpointService,
        PaginationService,
        CommonService,
        VendorProcess1099Service,
        CapabilityTypeService,
    ],
    exports: [
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        QuickAppProMaterialModule,
        TranslateModule
    ],
    entryComponents: [
    ],


})
export class SinglePgesModule {

}
