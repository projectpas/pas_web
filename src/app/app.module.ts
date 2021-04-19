import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ToastyModule } from 'ng2-toasty';
import { ChartsModule } from 'ng2-charts';
import { NgxCarouselModule } from 'ngx-carousel';
import { AppRoutingModule } from './app-routing.module';
import { AppErrorHandler } from './app-error.handler';
import { DropdownModule } from 'primeng/dropdown';
import { MegaMenuModule } from 'primeng/megamenu';
import { Globals } from './globals';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { SettingsModule } from './settings/settings.module';
import { FooterModule } from './shared/footer.component';
import { ThemePickerModule } from './shared/theme-picker.component';
import { AppTitleService } from './services/app-title.service';
import {
  AppTranslationService,
  TranslateLanguageLoader,
} from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { AlertService } from './services/alert.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { EndpointFactory } from './services/endpoint-factory.service';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';
import { WorkFlowtService } from './services/workflow.service';
import { WorkFlowEndpoint } from './services/workflow-endpoint.service';
import { ActionService } from './services/action.service';
import { ActionEndpoint } from './services/action-endpoint.service';
import { AtaMainService } from './services/atamain.service';
import { ATAMainEndpoint } from './services/atamain-endpoint.service';
import { AtaSubChapter1Service } from './services/atasubchapter1.service';
import { ATASubChapter1Endpoint } from './services/atasubchapter1-endpoint.service';
import { AtaSubChapter2Service } from './services/atasubchapter2.service';
import { ATASubChapter2Endpoint } from './services/atasubchapter2-endpoint.service';
import { SiteService } from './services/site.service';
import { SiteEndpoint } from './services/site-endpoint.service';
import { BinService } from './services/bin.service';
import { BinEndpoint } from './services/bin-endpoint.service';
import { CurrencyService } from './services/currency.service';
import { CurrencyEndpoint } from './services/currency-endpoint.service';
import { ConditionService } from './services/condition.service';
import { ConditionEndpoint } from './services/condition-endpoint.service';
import { FindingService } from './services/finding.service';
import { FindingEndpoint } from './services/finding-endpoint.service';
import { TaxRateService } from './services/taxrate.service';
import { TaxRateEndpointService } from './services/taxrate-endpoint.service';
import { VendorClassificationService } from './services/vendorclassification.service';
import { VendorClassificationEndpoint } from './services/vendorclassification-endpoint.service';
import { WorkPerformedService } from './services/workperformed.service';
import { WorkPerformedEndpointService } from './services/workperformed-endpoint.service';
import { MasterCompanyEndpoint } from './services/mastercompany-endpoint.service';
import { MasterComapnyService } from './services/mastercompany.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { LoginControlComponent } from './components/login/login-control.component';
import { LoginDialogComponent } from './components/login/login-dialog.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { OrdersComponent } from './components/orders/orders.component';
import { RmaComponent } from './components/receiving/rma/rma.component';
import { SalesOrderComponent } from './components/receiving/sales-order/sales-order.component';
import { ShippingComponent } from './components/receiving/shipping/shipping.component';
import { LicTypeComponent } from './components/lic-type/lic-type.component';
import { OwnerComponent } from './components/owner/owner.component';
import { PlatformComponent } from './components/platform/platform.component';
import { SupervisorComponent } from './components/supervisor/supervisor.component';
import { AboutComponent } from './components/about/about.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BannerDemoComponent } from './components/controls/banner-demo.component';
import { TodoDemoComponent } from './components/controls/todo-demo.component';
import { StatisticsDemoComponent } from './components/controls/statistics-demo.component';
import { NotificationsViewerComponent } from './components/controls/notifications-viewer.component';
import { AddTaskDialogComponent } from './components/controls/add-task-dialog.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreditTermsService } from './services/Credit Terms.service';
import { CreditTermsEndpoint } from './services/Credit Terms-endpoint.service';
import { CustomerClassificationEndpoint } from './services/Customer Classification -endpoint.service';
import { CustomerClassificationService } from './services/CustomerClassification.service';
import { TaskAttributeEndpointService } from './services/taskattribute-endpoint';
import { TaskAttributeService } from './services/taskattribute.service';
import { AssetIntangibleTypeEndpointService } from './services/asset-intangible-type/asset-intangible-type-endpoint.service';
import { AssetIntangibleTypeService } from './services/asset-intangible-type/asset-intangible-type.service';
import { AssetTypeEndpointService } from './services/asset-type/asset-type-endpoint.service';
import { AssetTypeService } from './services/asset-type/asset-type.service';
import { GLAccountCategoryEndpointService } from './services/gl-account-category/gl-account-category-endpoint.service';
import { GLAccountCategoryService } from './services/gl-account-category/gl-account-category.service';
import { ExpenditureCategoryEndpointService } from './services/expenditure-category/expenditure-category-endpoint.service';
import { ExpenditureCategoryService } from './services/expenditure-category/expenditure-category.service';
import { IntegrationService } from './services/integration-service';
import { IntegrationEndpointService } from './services/integration.endpoint-service';
import { PriorityService } from './services/priority.service';
import { PriorityEndpointService } from './services/priority-endpoint.service';
import { ItemClassificationService } from './services/item-classfication.service';
import { ItemClassificationEndpointService } from './services/item-classification-endpoint.service';
import { ItemGroupService } from './services/item-group.service';
import { ItemgroupEndpointService } from './services/item-group-endpoint.service';
import { ProvisionService } from './services/provision.service';
import { ProvisionEndpoint } from './services/provision-endpoint.service';
import { ReasonService } from './services/reason.service';
import { ReasonEndpoint } from './services/reason-endpoint.service';
import { PublicationEndpointService } from './services/publication-endpoint.service';
import { PublicationService } from './services/publication.service';
import { UnitOfMeasureService } from './services/unitofmeasure.service';
import { UnitOfMeasureEndpoint } from './services/unitofmeasure-endpoint.service';
import { WorkScopeService } from './services/workscope.service';
import { WorkScopeEndpointService } from './services/workscope-endpoint.service';
import { EmployeeExpertiseService } from './services/employeeexpertise.service';
import { EmployeeExpertiseEndpointService } from './services/employeeexpertise-endpoint.service';
import { DefaultMessageEndpoint } from './services/defaultmessage-endpoint.service';
import { DefaultMessageService } from './services/defaultmessage.service';
import { DocumentEndpointService } from './services/document-endpoint.service';
import { DocumentService } from './services/document.service';
import { JobTitleService } from './services/job-title.service';
import { JobTitleEndpontService } from './services/job-title-endpoint.service';
import { CustomerService } from './services/customer.service';

