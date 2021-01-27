// ===============================
// info@ebenmonney.comss
// www.ebenmonney.com/quickapp-pro
// ===============================

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SingleComponent } from "./singlepages.component";
import { ActionsComponent } from "../components/actions/actions.component";
import { TaskAttributesComponent } from "../components/task-attributes/task-attributes.component";
import { AtaMainComponent } from "../components/ata-main/ata-main.component";
import { CreditTermsComponent } from "../components/credit-terms/credit-terms.component";
import { CurrencyComponent } from "../components/currency/currency.component";
import { CustomerClassificationComponent } from "../components/customer-classification/customer-classification.component";
import { DocumentsComponent } from "../components/documents/documents.component";
import { EmployeeExpertiseComponent } from "../components/employee-expertise/employee-expertise.component";
import { FindingsComponent } from "../components/findings/findings.component";
import { AssetIntangibleTypeComponent } from "../components/asset-intangible-type/asset-intangible-type.component";
import { AssetIntangibleAttributeTypeComponent } from "../components/asset-intangible-attribute-type/asset-intangible-attribute-type.component";
import { AssetTypeComponent } from "../components/asset-type/asset-type.component";
import { StageCodeComponent } from "../components/stage-code/stage-code.component";
import { GLAccountCategoryComponent } from "../components/gl-account-category/gl-account-category.component";
import { ExpenditureCategoryComponent } from "../components/expenditure-category/expenditure-category.component";
import { AssetAttributeTypeComponent } from "../components/asset-attribute-type/asset-attribute-type.component";
import { IntegrationComponent } from "../components/integration/integration.component";
import { ItemClassificationComponent } from "../components/item-classification/item-classification.component";
import { ItemGroupComponent } from "../components/item-group/item-group.component";
import { JobTitleComponent } from "../components/job-title/job-title.component";
import { PriorityComponent } from "../components/priority/priority.component";
import { ProvisionComponent } from "../components/provision/provision.component";
import { PublicationComponent } from "../components/publication/publication.component";
import { ReasonComponent } from "../components/reason/reason.component";
import { TaxRateComponent } from "../components/tax-rate/tax-rate.component";
import { UnitOfMeasureComponent } from "../components/unit-of-measure/unit-of-measure.component";
import { VendorClassificationComponent } from "../components/vendor-classification/vendor-classification.component";
import { WorkPerformedComponent } from "../components/work-performed/work-performed.component";
import { WorkScopeComponent } from "../components/work-scope/work-scope.component";
import { ActionAttributeMappingComponent } from "../components/action-attribute-mapping/action-attribute-mapping.component";
import { AtaSubChapter1Component } from "../components/ata-sub-chapter1/ata-sub-chapter1.component";
import { AtaSubChapter2Component } from "../components/ata-sub-chapter2/ata-sub-chapter2.component";
import { LocationComponent } from "../components/location/location.component";
import { ShelfComponent } from "../components/shelf/shelf.component";