import { CrmService } from './services/crm.service';

import { CustomerEndpoint } from './services/customer-endpoint.service';
import { CrmEndpoint } from './services/crm-endpoint.service';
import { TaxTypeService } from './services/taxtype.service';
import { TaxTypeEndpointService } from './services/taxtype-endpoint.service';
import { ModalService } from '../app/services/model.service';
import { ChargeService } from './services/charge.service';
import { ChargeEndpoint } from './services/charge-endpoint.service';
import { VendorService } from './services/vendor.service';
import { VendorEndpointService } from './services/vendor-endpoint.service';
import { EmployeeService } from './services/employee.service';
import { EmployeeEndpoint } from './services/employee-endpoint.service';
import { ItemMasterService } from './services/itemMaster.service';
import { ItemMasterEndpoint } from './services/itemMaster-endpoint.service';
import { StocklineService } from './services/stockline.service';
import { StocklineEndpoint } from './services/stockline-endpoint.service';
import { StocklineAdjustmentReasonEndpoint } from './services/stocklineadjustment-endpoint.service';
import { StocklineAdjustReasonService } from './services/stockLineAdjustmentReason.service';
import { ReceivingCustomerWorkService } from './services/receivingcustomerwork.service';
import { ReceivingCustomerWorkEndpoint } from './services/receivingcustomerWork-endpoint.service';
import { LegalEntityService } from './services/legalentity.service';
import { LegalEntityEndpontService } from './services/legalentity-endpoint.service';
import { GLAccountClassService } from './services/glaccountclass.service';
import { GLAccountClassEndpoint } from './services/glaccountclass-endpoint.service';
import { WarehouseService } from './services/warehouse.service';
import { WarehouseEndpoint } from './services/warehouse-endpoint.service';
import { SingleScreenBreadcrumbService } from './services/single-screens-breadcrumb.service';
import { AuthService } from './services/auth.service';
import { GlCashFlowClassificationEndpoint } from './services/gl-cash-flow-classification-endpoint.service';
import { GlCashFlowClassificationService } from './services/gl-cash-flow-classification.service';
import { ManufacturerService } from './services/manufacturer.service';
import { ManufacturerEndpoint } from './services/manufacturer-endpoint.service';
import { VendorCapabilitiesService } from './services/vendorcapabilities.service';
import { VendorCapabilitiesEndpoint } from './services/vendorcapabilities-endpoint.service';
import { LocationService } from './services/location.service';
import { LocationEndpoint } from './services/location-endpoint.service';
import { laborAndOverheadCostEndpointservice } from './services/laborandoverheadcost-endpoint.service';
import { LaborAndOverheadCostService } from './services/laborandoverheadcost.service';
import { ShelfService } from './services/shelf.service';
import { ShelfEndpoint } from './services/shelf-endpoint.service';
import { MessageService } from 'primeng/api';
import { RolesManagementStructureService } from './services/roles-management-structure.service';
import { RolesManagementStructureEndpoint } from './services/roles-management-structure-endpoint.service';
import { CertificationTypeEndpoint } from './services/certificationtype.endpoint.service';
import { CertificationtypeService } from './services/certificationtype.service';
import { AssetStatusService } from './services/asset-status/asset-status.service';
import { AssetStatusEndpointService } from './services/asset-status/assetstatus-endpoint.service';
import { DepriciationMethodService } from './services/depriciation-method/depriciation.service';
import { DepriciationMethodEndpointService } from './services/depriciation-method/depriciationmethod-endpoint.service';
import { DisposalTypeService } from './services/disposal-type/disposaltype.service';
import { DisposalTypeEndpointService } from './services/disposal-type/disposaltype-endpoint.service';
import { DepreciationIntervalsEndpoint } from './services/Depreciation -intervals/depreciation-intervals-endpoint.service';
import { DepreciationIntervalsService } from './services/Depreciation -intervals/depreciation-intervals.service ';
import { AssetDepConventionTypeEndpointService } from './services/assetDepConventionType/assetDepConventionType-endpoint.service';
import { AssetDepConventionTypeService } from './services/assetDepConventionType/assetDepConventionType.service';
import { GlAccountService } from './services/glAccount/glAccount.service';
import { GlAccountEndpointService } from './services/glAccount/glAccount-endpoint.service';
import { AccountCalenderService } from './services/account-calender/accountcalender.service';
import { AccountCalenderEndpointService } from './services/account-calender/accountcalender-endpoint.service';
import { ActionsButtonsComponent } from './components/ActionButtons/actions-buttons.component';
import { InterCompanySetupService } from './services/intercompany-setup-service';
import { InterCompanySetupEndPointService } from './services/intercompany-setup-endpoint.service';
import { UserRoleEndPointService } from './components/user-role/user-role-endpoint.service';
import { UserRoleService } from './components/user-role/user-role-service';
import { RolesGuardService } from './services/roles-guard.service';
import { CompanyService } from './services/company.service';
import { CompanyEndpoint } from './services/company-endpoint.service';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { CardModule } from 'primeng/card';
import { PanelMenuModule } from 'primeng/panelmenu';
import { WorkOrderService } from './services/work-order/work-order.service';
import { WorkOrderQuoteService } from './services/work-order/work-order-quote.service';
import { WorkOrderEndpointService } from './services/work-order/work-order-endpoint.service';
import { JobTypeService } from './services/job-type.service';
import { JobTypeEndpontService } from './services/job-type-endpoint.service';
import { PercentEndpoint } from './services/percent-endpoint.service';
import { PercentService } from './services/percent.service';
import { PurchaseOrderService } from './services/purchase-order.service';
import { PurchaseOrderEndpoint } from './services/purchase-order-endpoint.service';
import { RepairOrderService } from './services/repair-order.service';
import { RepairOrderEndpoint } from './services/repair-order-endpoint.service';
import { GLAccountService } from './services/glAccount.service';
import { GLAccountEndpoint } from './services/glAccount-endpoint.service';
import { AssetAttributeTypeService } from './services/asset-attribute-type/asset-attribute-type.service';
import { AssetLocationService } from './services/asset-location/asset-location.service';
import { AssetAttributeTypeEndpointService } from './services/asset-attribute-type/asset-attribute-type-endpoint.service';
import { AssetLocationEndpointService } from './services/asset-location/asset-location-endpoint.service';
import { AssetIntangibleAttributeTypeService } from './services/asset-intangible-attribute-type/asset-intangible-attribute-type.service';
import { AssetIntangibleAttributeTypeEndpointService } from './services/asset-intangible-attribute-type/asset-intangible-attribute-type-endpoint.service';
import { DashNumberService } from './services/dash-number/dash-number.service';
import { DashNumberEndpointService } from './services/dash-number/dash-number-endpoint.service';
import { AircraftManufacturerEndpointService } from './services/aircraft-manufacturer/aircraftManufacturer-endpoint.service';
import { AircraftManufacturerService } from './services/aircraft-manufacturer/aircraftManufacturer.service';
import { AircraftModelEndpointService } from './services/aircraft-model/aircraft-model-endpoint.service';
import { AircraftModelService } from './services/aircraft-model/aircraft-model.service';
import { AccountListingService } from './services/account-listing/account-listing.service';
import { CustomerViewComponent } from './shared/components/customer/customer-view/customer-view.component';
import { StocklineViewComponent } from './shared/components/stockline/stockline-view/stockline-view.component';
import { StocklineHistoryComponent } from './shared/components/stockline/stockline-history/stockline-history.component';
import { CommonService } from './services/common.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { StageCodeService } from './services/work-order-stagecode.service';
import { RefreshAlert } from './directive/refreshalert.directive';
import { LeadSourceService } from './services/lead-source.service';
import { LeadSourceEndpointService } from './services/lead-source-endpoint.service';
import { CustomerPagesModule } from './customerpages/customerpages.module';
import { ChangeButtonStatus } from './directive/changebutton.directive';

import { AssetAcquisitionTypeService } from './services/asset-acquisition-type/asset-acquisition-type.service';
import { AssetAcquisitionTypeEndpointService } from './services/asset-acquisition-type/asset-acquisition-type-endpoint.service';
import { TagTypeService } from './services/tag-type.service';
import { TagTypeEndpointService } from './services/tag-type-endpoint.service';
import { publicationTypeService } from './services/publication-type.service';
import { publicationTypeEndpointService } from './services/publication-type-endpoint.service';

import { DocumentTypeService } from './services/document-type.service';
import { DocumentTypeEndpointService } from './services/document-type-endpoint.service';
import { WorkOrderSettingsService } from './services/work-order-settings.service';
import { WorkOrderSettingsEndpointService } from './services/work-order-settings-endpoint.service';
import { TeardownReasonEndpointService } from './services/teardown-reason-endpoint.service';
import { TeardownReasonService } from './services/teardown-reason.service';
import { ShipViaService } from './services/shipVia.service';
import { ShipViaEndpoint } from './services/shipVia-endpoint.service';

import { EmployeeTrainingTypeService } from './services/employee-training-type.service';
import { EmployeeTrainingTypeEndpointService } from './services/employee-training-type-endpoint.service';
import { SalesOrderService } from './services/salesorder.service';
import { SalesOrderEndpointService } from './services/salesorder-endpoint.service';
import { SalesOrderReferenceStorage } from './components/sales/shared/sales-order-reference-storage';