import { ShipviaComponent } from "../components/shipvia/shipvia.component";
import { BinComponent } from "../components/bin/bin.component";
import { CapabilitiesComponent } from "../components/capabilities/capabilities.component";
import { FinancialStatementMappingComponent } from "../components/financial-statement-mapping/financial-statement-mapping.component";
import { GlAccountClassComponent } from "../components/gl-account-class/gl-account-class.component";
import { GlCashFlowClassificationComponent } from "../components/gl-cash-flow-classification/gl-cash-flow-classification.component";
import { GlFinancialStatementComponent } from "../components/gl-financial-statement/gl-financial-statement.component";
import { JournalApprovalsComponent } from "../components/journal-approvals/journal-approvals.component";
import { RfqEngineComponent } from "../components/rfq-engine/rfq-engine.component";
import { ActionsEditorComponent } from "../components/actions/actions-editor.component";
import { AuthService } from "../services/auth.service";
import { AuthGuard } from "../services/auth-guard.service";
import { ChargesComponent } from "../components/charges/charges.component";
import { DefaultMessageComponent } from "../components/default-message/default-message.component";
import { TaxTypeComponent } from "../components/tax-type/tax-type.component";
import { ConditionsComponent } from "../components/conditions/conditions.component";
import { AdjustmentReasonComponent } from "../components/adjustment-reason/adjustment-reason.component";
import { SiteComponent } from "../components/site/site.component";
import { WarehouseComponent } from "../components/warehouse/warehouse.component";
import { ManufacturerComponent } from "../components/manufacturer/manufacturer.component";
import { VendorcapabilitiesComponent } from "../components/vendorcapabilities/vendorcapabilities.component";
import { LaberAndOverheadCostSetupComponent } from "../components/laber-and-overhead-cost-setup/laber-and-overhead-cost-setup.component";
import { CertificationTypeComponent } from "../components/certification-type/certification-type.component";
import { AssetStatusComponent } from "../components/AssetStatus/asset-status.component";
import { AssetLocationComponent } from "../components/asset-location/asset-location.component";
import { AssetAcquisitionTypeComponent } from "../components/asset-acquisition-type/asset-acquisition-type.component";
import { DepriciationMethodComponent } from "../components/depriciation-method/depriciation-method.component";
import { DisposalTypeComponent } from "../components/disposal-type/disposal-type.component";
import { AssetDepConventionTypeComponent } from "../components/Asset-dep-convention-type/asset-dep-convention-type.component";
import { DepreciationIntervalsComponent } from "../components/depreciation-intervals/depreciation-intervals.component";
import { AircraftManufacturerComponent } from "../components/aircraft-manufacturer/aircraft-manufacturer.component";
import { AircraftModelComponent } from "../components/aircraft-model/aircraft-model.component";
import { DashnumberComponent } from "../components/dashnumber/dashnumber.component";
import { CreatePublicationComponent } from "../components/publication/create-publication/create-publication.component";
import { CalendarModule } from "primeng/calendar";
import { InputTextModule } from "primeng/inputtext";
import { FileUploadModule } from "primeng/fileupload";
import { CheckboxModule } from "primeng/checkbox";
import { PercentComponent } from "../components/percent/percent.component";
import { JobTypeComponent } from '../components/job-type/job-type.component';
import { VendorProcess1099Component } from "../components/vendor-process1099/vendor-process1099.component";
import { CapsReportComponent } from "../components/caps-report/caps-report.component";
import { StockAdjustmentComponent } from "../components/stockline/stock-adjustment/stock-adjustment.component";
import { CapabilityTypeComponent } from "../components/capabilitytype/capability-type.component";
import { LeadSourceComponent } from "../components/lead-source/lead-source.component";
import { TagTypeComponent } from "../components/tag-type/tag-type.component";
import { TeardownReasonComponent } from "../components/teardown-reason/teardown-reason.component";
import { PublicationTypeComponent } from "../components/publication-type/publication-type.component";
import { DocumentTypeComponent } from "../components/document-type/document-type.component";
import { NodeTypeComponent } from "../components/node-type/node-type.component";
import { EmployeeTrainingTypeComponent } from "../components/employee-training-type/employee-training-type.component";
import { Master1099Component } from "../components/master1099/master1099.component";