import { EntityViewComponent } from './shared/components/legalEntity/entity-view/entity-view.component';

import { NodeTypeEndpoint } from './services/node-type-endpoint.service';
import { NodeTypeService } from './services/node-Type.service';

import { Master1099Endpoint } from './services/master-1099-endpoint.services';
import { Master1099Service } from './services/master-1099.service';

import { AppSharedModule } from './app-shared.module';
import { StocklineReferenceStorage } from './components/stockline/shared/stockline-reference-storage';
import { CommunicationService } from './shared/services/communication.service';

import { TabViewModule } from 'primeng/tabview';
import { UnauthorizedAccessComponent } from './unauthorizedaccess/unauthorized-access.component';
import { CommonDocumentsModule } from "./components/common-components/common-documents/common-documents.module";
import{AssetInventoryViewComponent} from "./components/Asset-Management/asset-inventory-view/asset-inventory-view.component"
import { CalendarModule } from "primeng/calendar";
import { SafePipe } from './pipes/safe.pipe';
import { AuditComponentComponent } from './shared/components/audit-component/audit-component.component';
import { UpdatepasswordComponent } from './components/updatepassword/updatepassword.component';
import { InvoicePaymentService } from './services/invoice-payment-service';
import { InvoicePaymentEndpointService } from './services/invoice-payment.endpoint-service';
@NgModule({
  imports: [
    CardModule,
    PanelMenuModule,
    SharedModule,
    FooterModule,
    ThemePickerModule,
    HttpClientModule,
    AdminModule,
    SettingsModule,
    AppRoutingModule,
    CommonModule,
    TableModule,
    DropdownModule,
    MegaMenuModule,
    CustomerPagesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateLanguageLoader,
      },
    }),
    ToastyModule.forRoot(),
    ChartsModule,
    AppSharedModule,
    NgbModule,
    TabViewModule,
    CommonDocumentsModule,
    CalendarModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    LoginControlComponent,
    LoginDialogComponent,
    HomeComponent,
    ProductsComponent,
    OrdersComponent,
    AboutComponent,
    RmaComponent,
    SalesOrderComponent,
    ShippingComponent,
    LicTypeComponent,
    OwnerComponent,
    PlatformComponent,
    SupervisorComponent,
    NotFoundComponent,
    NotificationsViewerComponent,
    AddTaskDialogComponent,
    StatisticsDemoComponent,
    TodoDemoComponent,
    BannerDemoComponent,
    ActionsButtonsComponent,
    UnauthorizedAccessComponent,
    LoginComponent,
    CustomerViewComponent,
    EntityViewComponent,
    StocklineViewComponent,
    StocklineHistoryComponent,
    RefreshAlert, 
    UpdatepasswordComponent,
    AssetInventoryViewComponent,
    SafePipe,
    AuditComponentComponent
  ],
  providers: [
    { provide: 'BASE_URL', useFactory: getBaseUrl },
    { provide: ErrorHandler, useClass: AppErrorHandler },
    AlertService,
    ConfigurationService,
    AppTitleService,
    AssetAttributeTypeService,
    AssetAttributeTypeEndpointService,
    publicationTypeService,
    publicationTypeEndpointService,
    AssetLocationService,
    AssetLocationEndpointService,
    AssetIntangibleAttributeTypeService,
    AssetIntangibleAttributeTypeEndpointService,
    AppTranslationService,
    NotificationService,
    NotificationEndpoint,
    AssetAcquisitionTypeService,
    AssetAcquisitionTypeEndpointService,
    AccountService,
    AccountEndpoint,
    DecimalPipe ,
    DashNumberService,
    DashNumberEndpointService,
    AircraftManufacturerService,
    AircraftManufacturerEndpointService,
    AircraftModelService,
    AircraftModelEndpointService,
    LocalStoreManager,
    EndpointFactory,
    WorkFlowtService,
    WorkFlowEndpoint,
    ActionService,
    ActionEndpoint,
    AtaMainService,
    ATAMainEndpoint,
    AtaSubChapter1Service,
    ATASubChapter1Endpoint,
    AtaSubChapter2Service,
    ATASubChapter2Endpoint,
    SiteService,
    SiteEndpoint,
    WarehouseService,
    WarehouseEndpoint,
    BinService,
    BinEndpoint,
    NgbActiveModal,
    MasterCompanyEndpoint,
    MasterComapnyService,
    CurrencyService,
    CurrencyEndpoint,
    ConditionEndpoint,
    ConditionService,
    CreditTermsService,
    CreditTermsEndpoint,
    FindingService,
    FindingEndpoint,
    CustomerClassificationEndpoint,
    CustomerClassificationService,
    ProvisionEndpoint,
    ProvisionService,
    ReasonEndpoint,
    ReasonService,
    TaskAttributeService,
    TaskAttributeEndpointService,
    AssetIntangibleTypeEndpointService,
    AssetIntangibleTypeService,
    AssetTypeEndpointService,
    AssetTypeService,
    GLAccountCategoryService,
    GLAccountCategoryEndpointService,
    ExpenditureCategoryService,
    ExpenditureCategoryEndpointService,
    IntegrationService,
    IntegrationEndpointService,
    PriorityService,
    PriorityEndpointService,
    ItemClassificationService,
    ItemClassificationEndpointService,
    ItemGroupService,
    ItemgroupEndpointService,
    LeadSourceService,
    LeadSourceEndpointService,
    TaxRateService,
    ManufacturerService,
    ManufacturerEndpoint,
    TaxRateEndpointService,
    VendorClassificationService,
    VendorClassificationEndpoint,
    WorkPerformedService,
    WorkPerformedEndpointService,
    PublicationService,
    PublicationEndpointService,
    UnitOfMeasureService,
    UnitOfMeasureEndpoint,
    WorkScopeService,
    WorkScopeEndpointService,
    EmployeeExpertiseService,
    EmployeeExpertiseEndpointService,
    DefaultMessageEndpoint,
    DefaultMessageService,
    DocumentService,
    DocumentEndpointService,
    JobTitleService,
    JobTitleEndpontService,
    CustomerService,
    CrmService,
    CustomerEndpoint,
    CrmEndpoint,
    TaxTypeService,
    TaxTypeEndpointService,
    TagTypeService,
    TagTypeEndpointService,
    ChargeService,
    ChargeEndpoint,
    ModalService,
    Globals,
    GLAccountClassEndpoint,
    GLAccountClassService,
    VendorService,
    VendorEndpointService,
    EmployeeService,
    EmployeeEndpoint,
    ItemMasterEndpoint,
    ItemMasterService,
    StocklineService,
    StocklineEndpoint,
    StocklineAdjustReasonService,
    StocklineAdjustmentReasonEndpoint,
    ReceivingCustomerWorkService,
    ReceivingCustomerWorkEndpoint,
    LegalEntityService,
    LegalEntityEndpontService,
    AuthService,
    DocumentTypeService,
    DocumentTypeEndpointService,
    SingleScreenBreadcrumbService,
    GlCashFlowClassificationService,
    GlCashFlowClassificationEndpoint,
    NodeTypeService,
    NodeTypeEndpoint,
    Master1099Service,
    Master1099Endpoint,
    VendorCapabilitiesService,
    VendorCapabilitiesEndpoint,
    LocationService,
    LocationEndpoint,
    laborAndOverheadCostEndpointservice,
    LaborAndOverheadCostService,
    ShelfService,
    ShelfEndpoint,
    MessageService,
    RolesManagementStructureService,
    RolesManagementStructureEndpoint,
    CertificationTypeEndpoint,
    CertificationtypeService,
    AssetStatusService,
    AssetStatusEndpointService,
    AssetIntangibleTypeService,
    DepriciationMethodService,
    DepriciationMethodEndpointService,
    DisposalTypeService,
    DisposalTypeEndpointService,
    DepreciationIntervalsEndpoint,
    DepreciationIntervalsService,
    AssetDepConventionTypeEndpointService,
    AssetDepConventionTypeService,
    GlAccountService,
    GlAccountEndpointService,
    AccountCalenderService,
    AccountCalenderEndpointService,
    InterCompanySetupService,
    InterCompanySetupEndPointService,
    UserRoleEndPointService,
    UserRoleService,
    RolesGuardService,
    TeardownReasonEndpointService,
    TeardownReasonService,
    CompanyService,
    CompanyEndpoint,
    WorkOrderService,
    WorkOrderQuoteService,
    WorkOrderEndpointService,
    JobTypeService,
    JobTypeEndpontService,
    PercentService,
    PercentEndpoint,
    PurchaseOrderService,
    PurchaseOrderEndpoint,
    RepairOrderService,
    RepairOrderEndpoint,
    GLAccountService,
    GLAccountEndpoint,
    AccountListingService,
    CommonService,
    StageCodeService,
    WorkOrderSettingsService,
    WorkOrderSettingsEndpointService,
    ShipViaService,
    ShipViaEndpoint,
    EmployeeTrainingTypeService,
    EmployeeTrainingTypeEndpointService,
    SalesOrderService,
    SalesOrderEndpointService,
    SalesOrderReferenceStorage,
    StocklineReferenceStorage,
    CommunicationService,
    InvoicePaymentService,
    InvoicePaymentEndpointService
  ],
  entryComponents: [
    LoginComponent,
    LoginDialogComponent,
    AddTaskDialogComponent,
    CustomerViewComponent,
    StocklineViewComponent,
    StocklineHistoryComponent,
    EntityViewComponent,
    AssetInventoryViewComponent,
    AuditComponentComponent
  ],
  bootstrap: [AppComponent],
  exports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}