const singlePagesRoutes: Routes = [
    {
        path: "singlepages",
        component: SingleComponent,
        children: [
            {
                path: "asset-status",
                component: AssetStatusComponent,
                data: { title: "Asset Status" }
            },
            {
                path: "asset-location",
                component: AssetLocationComponent,
                data: { title: "Asset Location" }
            },
            {
                path: "acquisition-type",
                component: AssetAcquisitionTypeComponent,
                data: { title: "Asset Acquistion Type" }
            },
            {
                path: "app-tasks",
                component: ActionsComponent,
                data: { title: "Tasks" }
            },
            {
                path: "app-task-attributes",
                component: TaskAttributesComponent,
                data: { title: "Task Attributes" }
            },
            {
                path: "app-ata-main",
                component: AtaMainComponent,
                data: { title: "Ata Chapter" }
            },
            {
                path: "app-charges",
                component: ChargesComponent,
                data: { title: "Charges" }
            },
            {
                path: "app-conditions",
                component: ConditionsComponent,
                data: { title: "Conditions" }
            },
            {
                path: "app-credit-terms",
                component: CreditTermsComponent,
                data: { title: "Credit Terms" }
            },
            {
                path: "app-currency",
                component: CurrencyComponent,
                data: { title: "Currency" }
            },
            {
                path: "app-customer-classification",
                component: CustomerClassificationComponent,
                data: { title: "Customer Classification" }
            },

            {
                path: "app-documents",
                component: DocumentsComponent,
                data: { title: "Documents" }
            },
            {
                path: "app-employee-expertise",
                component: EmployeeExpertiseComponent,
                data: { title: "Employee Expertise" }
            },
            {
                path: "app-findings",
                component: FindingsComponent,
                data: { title: "Findings" }
            },
            {
                path: "app-asset-type",
                component: AssetTypeComponent,
                data: { title: "Asset Class" }
            },
            {
                path: "app-asset-intangible-class",
                component: AssetIntangibleTypeComponent,
                data: { title: "Asset Intangible Class" }
            },
            {
                path: "app-stage-code",
                component: StageCodeComponent,
                data: { title: "Stage Code" }
            },
            {
                path: "app-gl-account-category",
                component: GLAccountCategoryComponent,
                data: { title: "GL Account Category" }
            },
            {
                path: "app-expenditure-category",
                component: ExpenditureCategoryComponent,
                data: { title: "Expenditure Category" }
            },
            {
                path: "app-asset-attribute-type",
                component: AssetAttributeTypeComponent,
                data: { title: "Asset Attribute Type" }
            },
            {
                path: "app-asset-intangible-attribute-type",
                component: AssetIntangibleAttributeTypeComponent,
                data: { title: "Asset Intangible Attribute Type" }
            },
            {
                path: "app-integration",
                component: IntegrationComponent,
                data: { title: "Integration" }
            },
            {
                path: "app-item-classification",
                component: ItemClassificationComponent,
                data: { title: "Item Classification" }
            },
            {
                path: "app-item-group",
                component: ItemGroupComponent,
                data: { title: "Item Group" }
            },
            {
                path: "app-job-title",
                component: JobTitleComponent,
                data: { title: "Job Title" }
            },
            {
                path: "app-job-type",
                component: JobTypeComponent,
                data: { title: "Job Type" }
            },
            {
                path: "app-priority",
                component: PriorityComponent,
                data: { title: "Priority" }
            },
            {
                path: "app-provision",
                component: ProvisionComponent,
                data: { title: "Provision" }
            },
            {
                path: "app-publication",
                component: PublicationComponent,
                data: { title: "Publication" }
            },
            {
                path: "app-reason",
                component: ReasonComponent,
                data: { title: "Reason" }
            },
            {
                path: "app-tax-rate",
                component: TaxRateComponent,
                data: { title: "Tax Rate" }
            },
            {
                path: "app-unit-of-measure",
                component: UnitOfMeasureComponent,
                data: { title: "Unit of Measure" }
            },
            {
                path: "app-vendor-classification",
                component: VendorClassificationComponent,
                data: { title: "Vendor Classification" }
            },
            {
                path: "app-work-performed",
                component: WorkPerformedComponent,
                data: { title: "Work Performed" }
            },
            {
                path: "app-work-scope",
                component: WorkScopeComponent,
                data: { title: "Work Scope" }
            },
            {
                path: "edit-action",
                component: ActionsEditorComponent,
                data: { title: "Edit Action" }
            },
            {
                path: "app-defaultmessage",
                component: DefaultMessageComponent,
                data: { title: "Defualt message" }
            },
            {
                path: "app-tax-type",
                component: TaxTypeComponent,
                data: { title: "Tax type" }
            },
            {
                path: "app-action-attribute-mapping",
                component: ActionAttributeMappingComponent,
                data: { title: "Action Attribute Mapping" }
            },
            {
                path: "app-ata-sub-chapter1",
                component: AtaSubChapter1Component,
                data: { title: "Ata Sub Chapter" }
            },
            {
                path: "app-ata-sub-chapter2",
                component: AtaSubChapter2Component,
                data: { title: "Ata Sub Chapter 2" }
            },
            { path: "app-site", component: SiteComponent, data: { title: "Site" } },
            {
                path: "app-location",
                component: LocationComponent,
                data: { title: "Location" }
            },
            {
                path: "app-shelf",
                component: ShelfComponent,
                data: { title: "Shelf" }
            },
            {
                path: "app-shipvia",
                component: ShipviaComponent,
                data: { title: "Ship Via" }
            },
            { path: "app-bin", component: BinComponent, data: { title: "Bin" } },
            {
                path: "app-capabilities",
                component: CapabilitiesComponent,
                data: { title: "Capabilities" }
            },
            {
                path: "app-financial-statement-mapping",
                component: FinancialStatementMappingComponent,
                data: { title: "Financial Statement Mapping" }
            },
            {
                path: "app-gl-account-class",
                component: GlAccountClassComponent,
                data: { title: "Gl Account Class" }
            },
            {
                path: "app-gl-cash-flow-classification",
                component: GlCashFlowClassificationComponent,
                data: { title: "Gl CashFlow Classification" }
            },
            {
                path: "app-node-type",
                component: NodeTypeComponent,
                data: { title: "Node Type" }
            },
            {
                path: "app-master-1099",
                component: Master1099Component,
                data: { title: "Master 1099" }
            },
            {
                path: "app-gl-financial-statement",
                component: GlFinancialStatementComponent,
                data: { title: "GL Financial Statement" }
            },
            {
                path: "app-journal-approvals",
                component: JournalApprovalsComponent,
                data: { title: "Journal Approvals" }
            },
            {
                path: "app-rfq-engine",
                component: RfqEngineComponent,
                data: { title: "RFQ Engine" }
            },
            {
                path: "app-warehouse",
                component: WarehouseComponent,
                data: { title: "Ware House" }
            },
            {
                path: "app-manufacturer",
                component: ManufacturerComponent,
                data: { title: "Manufacturer" }
            },
            {
                path: "app-vendorcapabilities",
                component: VendorcapabilitiesComponent,
                data: { title: "Vendor Setup" }
            },
            {
                path: "app-labor-and-overhead-cost-setup",
                component: LaberAndOverheadCostSetupComponent,
                data: { title: "Labor And Overhead Cost SetUp" }
            },
            {
                path: "app-certification-type",
                component: CertificationTypeComponent,
                data: { title: "Certification Type" }
            },
            {
                path: "app-depriciation-method",
                component: DepriciationMethodComponent,
                data: { title: "Depreciation Method" }
            },
            {
                path: "app-adjustment-reason",
                component: AdjustmentReasonComponent,
                data: { title: "Adjustment Reason" }
            },
            {
                path: "app-disposal-type",
                component: DisposalTypeComponent,
                data: { title: "Asset Disposal Type" }
            },
            {
                path: "app-asset-dep-convention-type",
                component: AssetDepConventionTypeComponent,
                data: { title: "Depreciation Convention" }
            },
            {
                path: "app-depreciation-intervals",
                component: DepreciationIntervalsComponent,
                data: { title: "Depreciation Intervals" }
            },
            {
                path: "app-aircraft-manufacturer",
                component: AircraftManufacturerComponent,
                data: { title: "Aircraft Manufacturer" }
            },
            {
                path: "app-aircraft-model",
                component: AircraftModelComponent,
                data: { title: "Aircraft Model" }
            },
            {
                path: "app-dashnumber",
                component: DashnumberComponent,
                data: { title: "Dash Numbers" }
            },
            {
                path: "app-percent",
                component: PercentComponent,
                data: { title: "Percent" }

            },
            {
                path: "app-create-publication",
                component: CreatePublicationComponent,
                data: { title: "create publication" }
            },
            {
                path: "app-publication/edit/:id",
                component: CreatePublicationComponent,
                data: { title: "Edit publication" }
            },
            {
                path: "app-vendor-process1099",
                component: VendorProcess1099Component,
                data: { title: "Vendor Process1099" }
            },
            {
                path: "app-caps-report",
                component: CapsReportComponent,
                data: { title: "Caps Report" }
            },
            {
                path: "app-capability-type",
                component: CapabilityTypeComponent,
                data: { title: "Capability Type" }
            },
            {
                path: "app-lead-source",
                component: LeadSourceComponent,
                data: { title: "Lead Source Setup" }
            },
            {
                path: "app-tag-type",
                component: TagTypeComponent,
                data: { title: "Tag Type Setup" }
            },
            {

                path: "app-publication-type",
                component: PublicationTypeComponent,
                data: { title: "Publication Type" }
            },
            {
                path: "app-document-type",
                component: DocumentTypeComponent,
                data: { title: "Document Type Setup" }
            },
            {
                path: "app-teardown-reason",
                component: TeardownReasonComponent,
                data: { title: "Tear down Reason Setup" }
            },
            {
                path: "app-employee-training-type",
                component: EmployeeTrainingTypeComponent,
                data: { title: "Employee Training Type" }
            },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(singlePagesRoutes)],
    exports: [
        RouterModule,
        CalendarModule,
        InputTextModule,
        FileUploadModule,
        CheckboxModule
    ],
    providers: [AuthService, AuthGuard]
})
export class SinglePagesRoutingModule { }

