import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog, SELECT_MULTIPLE_PANEL_PADDING_X } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DOCUMENT, DatePipe } from '@angular/common';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MasterCompany } from '../../../models/mastercompany.model';
import { AuditHistory } from '../../../models/audithistory.model';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Integration } from '../../../models/integration.model';
import { IntegrationService } from '../../../services/integration-service';
import { ItemClassificationService } from '../../../services/item-classfication.service';
import { ItemClassificationModel } from '../../../models/item-classification.model';
import { OnInit, AfterViewInit, Component, ViewChild, ChangeDetectorRef, Inject, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Itemgroup } from '../../../models/item-group.model';
import { ItemGroupService } from '../../../services/item-group.service';
import { Provision } from '../../../models/provision.model';
import { ProvisionService } from '../../../services/provision.service';
import { ATAMain } from '../../../models/atamain.model';
import { AtaMainService } from '../../../services/atamain.service';
import { Priority } from '../../../models/priority.model';
import { PriorityService } from '../../../services/priority.service';
import { Currency } from '../../../models/currency.model';
import { CurrencyService } from '../../../services/currency.service';
import { UnitOfMeasureService } from '../../../services/unitofmeasure.service';
import { UnitOfMeasure } from '../../../models/unitofmeasure.model';
import { LegalEntityService } from '../../../services/legalentity.service';
import { ATAChapter } from '../../../models/atachapter.model';
import { FormArray } from '@angular/forms';
import { ItemMasterCapabilitiesModel } from '../../../models/itemMasterCapabilities.model';
import { GlAccountService } from '../../../services/glAccount/glAccount.service';
import { GlAccount } from '../../../models/GlAccount.model';
import { VendorService } from '../../../services/vendor.service';
import { MenuItem } from 'primeng/api';
import { AircraftDashNumber } from '../../../models/dashnumber.model';
import { AircraftModel } from '../../../models/aircraft-model.model';
import { AircraftModelService } from '../../../services/aircraft-model/aircraft-model.service';
import { AircraftManufacturerService } from '../../../services/aircraft-manufacturer/aircraftManufacturer.service';
import { AtaSubChapter1Service } from '../../../services/atasubchapter1.service';
import { CustomerService } from '../../../services/customer.service';
import { PublicationService } from '../../../services/publication.service';
import { DashNumberService } from '../../../services/dash-number/dash-number.service';
import { CommonService } from '../../../services/common.service';
import { ItemMasterExchangeLoanComponent } from '../item-master-exch-loan/item-master-exch-loan.component';
import { ConfigurationService } from '../../../services/configuration.service';
import { pulloutRequiredFieldsOfForm } from '../../../validations/form.validator';

import { SiteService } from '../../../services/site.service';
import { Site } from '../../../models/site.model';
import { StocklineService } from '../../../services/stockline.service';
import { DBkeys } from '../../../services/db-Keys';
import { getObjectByValue, getPageCount, getObjectById, validateRecordExistsOrNot, getValueFromObjectByKey, editValueAssignByCondition, getValueFromArrayOfObjectById, formatNumberAsGlobalSettingsModule, formatStringToNumber } from '../../../generic/autocomplete';
import { AssetAcquisitionType } from '../../../models/asset-acquisition-type.model';
import { AssetAcquisitionTypeService } from "../../../services/asset-acquisition-type/asset-acquisition-type.service";
declare var $ : any;
import * as moment from 'moment';
import { ConditionService } from '../../../services/condition.service';
// import { e } from '@angular/core/src/render3';
import { LocalStoreManager } from '../../../services/local-store-manager.service';
import { Subject } from 'rxjs'

@Component({
    selector: 'app-item-master-stock',
    templateUrl: './item-master-stock.component.html',
    styleUrls: ['./item-master-stock.component.scss'],
    providers: [DatePipe]
})

/** item-master-stock component*/
export class ItemMasterStockComponent implements OnInit, AfterViewInit {
    @ViewChild('exchLoan',{static:false}) exchLoan: ItemMasterExchangeLoanComponent;
    updateBtnExp = true;
    @Output() triggeNTAETab  = new EventEmitter<any>();
    globalDateFormat: "MM/dd/yyyy";
    isSpinnerVisible: boolean = true;
    defaultRotableId: any ;
    dataSourceValue: MatTableDataSource<Priority>;
    private onDestroy$: Subject<void> = new Subject<void>();
    uploadDocs: Subject<boolean> = new Subject();
    disables: boolean = false;
    disable1: boolean = true;
    disabled: boolean = false;
    disableSave: boolean;
    selectedOnly: boolean = false;
    targetData: any;
    view: boolean = false;
    unitofmeasureValue: any[];
    disableIntegrationSave: boolean;
    currencySymbol: any;
    bulist: any[] = [];
    public sourcePS: any = {};
    public sourceAircraft: any = {};
    bulistovh: any[] = [];
    departmentList: any[] = [];
    departmentListovh: any[] = [];
    divisionlist: any[] = [];
    disableuomvalue: boolean = false;
    divisionlistovh: any[] = [];
    maincompanylist: any[] = [];
    selectdescription: any;
    aircraftList: any[];
    aircraftListData: any[];
    itemdescription: any[] = [];
    showexportData: boolean;
    showGeneralData: boolean = true;
    showpurchaseData: boolean;
    disableManufacturer: boolean;
    disableSaveglAccount: boolean;
    glAccountCollection: any[];
    enablePopupData: boolean = false;
    display: boolean = false;
    modelValue: boolean = false;
    allCapesData: any[] = [];
    enablePlus: boolean = false;
    public sourceAction: any = {};
    allAircraftsGet: any[] = [];
    manfacturerAircraftmodelsarray: any[] = [];
    overhaulAircraftmodelsarray: any[] = [];
    distributionAircraftmodelsarray: any[] = [];
    repairAircraftmodelsarray: any[] = [];
    certificationarrayAircraftmodelsarray: any[] = [];
    exchangeAircraftmodelsarray: any[] = [];
    capesCollection: any[] = [];
    selectedModels: any[] = [];
    sourceUOM: UnitOfMeasure;
    disableSavepartNumber: boolean;
    disableReorderQuantiy: boolean;
    disableSaveItemClassficationCode: boolean;
    disableSaveItemGroup: boolean;
    selectedItemGroup: any;
    disableSavePurchaseUOM: boolean;
    selectedPurchaseUOM: any;
    disableSaveProvision: boolean;
    selectedProvision: any;
    disableSaveManufacturer: boolean;
    selectedManufacturer: any;
    disableSaveATAChapter: boolean;
    selectedATAChapter: any;
    disableSavePriority: boolean;
    selectedPriority: any;
    selectedIntegration: any;
    disableSaveStockUOM: boolean;
    selectedStockUOM: any;
    disableSaveConsume: boolean;
    selectedConsume: any;
    disableSaveSOLD: boolean;
    disableSavepn: boolean;
    disablepurchaseSales: boolean = true;
    selectedSOLD: any;
    disableSaveIntegration: boolean;
    selectedItemCode: any;
    descriptionCollection: any[] =  [];
    selectedActionName: any;
    showLable: boolean;
    markUpListPriceAfterDiskValue: boolean;
    markupListPriceValue: boolean = true;
    calculateUsingPurchasePrice: any;
    fixedSalesPriceValue: boolean = true;
    collectionofItemMaster: any = {};
    value: number;
    actionamecolle: any[] = [];
    partCollection: any[] = [];
    oempnCollection: any[];
    oempnList: any[];
    manufacturerCollection: any[];
    allPartnumbersInfo: any[];
    allpnNumbers: any[];
    name: string;
    allglAccountInfo: any[];
    glAccountcla: any[];
    localmanufacturer: any[] = [];
    sourcemanufacturer: any = {};
    allManufacturerInfo: any[];
    provisionName: any = {};
    shiftValues: any[] = [];
    modelValues: any[] = [];
    selectedModelValues: any;
    allaircraftInfo: any[];
    allAircraftinfo: any[];
    selectedAircraftTypes: any = [];
    allWarninginfo: any[];
    localunit: any[];
    unitName: string;
    none: any;
    countryName: any[];
    allCurrencyInfo: any[];
    localpriority: any[];
    priorityName: string;
    itemclaColl: any[];
    oempnNumber: any[];
    ProvisionNumber: any[];
    manufacturerNumber: any[];
    integrationName: string;
    localintegration: any[];
    allIntegrationInfo: Integration[];
    localatamain: any[];
    ataChapterName: string;
    localprovision: any[] = [];
    localgroup: any[] = [];
    allProvisonInfo: any = [];
    activeTab: number = 0;
    rowDataToDelete: any = {};
    itemQuantity = [];
    isEditMode: boolean = false;
    disableSaveForEdit:boolean=true;
    disableAircraftSaveForEdit:boolean=true;
    items1: MenuItem[];
    activeItem: MenuItem;
    itemGroupName: string;
    manufacturerName: string;
    partNumber: any;
    pmaNumber: any;
    itemType: any;
    description: any;
    item_Name: any;
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createdDate: any = "";
    updatedDate: any = "";
    auditHisory: AuditHistory[];
    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    cols: any[];
    selectedColumns: any[];
    localNameCollection: any[] = [];
    localtypeCollection: any[] = [];
    selectedAircraftDataModels: any[] = [];
    Weight: any;
    getALlUOM: any;
    classnamecolle: any[] = [];
    classificationtypecolle: any[] = [];
    displayedColumns = ['itemclassificationId', 'itemclassificationCode', 'description', 'memo'];
    dataSource: MatTableDataSource<ItemClassificationModel>;
    allitemclassificationInfo: any[] = [];
    allitemgroupobjInfo: any = [];
    private isSaving: boolean;
    countrycollection: any[];
    allCountryinfo: any[];
    public sourceActions: any = {};
    public sourceUomModel: any = {};
    allPriorityInfo: any[] = [];
    allUnitOfMeasureinfo: any[];
    allPurchaseUnitOfMeasureinfo: any[] = [];
    allStockUnitOfMeasureinfo: any[] = [];
    allConsumeUnitOfMeasureinfo: any[] = [];
    allWeightUnitOfMeasureInfo:any = [];
    allExportUnitOfMeasureInfo:any = [];
    allSizeUnitOfMeasureInfo:any = [];
    allSOLDUnitOfMeasureinfo: any[];
    private bodyText: string;
    loadingIndicator: boolean;
    closeResult: string;
    selectedColumn: ItemClassificationModel[];
    data: boolean;
    title: string = "Create";
    id: number;
    errorMessage: any;
    Active: string = "Active";
    modal: NgbModalRef;
    itemName: string;
    className: any;
    itemTypeName: any;
    filteredBrands: any[];
    localCollection: any[] = [];
    sourceItemMaster: any = {};
    PDropdownDirectives: any = []
    isEnabeCapes: boolean = false;
    private isDeleteMode: boolean = false;
    purchaseData: boolean = false;
    exportData: boolean = false;
    showInput: boolean;
    activeIndex: number;
    descriptionbyPart: any[] = [];
    allintegrationdetails: any;
    integrationvalues: any[] = [];
    disableClassdesc: boolean;
    disabletypeSave: boolean;
    disableSavepartDescription: boolean;
    allAircraftManufacturer: any[] = [];
    allCurrentItemMasterModels: any[] = [];
    completeAircraftModelData: any[] = [];
    currentItemMasterModels: any[] = [];
    selectedIntegrationTypes: any[];
    selected: any[] = [];
    selectedPartId: any;
    manufacturerData: any[] = [];
    capabilitiesForm: FormGroup;
    sourceItemMasterCap: any = {};
    completeAircraftManfacturerData: any[];
    ItemMasterId: number = 0;
    isSaveCapes: boolean;
    capabilityEditCollection: any;
    allGlInfo: any[] = [];
    allSubChapter: ATAChapter[];
    disableSaveNHANumber: boolean;
    disableSaveAlterumber: boolean;
    portalURL: any;
    public sourceIntegration: any = {};
    integrationNamecolle: any[] = [];
    cols1: any[];
    ataMainchapter: any[]
    showAircraftData: boolean = false;
    showAtachapter: boolean = false;
    selectedAircraftId: any;
    selectedModelId: any = [];
    //new code-- for purchase and sales calculation
    itemQuantitys = [];
    sales: any[];
    atasub: any[];
    ataSubSelectedCols: any[];
    sales2: any[];
    salesDash: any[];
    modalDash: any[];
    currentDashNumberType: AircraftDashNumber;
    selectedAircrafttype: AircraftDashNumber;
    currentAtaNumber: ATAChapter;
    aircraftModelsList: AircraftModel[];
    atasubchapter = [];
    LoadAircraftmanufacturer: any[] = [];
    LoadAtachapter: any[] = [];
    vendorPrice: any;
    purchaseDiscount: any;
    pnDescription: any;
    ManufacturerValue: any;
    alternatePn: any;
    ataform: FormGroup;
    memoNotes: string = 'Add Memo';
    manufacturerValue: FormGroup;
    ataChaptherSelected: any;
    modelUnknown = false;
    editAircraftTypeID: any = 0;
    dashNumberUnknown = false;
    newFields = {
        ConditionId: undefined,
        PP_UOMId: null,
        PP_CurrencyId: null,
        PP_FXRatePerc: 0,
        PP_VendorListPrice: null,
        PP_LastListPriceDate: new Date(),
        PP_PurchaseDiscPerc: null,
        PP_LastPurchaseDiscDate: new Date(),
        PP_PurchaseDiscAmount: null,
        PP_UnitPurchasePrice: null,
        SP_FSP_UOMId: null,
        SP_FSP_CurrencyId: null,
        SP_FSP_FXRatePerc: 0,
        SP_FSP_FlatPriceAmount: null,
        SP_FSP_LastFlatPriceDate: null,//new Date(),        
        SP_CalSPByPP_MarkUpPercOnListPrice: null,
        SP_CalSPByPP_MarkUpAmount: null,
        SP_CalSPByPP_LastMarkUpDate: null,// new Date(),
        SP_CalSPByPP_BaseSalePrice: null,
        SP_CalSPByPP_SaleDiscPerc: null,
        SP_CalSPByPP_SaleDiscAmount: null,
        SP_CalSPByPP_LastSalesDiscDate: null,// new Date(),
        SP_CalSPByPP_UnitSalePrice: null,
        isEditable: false,
        isNewItem: true
    }
    aircraftData: any = [];
    selectedAtAChapther: ATAChapter[];
    ataMappedList: any = [];
    enableDNMemo: boolean = true;
    indexOfrow: any;
    activeMenuItem: number = 1;
    activeNTAEMenuItem: number = 1;
    currentTab: string = 'General';
    currentNTAETab: string = 'NHA';
    manufacturer: any;
    aircraftManfacturerIdsUrl: any = '';
    aircraftModelsIdUrl: any = '';
    dashNumberIdUrl: any = '';
    searchAircraftParams: string = '';
    aircraftModelList: { label: string; value: number; }[] = [];
    dashNumberList: any = [];
    viewTable: boolean = false;
    aircraftdata = [];
    selectedDashnumber: any = [];
    dashNumberUrl: any;
    newDashnumValue: any = [];
    selectAircraftManfacturer: any = [];
    selectedAircraftModel: any = [];
    selectedDashNumbers: any = [];
    selectedATAchapter: any = [];
    ataChapterIdUrl: any = '';
    selectedATASubChapter: any = [];
    ataSubchapterIdUrl: any = '';
    searchATAParams: string = '';
    isDisabledSteps = false;
    isNTAEDisabledSteps = true;
    isEdit: boolean = false;
    itemMasterId: number = 0;
    fieldArray: any = [];
    row: any;
    Delete = true;
    allpriority: any[] = [];
    allIntegration: any[] = [];
    selectedreason: any;
    exportInfo = {
        exportECCN: '',
        iTARNumber: '',
        exportUomId: null,
        exportCountryId: null,
        exportValue: null,
        exportCurrencyId: null,
        exportWeight: null,
        exportWeightUnit: null,
        exportSizeLength: null,
        exportSizeWidth: null,
        exportSizeHeight: null,
        exportClassificationId: null,
        exportSizeUnitOfMeasureId: null
    }
    sourceExportInfo: any = {};
    tempOEMpartNumberId: number = null;
    tempExportCountryId: number = null;
    isItemMasterCreated: boolean = false;
    isValidClassification: boolean = false;
    oemPnData: any;
    //capes
    capabilityTypeList: any = [];
    selectedCapabilityTypes: any = [];
    capeBldList: any = [];
    distinctAtaList: any[] = [];
    listOfErrors: any = [];
    conditionList: any;
    revisedPartNumbersList: any = [];
    formData = new FormData();
    @ViewChild("exportInformatiom",{static:false}) formdataexport : any;
    @ViewChild("addItemMasterStockForm",{static:false}) formdataexportinfo : any;
    stopmulticlicks: boolean;
    allUploadedDocumentsList: any = [];
    documentDeleted: boolean;
    allSites: any[] = [];
    wareHouseData: any[] = [];
    currentstatus: string = 'Active';
    currentDeletedstatus:boolean=false;
    locationData: any[] = [];
    shelfData: any[] = [];
    binData: any[] = [];
    isEnableItemMaster: boolean = true;
    orginalAtaSubChapterValues: any[] = [];
    AssetAcquisitionTypeList: any[] = [];
    aircraftTablePageSize: number = 10;
    ataChapterTablePageSize: number = 10;
    totalAircraftRecords: any;
    totalAircraftPages: number;
    disableSaveItemClassficationCodeMsg: boolean = false;
    disableClassdescMsg:boolean=false;
    totalAtaChapterRecords: any;
    totalAtaChapterPages: number;
    selectedItemClassificationName: any = "";
    viewAircraftData: any = {};
    viewATAData: any = {};
    editAirCraftData: any = {};
    aircraftauditHistory: any = [];
    revisedPartNumCollection: any = [];
    legalEntityId: number;
    textAreaInfo: string;
	textAreaLabel: string;
    LoadModelsIds: any = [];
    LoadDashnumberIds: any = [];
    selectedAtaInformation: any = {
        ataChapterId: 0
    };
    ataChapterEditMode: boolean = false;
    ataChapterAuditHistory: any = [];
    atasubchapterforEdit:  any = [];
    enableAirCraftSaveButton: boolean = false;
    itemTypesList: any = [];
    standard: string;
    shortName: string;
    itemClassificationId: any;
    canAddAircraft: boolean = false;
    @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
    disableSaveMemo: boolean = true;
    moduleName: any = 'ItemMaster';
    pageSize: number = 10;
    sourceViewforDocumentListColumns = [
        { field: 'fileName', header: 'File Name' },
    ]
    customerDocumentsColumns = [
        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'docMemo', header: 'Memo' },
        { field: 'fileName', header: 'File Name' },
        { field: 'fileSize', header: 'File Size' },
        { field: 'createdDate', header: 'Created Date' },
      
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
      
        { field: 'updatedBy', header: 'Updated By' },

    ];


    selectedColumnsDoc = this.customerDocumentsColumns;
    sourceViewforDocumentList: any = [];
    sourceViewforDocument: any = [];
    sourceViewforDocumentAudit: any = [];
    isEditButton: boolean = false;
    documentInformation = {
        docName: '',
        docMemo: '',
        docDescription: '',
        attachmentDetailId: 0
    }
    selectedFileAttachment: any = [];
    selectedFile: File = null;
    allDocumentListOriginal: any = [];
    selectedRowForDelete: any;
    rowIndex: number;
    @ViewChild("tabRedirectConfirmationModal",{static:false}) public tabRedirectConfirmationModal: ElementRef;
    nextOrPreviousTab: any ="Next";
    isItemMasterCreateGeneralInfoEditMode: boolean = false;
    schematicFilesListForView: any  = [];
    allConditionsList: any = [];
    allPurchaseInfoListActiveandInactive: any = [];
    allCurrencyInfoActiveandInactive: any = [];
    sourceViewforPurchaseandSalesAudit: any = [];
    canEditAircraft: boolean = false;
    selectedPartNumber: any;
    allPurchaseAndSaleMasterList: any = [];
    currentDeleteStatus: boolean = false;
    originalPurchaseSaleList: any = [];
    restorePSRecordRow: any;
    deletePSRecordRow: any;
    deletePSRecordRowIndex: any;
    currentItemTypeId: number;
    disableDocSave: boolean = true;
    schematicAttachModuleId: number;
    currentDate: Date = new Date();
    updateBtn : any= true;
    arrayItemMasterlist:any[] = [];
    allPartnumbersList: any = [];
    arrayManufacturelist:any[] = [];
    purchaseCurrencyInfo: any = [];
    salesCurrencyInfo: any = [];
    arrayCurrancylist:any[] = [];
    itemMasterReferenceId: number;
    uploadedFileLength: any;

    constructor(private fb: FormBuilder, public priorityService: PriorityService, public countryservice: CustomerService, private Dashnumservice: DashNumberService, private atasubchapter1service: AtaSubChapter1Service, private atamain: AtaMainService, private aircraftManufacturerService: AircraftManufacturerService, private aircraftModelService: AircraftModelService, private Publicationservice: PublicationService, public integrationService: IntegrationService, private formBuilder: FormBuilder, public workFlowtService1: LegalEntityService, private changeDetectorRef: ChangeDetectorRef, private router: Router,
        private authService: AuthService, public unitService: UnitOfMeasureService, private modalService: NgbModal, private glAccountService: GlAccountService, public vendorser: VendorService,
        public itemser: ItemMasterService, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public ataMainSer: AtaMainService,
        public currency: CurrencyService, private _actRoute: ActivatedRoute,
        public priority: PriorityService, public inteService: IntegrationService,
        public workFlowtService: ItemClassificationService, public itemservice: ItemGroupService,
        public proService: ProvisionService, private dialog: MatDialog, private conditionService: ConditionService,
        private masterComapnyService: MasterComapnyService, public commonService: CommonService, @Inject(DOCUMENT) document, private configurations: ConfigurationService, public siteService: SiteService, public stockLineService: StocklineService, private AssetAcquisitionTypeService: AssetAcquisitionTypeService, private datePipe: DatePipe,
        private uomServie: UnitOfMeasureService
        ) {
        this.itemser.currentUrl = '/itemmastersmodule/itemmasterpages/app-item-master-stock';
        this.itemser.bredcrumbObj.next(this.itemser.currentUrl);//Bread Crumb
        this.displayedColumns.push('action');
        this.formData = new FormData();
        this.dataSource = new MatTableDataSource();
        this.CurrencyData();
        this.sourceItemMaster = {
            partNumber: "",
            partDescription: "",
            isOEM: 'true'
        }
        
        this.PDropdownDirectives = ["partNumber", "partDescription"];
        //Adding Below Code for By Default Date Should be current Date while Creation
        this.sourceItemMaster.salesLastSalePriceDate = new Date();
        this.sourceItemMaster.salesLastSalesDiscountPercentDate = new Date();
        // checks the params id with the url 
    }

    //setting the values for capability //
    capabilityTypeData: any = [{
        CapabilityTypeId: 1, Description: 'Manufacturing', formArrayName: 'mfgForm', selectedAircraftDataModels: [],
        selectedAircraftModelTypes: [], selectedAircraftTypes: [], selectedManufacturer: [], selectedModel: []
    },
    {
        CapabilityTypeId: 2, Description: 'Overhaul', formArrayName: 'overhaulForm', selectedAircraftDataModels: []
        , selectedAircraftModelTypes: [], selectedAircraftTypes: [], selectedManufacturer: [], selectedModel: []
    },
    {
        CapabilityTypeId: 3, Description: 'Distribution', formArrayName: 'distributionForm', selectedAircraftDataModels: [],
        selectedAircraftModelTypes: [], selectedAircraftTypes: [], selectedManufacturer: [], selectedModel: []
    },
    {
        CapabilityTypeId: 4, Description: 'Certification', formArrayName: 'certificationForm', selectedAircraftDataModels: [],
        selectedAircraftModelTypes: [], selectedAircraftTypes: [], selectedManufacturer: [], selectedModel: []
    },
    {
        CapabilityTypeId: 5, Description: 'Repair', formArrayName: 'repairForm', selectedAircraftDataModels: [],
        selectedAircraftModelTypes: [], selectedAircraftTypes: [], selectedManufacturer: [], selectedModel: []
    },
    {
        CapabilityTypeId: 6, Description: 'Exchange', formArrayName: 'exchangeForm', selectedAircraftDataModels: [],
        selectedAircraftModelTypes: [], selectedAircraftTypes: [], selectedManufacturer: [], selectedModel: []
    }];

    colsaircraftLD = [
        { field: "aircraft", header: "Aircraft" },
        { field: "model", header: "Model" },
        { field: "dashNumber", header: "Dash Numbers" },

        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },
        
    ];
    selectedAircraftLDColumns = this.colsaircraftLD;
    colaircraft: any[] = [
        { field: "AircraftType", header: "Aircraft" },
        { field: "AircraftModel", header: "Model" },
        { field: "DashNumber", header: "Dash Numbers" },
    ];
    capesColumns: any[] = [
        { field: 'capability', header: "CAPABILITY TYPES" },
        { field: 'entity', header: "ENTITY" },
        { field: 'company', header: "COMPANY" },
        { field: 'bu', header: "BU" },
        { field: 'division', header: "DIVISION" },
        { field: 'dep', header: "DEP" },
        { field: 'manufacturer', header: "MANUFACTURER" },
        { field: 'aircaft', header: "AIRCRAFT" },
        { field: 'model', header: "MODEL" },
        { field: 'dashnumber', header: "DASH NUM" },
        { field: 'description', header: "DESCRIPTION" },
        { field: 'ataChapter', header: "ATA CHAPTER" },
        { field: 'atasubchapter', header: "ATA SUBCHAPTER" },
        { field: 'entrydate', header: "ENTRY DATE" },
        { field: 'cmmid', header: "CMM ID" },
        { field: 'verified', header: "VERIFIED" },
        { field: 'verifiedby', header: "VERIFIED BY" },
        { field: 'dateverified', header: "DATE VERIFIED" },
        { field: 'ntehrs', header: "NTE HRS" },
        { field: 'tat', header: "TAT" },
        { field: 'memo', header: "MEMO" },
    ];
    aircraftListDataValues: any = [];
    capesListDataValues: any;
    showAdvancedSearchCard: boolean = false;
    showAdvancedSearchCardAtaChapter: boolean = false;

    ngOnInit(): void {
       
        this.globalDateFormat = DBkeys.GLOBAL_DATE_FORMAT;
        this.defaultRotableId = DBkeys.DEFAULT_ROTABLE_ID;
        this.ataform = this.fb.group({
            atanumber: new FormControl(0, Validators.required),
            atasubchaptername: new FormControl('')
        });
        this.manufacturerValue = this.fb.group({
            'manufacturer': new FormControl('', Validators.required)
        });
        
        this.modalDash = [
            { field: 'aircraft', header: 'Aircraft' },
            { field: 'model', header: 'Model' },
        ];
        this.salesDash = [
            { aircraft: '', model: '', dashnumber: '' },
            { aircraft: '', model: '', dashnumber: '' },
        ];

        this.atasub = [
            { field: 'partNumber', header: 'Part Number' },
            { field: 'partDescription', header: 'Part Description',width:"200px" },
            { field: 'ataChapterName', header: 'ATA Chapter',width:"200px" },
            { field: 'ataSubChapterDescription', header: 'ATA Sub-Chapter' },

            { field: 'createdDate', header: 'Created Date' },
            { field: 'createdBy', header: 'Created By' },
            { field: 'updatedDate', header: 'Updated Date' },
            { field: 'updatedBy', header: 'Updated By' },
        ];
        this.ataSubSelectedCols = this.atasub;
            
        this.manufacturerdata();
        this.getItemTypesList();
        this.itemclass();
        this.itemgroup(false);
        this.priorityData();
        this.Integration();
        this.Purchaseunitofmeasure();
        this.glList();
        this.ptnumberlistdata(); // Need to restrict to 20 Records
        this.loadSiteData();
        this.getAcquisitionTypeList();
        this.getItemTypeList();

        //---------Need to CommentS all this-----------------
        this.getItemMasterPurchaseSaleMaster();        
        this.getAttachmentModuleIdByName();
        //---------Need to CommentS all this-----------------

        this.activeIndex = 0;
        this.sourceItemMaster.salesIsFixedPrice = true;
        this.capabilitiesForm = this.formBuilder.group({
            mfgForm: this.formBuilder.array([]),
            overhaulForm: this.formBuilder.array([]),
            distributionForm: this.formBuilder.array([]),
            certificationForm: this.formBuilder.array([]),
            repairForm: this.formBuilder.array([]),
            exchangeForm: this.formBuilder.array([])
        });

        this.itemMasterId = this._actRoute.snapshot.params['id'];

        if (this.itemMasterId) {
            // get the itemmaster data by id
            this.itemMasterReferenceId = this.itemMasterId;
            localStorage.setItem('commonId',this.itemMasterId.toString())
            this.isEdit = true;
            this.disableSaveForEdit=true;
            this.isItemMasterCreated = true;
            this.getItemMasterDetailsById()
            this.getItemMasterExportInfoById(this.itemMasterId)
        }
        
        if(localStorage.getItem('currentTab')){
            this.changeOfTab(localStorage.getItem('currentTab'))
        } else{
            // localStorage.removeItem('currentTab')
        }
    } 

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }
    
    get currentUserLegalEntityId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.legalEntityId
		  : null;
    }
    
    getItemTypeList() {
         this.commonService.autoSuggestionSmartDropDownList('ItemType', 'ItemTypeId', 'Description','', false, 0,'0', 0).subscribe(res => {
            res.map(x => {
                if(x.label == 'Stock') {
                    this.currentItemTypeId = x.value;
                }
            });            
        });
    }

    getAttachmentModuleIdByName() {
        this.commonService.getAttachmentModuleIdByName('ItemMaster').subscribe(res => {
            this.schematicAttachModuleId = res;
        })
    }

    onBlur(event) {
        const value = event.target.value;
        this.disableSaveItemClassficationCodeMsg = false;
        for (let i = 0; i < this.allitemclassificationInfo.length; i++) {
            let itemName = this.allitemclassificationInfo[i].itemClassificationCode;
            if (itemName.toLowerCase() == value.toLowerCase()) {
                if (!this.isEdit || this.isEdit) {
                    this.disableSaveItemClassficationCode = true;
                    this.disableSaveItemClassficationCodeMsg = true;
                }               
                else {
                    this.disableSaveItemClassficationCode = false;
                    this.disableSaveItemClassficationCodeMsg = false;
                }
                break;
            }
        }
    }
    
    onBlurnameitemgroup(event) {
        const value = event.target.value;
        this.disableSaveItemGroup = false;
        for (let i = 0; i < this.allitemgroupobjInfo.length; i++) {
            let itemGroupName = this.allitemgroupobjInfo[i].itemGroupCode;
            if (itemGroupName.toLowerCase() == value.toLowerCase()) {
                if (!this.isEdit || this.isEdit) {
                    this.disableSaveItemGroup = true;
                }
                else {
                    this.disableSaveItemGroup = false;
                }
                break;
            }
        }
    }

    onBlurname(event) {
        const value = event.target.value;
        this.disableClassdescMsg = false;
        for (let i = 0; i < this.allitemclassificationInfo.length; i++) {
            let itemClassificationId = this.allitemclassificationInfo[i].description;
            if (itemClassificationId.toLowerCase() == value.toLowerCase()) {
                if (!this.isEdit || this.isEdit) {
                    this.disableClassdesc = true;
                    this.disableClassdescMsg = true;
                }
                else {
                    this.disableClassdesc = false;
                    this.disableClassdescMsg = false;
                }
                break;
            }
        }
    }
    closeDeleteModal() {
		$("#downloadAircraftConfirmation").modal("hide");
    }
    closeAtaDownloadModal(){
        $("#downloadAtaConfirmation").modal("hide");

    }

    exportCSV(dt){
        dt._value = dt._value.map(x => {
            return {
                ...x,
                createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
            }
        });
        dt.exportCSV();
    }

    exportAtaCSV(ataDataTable){
        ataDataTable._value = ataDataTable._value.map(x => {
            return {
                ...x,
                createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
            }
        });
        ataDataTable.exportCSV();
    }

    //Gneral Infor - Get Acquisition Types List
    getAcquisitionTypeList() {
        //this.commonService.smartDropDownWithStatusList('AssetAcquisitionType', 'assetAcquisitionTypeId', 'name', '', 1, 0).subscribe(res => {
        this.commonService.autoSuggestionSmartDropDownList('AssetAcquisitionType', 'assetAcquisitionTypeId', 'name','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {
            this.AssetAcquisitionTypeList= res;
            this.AssetAcquisitionTypeList.map(x => {
                if(x.label == 'Buy') {
                    this.sourceItemMaster.assetAcquistionTypeId = x.value;
                }
            });
        })
    }

    async getDiscountTableData(){
        await this.commonService.autoSuggestionSmartDropDownList('Discount', 'DiscountId', 'DiscontValue', '', '', 0, '', this.currentUserMasterCompanyId).subscribe(res => {
            this.itemQuantitys = res;
            this.itemQuantitys.sort(function(a, b) {
                return parseFloat(a.label) - parseFloat(b.label);
            });
            for(let i = 0; i< this.itemQuantitys.length; i++){
                if(this.itemQuantitys[i].label == 0.00){
                    this.itemQuantitys[i].value = 0;
                    this.newFields.PP_PurchaseDiscPerc = this.itemQuantitys[i].value;
                    this.newFields.SP_CalSPByPP_SaleDiscPerc = this.itemQuantitys[i].value;
                }
            }            
        });
    }

    async getPercentTableData(){
          await this.commonService.autoSuggestionSmartDropDownList('[Percent]', 'PercentId', 'PercentValue', '', '', 0, '', this.currentUserMasterCompanyId).subscribe(res => {
            this.itemQuantity = res;
            this.itemQuantity.sort(function(a, b) {
                return parseFloat(a.label) - parseFloat(b.label);
            });
            for(let i = 0; i< this.itemQuantity.length; i++){
                if(this.itemQuantity[i].label == 0.00){
                    this.itemQuantity[i].value = 0;
                    this.newFields.SP_CalSPByPP_MarkUpPercOnListPrice = this.itemQuantity[i].value;
                }
            }            
        });
    }

    getItemMasterPurchaseSaleMaster() {
        this.isSpinnerVisible = true;
          this.commonService.autoSuggestionSmartDropDownList('ItemMasterPurchaseSaleMaster', 'ItemMasterPurchaseSaleMasterId', 'Name','', false, 0,'0',0).subscribe(response => {
            this.allPurchaseAndSaleMasterList = response;
            this.allPurchaseAndSaleMasterList = this.allPurchaseAndSaleMasterList.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
            if(!this.isEdit) {
                this.isSpinnerVisible = false;
            }
		});
    }

    getItemMasterDetailsById(){
        this.isSpinnerVisible = true;
        this.itemser.getItemMasterDetailById(this.itemMasterId).subscribe(res => {
            const responseDataOfEdit = res[0];
            this.isItemMasterCreateGeneralInfoEditMode = true;
            this.isDisabledSteps = true;
            
            this.arrayItemMasterlist.push(responseDataOfEdit.revisedPartId);
            this.arrayItemMasterlist.push(this.sourceItemMaster.isOemPNId);

            this.getEditDataForPN(responseDataOfEdit.revisedPartId, responseDataOfEdit.isOemPNId);

            this.sourceItemMaster = {
                ...responseDataOfEdit,
                //revisedPartId: getObjectById('itemMasterId', responseDataOfEdit.revisedPartId, this.allPartnumbersInfo),
                isOEM: responseDataOfEdit.isOEM.toString()
            };
            this.selectedPartNumber = this.sourceItemMaster.partNumber;
            this.selectedItemClassificationName = this.sourceItemMaster.itemClassification;
            if (this.sourceItemMaster.siteId) {
                this.siteValueChange()
            }
            if (this.sourceItemMaster.warehouseId) {
                this.wareHouseValueChange()
            }
            if (this.sourceItemMaster.locationId) {
                this.locationValueChange()
            }
            if (this.sourceItemMaster.shelfId) {
                this.shelfValueChange()
            }

            this.sourceItemMaster.expirationDate = this.sourceItemMaster.expirationDate ? new Date(this.sourceItemMaster.expirationDate) : null;
            //this.sourceItemMaster.isOemPNId = getObjectById('value', this.sourceItemMaster.isOemPNId, this.oempnCollection);
            this.selectedIntegrationTypes = this.sourceItemMaster.integrationPortalIds;
            this.ItemMasterId = this.itemMasterId;
            // assign the header values
            this.pnvalue = this.sourceItemMaster.partNumber;
            this.pnDescription = this.sourceItemMaster.partDescription;
            this.ManufacturerValue = this.sourceItemMaster.manufacturerName;
            this.alternatePn = this.sourceItemMaster.partAlternatePartId;
            
            this.getPurchaseSalesDetailById(this.itemMasterId);
            if(!this.exportInfo.exportCurrencyId){
                this.getDefaultCurrency()
            }
            // validate classification required in Export Information
            this.getAircraftMappedDataByItemMasterId();
            this.toGetAllDocumentsList(this.ItemMasterId);
            this.toGetDocumentsListNew(this.ItemMasterId);
            this.getInactiveObjectsOnEdit();
            this.isSpinnerVisible = false;
        }, error => {
            this.isSpinnerVisible = false;
        })
    }
    
    getInactiveObjectsOnEdit() {
        this.sourceItemMaster = {
            ...this.sourceItemMaster,
            itemClassificationId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.itemClassificationId, this.allitemclassificationInfo, 'ItemClassification', 'ItemClassificationId', 'ItemClassificationCode'),
            itemGroupId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.itemGroupId, this.allitemgroupobjInfo, 'ItemGroup', 'ItemGroupId', 'ItemGroupCode'),
            assetAcquistionTypeId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.assetAcquistionTypeId, this.AssetAcquisitionTypeList, 'AssetAcquisitionType', 'assetAcquisitionTypeId', 'name'),
            manufacturerId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.manufacturerId, this.allManufacturerInfo, 'Manufacturer', 'manufacturerId', 'name'),
            purchaseUnitOfMeasureId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.purchaseUnitOfMeasureId, this.allPurchaseUnitOfMeasureinfo, 'UnitOfMeasure', 'unitOfMeasureId', 'shortname'),
            stockUnitOfMeasureId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.stockUnitOfMeasureId, this.allPurchaseUnitOfMeasureinfo, 'UnitOfMeasure', 'unitOfMeasureId', 'shortname'),
            consumeUnitOfMeasureId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.consumeUnitOfMeasureId, this.allPurchaseUnitOfMeasureinfo, 'UnitOfMeasure', 'unitOfMeasureId', 'shortname'),
            salesCurrencyId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.salesCurrencyId, this.salesCurrencyInfo, 'Currency', 'CurrencyId', 'Code'),
            purchaseCurrencyId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.purchaseCurrencyId, this.purchaseCurrencyInfo, 'Currency', 'CurrencyId', 'Code'),
            glAccountId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.glAccountId, this.allGlInfo, 'GLAccount', 'GLAccountId', 'AccountCode'),
            priorityId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.priorityId, this.allPriorityInfo, 'Priority', 'priorityId', 'description'),
            siteId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.siteId, this.allSites, 'Site', 'SiteId', 'Name'),
            warehouseId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.warehouseId, this.wareHouseData, 'Warehouse', 'WarehouseId', 'Name'),
            locationId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.locationId, this.locationData, 'Location', 'LocationId', 'Name'),
            shelfId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.shelfId, this.shelfData, 'Shelf', 'ShelfId', 'Name'),
            binId: this.getInactiveObjectOnEdit('value', this.sourceItemMaster.binId, this.binData, 'Bin', 'BinId', 'Name'),
        };
    }

    getInactiveObjectOnEdit(string, id, originalData, tableName, primaryColumn, description) {
        if(id) {
            for(let i=0; i < originalData.length; i++) {
                if(originalData[i][string] == id) {
                    return id;
                } 
            }
            let obj: any = {};
            this.commonService.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryColumn, id,this.authService.currentUser.masterCompanyId).subscribe(res => {
            obj = res[0];
            if(tableName == 'ItemClassification') {
                this.allitemclassificationInfo = [...originalData, obj];
            }
            else if(tableName == 'ItemGroup') {
                this.allitemgroupobjInfo = [...originalData, obj];
            }
            else if(tableName == 'AssetAcquisitionType') {
                this.AssetAcquisitionTypeList = [...originalData, obj];
            }
            else if(tableName == 'Manufacturer') {
                this.allManufacturerInfo = [...originalData, obj];
            }
            else if(tableName == 'UnitOfMeasure') {
                this.allPurchaseUnitOfMeasureinfo = [...originalData, obj];
                this.allStockUnitOfMeasureinfo = this.allPurchaseUnitOfMeasureinfo;
                this.allConsumeUnitOfMeasureinfo = this.allPurchaseUnitOfMeasureinfo;
            }
            else if(tableName == 'GLAccount') {
                this.allGlInfo = [...originalData, obj];
            }
            else if(tableName == 'Priority') {
                this.allPriorityInfo = [...originalData, obj];
            }
            else if(tableName == 'Site') {
                this.allSites = [...originalData, obj];
            }
            else if(tableName == 'Warehouse') {
                this.wareHouseData = [...originalData, obj];
            }
            else if(tableName == 'Location') {
                this.locationData = [...originalData, obj];
            }
            else if(tableName == 'Shelf') {
                this.shelfData = [...originalData, obj];
            }
            else if(tableName == 'Bin') {
                this.binData = [...originalData, obj];
            }
            else if(tableName == 'Currency') {
                this.allCurrencyInfo = [...originalData, obj];
            }
        });
        return id;
    } else {
            return null;
        }
    }

    getInactiveObjectOnEditExportInfoUOM(string, id, originalData, tableName, primaryColumn, description, varName) {
        if(id) {
            for(let i=0; i < originalData.length; i++) {
                if(originalData[i][string] == id) {
                    return id;
                } 
            }
            let obj: any = {};
            this.commonService.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryColumn, id).subscribe(res => {
            obj = res[0];
            if(varName == 'WeightUOM') {
                this.allWeightUnitOfMeasureInfo = [...originalData, obj];
            }
            else if(varName == 'ExportUOM') {
                this.allExportUnitOfMeasureInfo = [...originalData, obj];
            }
            else if(varName == 'SizeUOM') {
                this.allSizeUnitOfMeasureInfo = [...originalData, obj];
            }           
        });
        return id;
    } else {
            return null;
        }
    }

    getPurchaseSalesDetailById(itemMasterId, val?){
        this.isSpinnerVisible = true;
        this.itemser.getPurcSaleDetailById(itemMasterId).subscribe(res => {
            this.originalPurchaseSaleList = res.map(x => {
                return {
                    ConditionId: parseInt(x.conditionId),
                    itemMasterPurchaseSaleId: x.itemMasterPurchaseSaleId,
                    isDeleted: x.isDeleted,
                    PP_UOMId: x.pP_UOMId,
                    PP_CurrencyId: x.pP_CurrencyId,
                    PP_FXRatePerc: x.pP_FXRatePerc,
                    PP_VendorListPrice: x.pP_VendorListPrice ? formatNumberAsGlobalSettingsModule(x.pP_VendorListPrice, 2) : '0.00',
                    PP_LastListPriceDate: x.pP_LastListPriceDate,
                    PP_PurchaseDiscPerc: x.pP_PurchaseDiscPerc,
                    PP_LastPurchaseDiscDate: x.pP_LastPurchaseDiscDate,
                    PP_PurchaseDiscAmount: x.pP_PurchaseDiscAmount ? formatNumberAsGlobalSettingsModule(x.pP_PurchaseDiscAmount, 2) : '0.00',
                    PP_UnitPurchasePrice: x.pP_UnitPurchasePrice ? formatNumberAsGlobalSettingsModule(x.pP_UnitPurchasePrice, 2) : '0.00',
                    SP_FSP_UOMId: x.sP_FSP_UOMId,
                    SP_FSP_CurrencyId: x.sP_FSP_CurrencyId,
                    SP_FSP_FXRatePerc: x.sP_FSP_FXRatePerc,
                    SP_FSP_FlatPriceAmount: x.sP_FSP_FlatPriceAmount ? formatNumberAsGlobalSettingsModule(x.sP_FSP_FlatPriceAmount, 2) : '0.00',
                    SP_FSP_LastFlatPriceDate: x.sP_FSP_LastFlatPriceDate,
                    SP_CalSPByPP_MarkUpPercOnListPrice: x.sP_CalSPByPP_MarkUpPercOnListPrice,
                    SP_CalSPByPP_MarkUpAmount: x.sP_CalSPByPP_MarkUpAmount ? formatNumberAsGlobalSettingsModule(x.sP_CalSPByPP_MarkUpAmount, 2) : '0.00',
                    SP_CalSPByPP_LastMarkUpDate: x.sP_CalSPByPP_LastMarkUpDate,
                    SP_CalSPByPP_BaseSalePrice: x.sP_CalSPByPP_BaseSalePrice ? formatNumberAsGlobalSettingsModule(x.sP_CalSPByPP_BaseSalePrice, 2) : '0.00',
                    SP_CalSPByPP_SaleDiscPerc: x.sP_CalSPByPP_SaleDiscPerc,
                    SP_CalSPByPP_SaleDiscAmount: x.sP_CalSPByPP_SaleDiscAmount ? formatNumberAsGlobalSettingsModule(x.sP_CalSPByPP_SaleDiscAmount, 2) : '0.00',
                    SP_CalSPByPP_LastSalesDiscDate: x.sP_CalSPByPP_LastSalesDiscDate,
                    SP_CalSPByPP_UnitSalePrice: x.sP_CalSPByPP_UnitSalePrice ? formatNumberAsGlobalSettingsModule(x.sP_CalSPByPP_UnitSalePrice, 2) : '0.00',
                    SalePriceSelectId: parseInt(x.salePriceSelectId),
                    isEditable : false,
                    isNewItem: false
                }
            })
            this.fieldArray = [];
            this.originalPurchaseSaleList.map(x => {
                if(!x.isDeleted) {
                    this.fieldArray.push(x);
                }
            })
            if(val == 'restore') {
                this.fieldArray = [];
                this.originalPurchaseSaleList.map(x => {
                    if(x.isDeleted) {
                        this.fieldArray.push(x);
                    }
                })
            }
            this.isSpinnerVisible = false;
        }, error=> {
            this.isSpinnerVisible = false;
        })
    }

    getPSListOnDeleteStatus(value) {
        this.isSpinnerVisible = true;
        this.itemser.getPurcSaleDetailById(this.itemMasterId).subscribe(res => {
            this.originalPurchaseSaleList = res.map(x => {
                return {
                    ConditionId: parseInt(x.conditionId),
                    itemMasterPurchaseSaleId: x.itemMasterPurchaseSaleId,
                    isDeleted: x.isDeleted,
                    PP_UOMId: x.pP_UOMId,
                    PP_CurrencyId: x.pP_CurrencyId,
                    PP_FXRatePerc: x.pP_FXRatePerc,
                    PP_VendorListPrice: x.pP_VendorListPrice ? formatNumberAsGlobalSettingsModule(x.pP_VendorListPrice, 2) : '0.00',
                    PP_LastListPriceDate: x.pP_LastListPriceDate,
                    PP_PurchaseDiscPerc: x.pP_PurchaseDiscPerc,
                    PP_LastPurchaseDiscDate: x.pP_LastPurchaseDiscDate,
                    PP_PurchaseDiscAmount: x.pP_PurchaseDiscAmount ? formatNumberAsGlobalSettingsModule(x.pP_PurchaseDiscAmount, 2) : '0.00',
                    PP_UnitPurchasePrice: x.pP_UnitPurchasePrice ? formatNumberAsGlobalSettingsModule(x.pP_UnitPurchasePrice, 2) : '0.00',
                    SP_FSP_UOMId: x.sP_FSP_UOMId,
                    SP_FSP_CurrencyId: x.sP_FSP_CurrencyId,
                    SP_FSP_FXRatePerc: x.sP_FSP_FXRatePerc,
                    SP_FSP_FlatPriceAmount: x.sP_FSP_FlatPriceAmount ? formatNumberAsGlobalSettingsModule(x.sP_FSP_FlatPriceAmount, 2) : '0.00',
                    SP_FSP_LastFlatPriceDate: x.sP_FSP_LastFlatPriceDate,
                    SP_CalSPByPP_MarkUpPercOnListPrice: x.sP_CalSPByPP_MarkUpPercOnListPrice,
                    SP_CalSPByPP_MarkUpAmount: x.sP_CalSPByPP_MarkUpAmount ? formatNumberAsGlobalSettingsModule(x.sP_CalSPByPP_MarkUpAmount, 2) : '0.00',
                    SP_CalSPByPP_LastMarkUpDate: x.sP_CalSPByPP_LastMarkUpDate,
                    SP_CalSPByPP_BaseSalePrice: x.sP_CalSPByPP_BaseSalePrice ? formatNumberAsGlobalSettingsModule(x.sP_CalSPByPP_BaseSalePrice, 2) : '0.00',
                    SP_CalSPByPP_SaleDiscPerc: x.sP_CalSPByPP_SaleDiscPerc,
                    SP_CalSPByPP_SaleDiscAmount: x.sP_CalSPByPP_SaleDiscAmount ? formatNumberAsGlobalSettingsModule(x.sP_CalSPByPP_SaleDiscAmount, 2) : '0.00',
                    SP_CalSPByPP_LastSalesDiscDate: x.sP_CalSPByPP_LastSalesDiscDate,
                    SP_CalSPByPP_UnitSalePrice: x.sP_CalSPByPP_UnitSalePrice ? formatNumberAsGlobalSettingsModule(x.sP_CalSPByPP_UnitSalePrice, 2) : '0.00',
                    SalePriceSelectId: parseInt(x.salePriceSelectId),
                    isEditable : false,
                    isNewItem: false
                }
            })
            this.fieldArray = [];
            if(value) {
                this.originalPurchaseSaleList.map(x => {
                    if(x.isDeleted) {
                        this.fieldArray.push(x);
                    }
                });
            } else {
                this.originalPurchaseSaleList.map(x => {
                    if(!x.isDeleted) {
                        this.fieldArray.push(x);
                    }
                });
            }
            this.isSpinnerVisible = false;
        }, error=> {
            this.isSpinnerVisible = false;
        })        
    }

    restorePurchaseSaleRow(field) {
        this.restorePSRecordRow = {
            ...field,
            conditionName: getValueFromArrayOfObjectById('label', 'value', field.ConditionId, this.conditionList)
        };
    }

    CurrencyData(strText = '') {
        if(this.arrayCurrancylist.length == 0) {			
            this.arrayCurrancylist.push(0); }
          this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', strText, false, 0, this.arrayCurrancylist.join(),this.currentUserMasterCompanyId).subscribe(res => {
            this.allCurrencyInfo = res;
            this.purchaseCurrencyInfo = this.allCurrencyInfo;
            this.salesCurrencyInfo = this.allCurrencyInfo;
          }, error => {this.isSpinnerVisible=false});
    }

    Restore(rowData){
        this.rowDataToDelete = rowData;
        $("#aircraftRestore").modal("show");
    }
    deleteataRow(rowData) {
        this.rowDataToDelete = rowData;
    }
    deleteAircraftRow(rowData){
        this.rowDataToDelete = rowData;
    }

    RestoreATA(rowData){
        this.rowDataToDelete = rowData;
        $("#ataRestore").modal("show");
    }
    
    closeRestore() {
        $("#aircraftRestore").modal("hide");
    } 
    closeATARestore() {
        $("#ataRestore").modal("hide");
    } 
    restorePurchaseSaleRowRecord(value) {
        if(value == 'Yes') {
            this.commonService.updatedeletedrecords('ItemMasterPurchaseSale', 'ItemMasterPurchaseSaleId',this.restorePSRecordRow.itemMasterPurchaseSaleId).subscribe(res => {
                this.getPurchaseSalesDetailById(this.itemMasterId, 'restore');
                this.alertService.showMessage("Success", `Successfully Restored Record`, MessageSeverity.success);
            })
        } else {
            this.restorePSRecordRow = undefined;
        }
    }

    editPandSales(index){
        this.disablepurchaseSales = false;
        if(this.fieldArray[index].isEditable == false){
            this.fieldArray[index].isEditable = true;          
        }
         else {
            this.fieldArray[index].isEditable = false;
         }
    }

    private loadSiteData() {
          this.commonService.autoSuggestionSmartDropDownList('Site', 'SiteId', 'Name','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {               
            this.allSites = res;
        })
    }
    
    siteValueChange(value?) //Site Valu Selection in Form
    {
        this.wareHouseData = [];
        this.locationData = [];
        this.shelfData = [];
        this.binData = [];
        if(value == 'reset') {
            this.sourceItemMaster.warehouseId = null;
            this.sourceItemMaster.locationId = null;
            this.sourceItemMaster.shelfId = null;
            this.sourceItemMaster.binId = null;
        }

        if(this.sourceItemMaster.siteId) {
			this.commonService.smartDropDownList('Warehouse', 'WarehouseId', 'Name', this.authService.currentUser.masterCompanyId,'SiteId', this.sourceItemMaster.siteId,0).subscribe(res => {
				this.wareHouseData = res;
			})
		}
    }
    wareHouseValueChange(value?) //Site Valu Selection in Form
    {
        this.locationData = [];
        this.shelfData = [];
        this.binData = [];
        if(value == 'reset') {
            this.sourceItemMaster.locationId = null;
            this.sourceItemMaster.shelfId = null;
            this.sourceItemMaster.binId = null;
        }        

        if(this.sourceItemMaster.warehouseId) {
			this.commonService.smartDropDownList('Location', 'LocationId', 'Name',this.authService.currentUser.masterCompanyId, 'WarehouseId', this.sourceItemMaster.warehouseId,0).subscribe(res => {
				this.locationData = res;
			})
		}
    }
    locationValueChange(value?) //Site Valu Selection in Form
    {
        this.shelfData = [];
        this.binData = [];
        if(value == 'reset') {
            this.sourceItemMaster.shelfId = null;
            this.sourceItemMaster.binId = null;
        }        

        if(this.sourceItemMaster.locationId) {
			this.commonService.smartDropDownList('Shelf', 'ShelfId', 'Name' ,this.authService.currentUser.masterCompanyId, 'LocationId', this.sourceItemMaster.locationId,0).subscribe(res => {
				this.shelfData = res;
			})
		}
    }
    shelfValueChange(value?) //Site Valu Selection in Form
    {
        this.binData = [];
        if(value == 'reset') {
            this.sourceItemMaster.binId = null;
        }
        if(this.sourceItemMaster.shelfId) {
			this.commonService.smartDropDownList('Bin', 'BinId', 'Name',this.authService.currentUser.masterCompanyId, 'ShelfId', this.sourceItemMaster.shelfId,0).subscribe(res => {
				this.binData = res;
			})
		}
    }
    // errorMessageHandler(log) {
    //     this.alertService.showMessage(
    //         'Error',
    //         log.error.error,
    //         MessageSeverity.error
    //     );
    // }

    // Form array for capability//
    get mfgFormArray(): FormArray {
        return this.capabilitiesForm.get('mfgForm') as FormArray;
    }

    get overhaulFormArray(): FormArray {
        return this.capabilitiesForm.get('overhaulForm') as FormArray;
    }


    get distributionFormArray(): FormArray {
        return this.capabilitiesForm.get('distributionForm') as FormArray;
    }

    get certificationFormArray(): FormArray {
        return this.capabilitiesForm.get('certificationForm') as FormArray;
    }

    get repairFormArray(): FormArray {
        return this.capabilitiesForm.get('repairForm') as FormArray;
    }

    get exchangeFormArray(): FormArray {
        return this.capabilitiesForm.get('exchangeForm') as FormArray;
    }

    // get All Aircraft 
    private aircraftManfacturerData() {
        this.isSpinnerVisible = true;
          this.commonService.autoSuggestionSmartDropDownList('AircraftType', 'AircraftTypeId', 'Description','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {
            this.allaircraftInfo = res;
            this.manufacturerData = res;
            this.isSpinnerVisible = false;
        },error => {this.isSpinnerVisible=false})
    }

    changeValueStringToInt(value) {

        return parseFloat(value);
    }
    
    onChangeUnitPurchasePriceCurrency(field){
        field.SP_FSP_CurrencyId = field.PP_CurrencyId 
    }

    markupListPrice() {
        this.markupListPriceValue = true;
        this.markUpListPriceAfterDiskValue = false;
    }

    ViewFunction() {

        alert("functionality not yet implemented");
    }

    //loading aircraftmodels data//
    getAircraftModelsData(): any {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        if(this.sourceItemMaster.itemMasterId){
            this.itemser.getAircaftList(this.sourceItemMaster.itemMasterId).subscribe(
                results => this.onAircarftmodelloadsuccessfull(results[0]),
                error => {this.isSpinnerVisible = false;}
            );
        } else {
            this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        }
        
    }

    onItemClassificationChange(){
        this.selectedItemClassificationName = getValueFromArrayOfObjectById('label', 'value', this.sourceItemMaster.itemClassificationId, this.allitemclassificationInfo)  
        this.sourceItemMaster.itemClassification = this.selectedItemClassificationName;
    }
    getManufacturer(val){
        this.sourceItemMaster.manafacturer = getValueFromArrayOfObjectById('label', 'value', this.sourceItemMaster.manufacturerId, this.allManufacturerInfo)  
    }
    
    enableDisableAdvancedSearch(val) {
        this.showAdvancedSearchCard = val;
        this.selectAircraftManfacturer = '';
        this.selectedAircraftModel = [];
        this.selectedDashNumbers = [];
        this.aircraftManfacturerIdsUrl = '';
        this.aircraftModelsIdUrl = '';
        this.dashNumberIdUrl = '';
        this.getAircraftMappedDataByItemMasterId();
    }
    enableDisableAdvancedSearchAtaChapter(val) {
        this.showAdvancedSearchCardAtaChapter = val;
        this.selectedATAchapter = [];
        this.selectedATASubChapter = [];
        this.getATAMappedDataByItemMasterId();
    }

    private onAircarftmodelloadsuccessfull(allWorkFlows: any[]) {
        for (let i = 0; i < allWorkFlows.length; i++) {
            allWorkFlows[i].checkbox = true;
        }
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.allAircraftsGet = allWorkFlows;
        this.currentItemMasterModels = allWorkFlows;//All Models Data which has for Current Item Master Id
        this.allCurrentItemMasterModels = allWorkFlows;
        if (this.allAircraftsGet.length > 0) {
            this.enablePlus = true;
            this.allAircraftinfo = JSON.parse(JSON.stringify(this.allAircraftsGet));
            this.isDeleteMode = false;
            this.isEditMode = false;
            this.isEnabeCapes = true;
        }
    }

    alterPnHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    this.disableSaveAlterumber = false;
                }
                else {
                    this.disableSaveAlterumber = true;
                }
            }

        }
    }


    onAlterPnSelect(event) {
        if (this.itemclaColl) {
            for (let i = 0; i < this.itemclaColl.length; i++) {
                if (event == this.itemclaColl[i][0].partName) {
                    this.sourceItemMaster.partId = this.itemclaColl[i][0].partId;
                    this.disableSaveAlterumber = false;
                    this.selectedActionName = event;
                }
            }
        }
    }

    markUpListPriceAfterDisk() {
        this.markupListPriceValue = false;
        this.markUpListPriceAfterDiskValue = true;
    }

    onChange(deviceValue) {
        alert(deviceValue);
        this.sourceItemMaster.ataMainId = deviceValue;
    }
    onFixedSalesPrice() {
        this.sourceItemMaster.salesIsFixedPrice = true;
        this.fixedSalesPriceValue = true;
        this.calculateUsingPurchasePrice = false;
    }

    onCalculatedUsingPurchasePrice() {
        this.fixedSalesPriceValue = false;
        this.calculateUsingPurchasePrice = true;
    }

    stock() {
        this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-stock');
    }

    nonStock() {
        this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-non-stock');
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    public allWorkFlows: any[] = [];

    public allWorkFlowValues: Integration[] = [];

    //loading itemClassification data//
     itemclass() {
         this.itemser.getItemMasterClassificationByType('stock',this.currentUserMasterCompanyId).subscribe(res => {
            this.allitemclassificationInfo = res;
         })
    }

    private onDataLoadSuccessful(allWorkFlows: ItemClassificationModel[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allitemclassificationInfo = allWorkFlows;
    }

    //loading GlAccount from generalLedger//
    private glList() {
        this.commonService.getGlAccountList(this.currentUserMasterCompanyId).subscribe(res => {
            this.allGlInfo = res;
        })
    }

    manufacturerdata() {
        if(this.arrayManufacturelist.length == 0) {			
            this.arrayManufacturelist.push(0); }
        this.commonService.autoSuggestionSmartDropDownList('Manufacturer', 'manufacturerId', 'name', '', false, 0, this.arrayManufacturelist.join(),this.currentUserMasterCompanyId).subscribe(res => {
            this.allManufacturerInfo = res;
        });
    }

    aircraftModalChange(event, capData) {
        let selectedData = event.value;
        capData.selectedModel = [];
        selectedData.forEach(element1 => {
            capData.selectedAircraftDataModels.forEach(element2 => {
                if (element1 == element2.value) {
                    capData.selectedModel.push(element2);
                }
            })
        })
    }

    addModels(capData) {
        this.capabilityTypeData.for
        let capbilitiesObj = new ItemMasterCapabilitiesModel;
        capData.selectedManufacturer.forEach(element1 => {
            capbilitiesObj.itemMasterId = this.ItemMasterId;
            capbilitiesObj.aircraftTypeId = element1.value;
            capbilitiesObj.aircraftTypeName = element1.label;
            capbilitiesObj.capabilityTypeId = capData.CapabilityTypeId;
            capbilitiesObj.aircraftManufacturer = element1.label;
            capData.selectedModel.forEach(element2 => {
                if (element2.aircraftTypeId == element1.value) {
                    capbilitiesObj.aircraftModelName = element2.label;
                    capbilitiesObj.aircraftModelId = element2.value;
                    let mfObj = this.formBuilder.group(capbilitiesObj);
                    switch (capData.formArrayName) {
                        case "mfgForm":
                            let mfgItemExisted = this.checkIsExisted(element1.value, element2.value, this.mfgFormArray, this.capabilityTypeData[0]);
                            if (mfgItemExisted == false) {
                                this.mfgFormArray.push(mfObj);
                                let mfgIndex = this.mfgFormArray.controls.length - 1;
                                this.mfgFormArray.controls[mfgIndex]['buList'] = [];
                                this.mfgFormArray.controls[mfgIndex]['departmentList'] = [];
                                this.mfgFormArray.controls[mfgIndex]['divisionlist'] = [];
                            }


                            break;
                        case "overhaulForm":
                            let oralItemExisted = this.checkIsExisted(element1.value, element2.value, this.overhaulFormArray, this.capabilityTypeData[1]);
                            if (oralItemExisted == false) {
                                this.overhaulFormArray.push(mfObj);
                                let overIndex = this.overhaulFormArray.controls.length - 1;
                                this.overhaulFormArray.controls[overIndex]['buList'] = [];
                                this.overhaulFormArray.controls[overIndex]['departmentList'] = [];
                                this.overhaulFormArray.controls[overIndex]['divisionlist'] = [];
                            }
                            break;
                        case "distributionForm":
                            let distExisted = this.checkIsExisted(element1.value, element2.value, this.distributionFormArray, this.capabilityTypeData[2]);
                            if (distExisted == false) {
                                this.distributionFormArray.push(mfObj);
                                let distIndex = this.distributionFormArray.controls.length - 1;
                                this.distributionFormArray.controls[distIndex]['buList'] = [];
                                this.distributionFormArray.controls[distIndex]['departmentList'] = [];
                                this.distributionFormArray.controls[distIndex]['divisionlist'] = [];
                            }
                            break;
                        case "certificationForm":
                            let certExisted = this.checkIsExisted(element1.value, element2.value, this.certificationFormArray, this.capabilityTypeData[3]);
                            if (certExisted == false) {
                                this.certificationFormArray.push(mfObj);
                                let certIndex = this.certificationFormArray.controls.length - 1;
                                this.certificationFormArray.controls[certIndex]['buList'] = [];
                                this.certificationFormArray.controls[certIndex]['departmentList'] = [];
                                this.certificationFormArray.controls[certIndex]['divisionlist'] = [];
                            }
                            break;
                        case "repairForm":
                            let repairExisted = this.checkIsExisted(element1.value, element2.value, this.repairFormArray, this.capabilityTypeData[4]);
                            if (repairExisted == false) {
                                this.repairFormArray.push(mfObj);
                                let repIndex = this.repairFormArray.controls.length - 1;
                                this.repairFormArray.controls[repIndex]['buList'] = [];
                                this.repairFormArray.controls[repIndex]['departmentList'] = [];
                                this.repairFormArray.controls[repIndex]['divisionlist'] = [];
                            }
                            break;
                        case "exchangeForm":
                            let exchangeExisted = this.checkIsExisted(element1.value, element2.value, this.exchangeFormArray, this.capabilityTypeData[5]);
                            if (exchangeExisted == false) {
                                this.exchangeFormArray.push(mfObj);
                                let excngIndex = this.exchangeFormArray.controls.length - 1;
                                this.exchangeFormArray.controls[excngIndex]['buList'] = [];
                                this.exchangeFormArray.controls[excngIndex]['departmentList'] = [];
                                this.exchangeFormArray.controls[excngIndex]['divisionlist'] = [];
                            }
                            break;
                    }
                }

            });
        });

    }


    manufacturerChange(event, capData) {
        let selectedData = event.value;
        capData.selectedManufacturer = [];
        selectedData.forEach(element1 => {
            this.manufacturerData.forEach(element2 => {
                if (element1 == element2.value) {
                    capData.selectedManufacturer.push(element2);
                }
            })
        })
    }

    resetFormArray(capData) {
        switch (capData.formArrayName) {
            case "mfgForm":
                this.mfgFormArray.controls = [];
                break;
            case "overhaulForm":
                this.overhaulFormArray.controls = [];
                break;
            case "distributionForm":
                this.distributionFormArray.controls = [];
                break;
            case "certificationForm":
                this.certificationFormArray.controls = [];
                break;
            case "repairForm":
                this.repairFormArray.controls = [];
                break;
            case "exchangeForm":
                this.exchangeFormArray.controls = [];
                break;
        }
    }

    private ptnumberlistdata() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.itemser.getActivePartListByItemType('stock',this.currentUserMasterCompanyId).subscribe(
            results => this.onptnmbersSuccessful(results),
            error => {this.isSpinnerVisible = false;}
        )
    }

    private onptnmbersSuccessful(allWorkFlows: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.allPartnumbersInfo = allWorkFlows;
        this.oempnCollection = allWorkFlows.map(x => {
            return {
                value: x.itemMasterId,
                label: `${x.partNumber} - ${x.partDescription}`,
                partNumber: x.partNumber
            }
        });
       
        this.revisedPartNumbersList = [];
        for (let i = 0; i < allWorkFlows.length; i++) {
            if (this.isEdit == true) {
                if (allWorkFlows[i].itemMasterId != this.itemMasterId) {
                    this.revisedPartNumbersList.push({
                        itemMasterId: allWorkFlows[i].itemMasterId,
                        partNumber: allWorkFlows[i].partNumber
                    })
                }
            } else {
                this.revisedPartNumbersList.push({
                    itemMasterId: allWorkFlows[i].itemMasterId,
                    partNumber: allWorkFlows[i].partNumber
                })
            }
        }
        this.allpnNumbers = this.allPartnumbersInfo;
    }

    private Purchaseunitofmeasure() {
       // this.commonService.smartDropDownWithStatusList('UnitOfMeasure', 'unitOfMeasureId', 'shortname', '', 1, 0).subscribe(res => {
        this.commonService.autoSuggestionSmartDropDownList('UnitOfMeasure', 'unitOfMeasureId', 'shortname','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {
            this.allPurchaseUnitOfMeasureinfo = res;
            this.allStockUnitOfMeasureinfo = this.allPurchaseUnitOfMeasureinfo;
            this.allConsumeUnitOfMeasureinfo = this.allPurchaseUnitOfMeasureinfo;
            this.allWeightUnitOfMeasureInfo = this.allPurchaseUnitOfMeasureinfo;
            this.allExportUnitOfMeasureInfo = this.allPurchaseUnitOfMeasureinfo;
            this.allSizeUnitOfMeasureInfo = this.allPurchaseUnitOfMeasureinfo;            
        })
    }

    unitmeasure(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.sourceUOM = new UnitOfMeasure();
        this.sourceUOM.isActive = true;
        this.unitName = "";
        this.standard = "";
        this.shortName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }




    private priorityData() {
        //this.commonService.smartDropDownWithStatusList('Priority', 'priorityId', 'description', '', 1, 0).subscribe(res => {
         this.commonService.autoSuggestionSmartDropDownList('Priority', 'priorityId', 'description','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {
            this.allPriorityInfo = res;            
        })
    }

     itemgroup(type) {
        //this.commonService.smartDropDownWithStatusList('ItemGroup', 'itemGroupId', 'description', 10, 1, 0).subscribe(res => {
            this.commonService.autoSuggestionSmartDropDownList('ItemGroup', 'itemGroupId', 'ItemGroupCode','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {
            this.allitemgroupobjInfo = res;            
        })
    }

    private onDataLoadFailed(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
    }

    openCapes(content) {
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    saverange(selectedRow) {
        let ischange = false;
        if (this.selectedModels.length > 0) {
            this.selectedModels.map((row) => {
                if (selectedRow.aircraftModelId == row.aircraftModelId) {
                    row = selectedRow;
                    ischange = true;
                }
            });
        }
        if (!ischange) {
            this.selectedModels.push(selectedRow);
        }

    }
    parsedText(text) {
        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }

    priorty(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.sourceAction = new Priority();
        this.sourceAction.isActive = true;
        this.priorityName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }


    atamai(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.sourceAction = new ATAMain();
        this.sourceAction.isActive = true;
        this.ataChapterName = "";
        this.modal = this.modalService.open(content, { size: 'sm' });
    }

    item(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.sourceAction = new Itemgroup();
        this.sourceAction.isActive = true;
        this.itemGroupName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    waning(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    integratn(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.sourceAction = new Integration();
        this.sourceAction.isActive = true;
        this.integrationName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    eventHandler(event) {           
        if (event.target.value.trim() != "") {
            for(let i=0; i<this.allPartnumbersInfo.length; i++){
                if(event.target.value.trim().toLowerCase() == this.allPartnumbersInfo[i].partNumber.toLowerCase() && event.target.value.trim() != this.selectedPartNumber){
                    this.disableSavepartNumber = true;
                    break;
                }
                else {
                    this.disableSavepartNumber = false;
                }                
            }
        } else {
            this.disableSavepartNumber = false;
        }
    }

    ManufacturerHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    this.disableManufacturer = true;
                }
                else {
                    this.disableManufacturer = false;
                }
            }

        }
    }

    pmeventHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    this.disableSavepn = true;
                }
                else {
                    this.disableSavepn = false;
                }
            }

        }
    }

    rqeventHandler(event) {
        if (event.target.value != "") {
            let rqValue = Number(event.target.value);
            let mqValue = this.sourceItemMaster.minimumOrderQuantity;
            //if(rqValue < mqValue)
            if(this.sourceItemMaster.reorderQuantiy < this.sourceItemMaster.minimumOrderQuantity )
            {
                this.disableReorderQuantiy = true;                
            }
            else{
                this.disableReorderQuantiy = false;                 
            }
        }
    }


    private onpartnumberloadsuccessfull(allWorkFlows: any[]) {

        this.descriptionbyPart = allWorkFlows[0];
        this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'partDescription', this.sourceItemMaster.partNumber.value, false, DBkeys.AUTO_COMPLETE_COUNT_LENGTH,'',this.currentUserMasterCompanyId).subscribe(res => {
        });
    }


    partnmId(event) {
        if (this.itemclaColl) {           
            for(let i=0; i<this.partCollection.length; i++){
                if(event == this.partCollection[i] && event != this.selectedPartNumber){
                    this.disableSavepartNumber = true;
                    this.selectedActionName = event;
                    return;
                }
                else {
                    this.disableSavepartNumber = false;
                }                
            }
            this.itemser.getDescriptionbypart(event).subscribe(
                results => this.onpartnumberloadsuccessfull(results[0]),
                error => {this.isSpinnerVisible = false;}
            );
        }
    }

    pnId(event) {
        if (this.oempnNumber) {
            for (let i = 0; i < this.oempnNumber.length; i++) {
                if (event == this.oempnNumber[i][0].partName) {
                    this.sourceItemMaster.partId = this.oempnNumber[i][0].partId;
                    this.disableSavepn = true;
                    this.selectedActionName = event;
                }
            }
        }
    }

    manufacturerId(event) {
        if (this.manufacturerNumber) {
            for (let i = 0; i < this.manufacturerNumber.length; i++) {
                if (event == this.manufacturerNumber[i][0].name) {
                    this.sourcemanufacturer.name = this.manufacturerNumber[i][0].name;
                    this.disableManufacturer = true;
                    this.selectedActionName = event;
                }
            }
        }
    }

    partEventHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    this.disableSavepartNumber = true;
                }
                else {
                    this.disableSavepartNumber = false;
                    this.sourceItemMasterCap.partDescription = "";
                }
            }
        }
    }
    
    
    ItemHandler(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.allitemclassificationInfo, false);

        if (exists.length > 0) {

            this.disableClassdesc = true;
            this.disableSaveItemClassficationCodeMsg = true;
        }
        else {
            this.disableClassdesc = false;
            this.disableSaveItemClassficationCodeMsg = false;
        }

    }


    ItemClassficationCode(event) {
        for (let i = 0; i < this.allitemclassificationInfo.length; i++) {
            if (event == this.allitemclassificationInfo[i].itemClassificationCode) {
                this.sourceItemMaster.itemClassificationCode = this.allitemclassificationInfo[i].itemClassificationCode;
                this.disableSaveItemClassficationCode = true;
                this.selectedItemCode = event;
            }
        }
    }

    filterItems(event) {

        this.localCollection = [];

        for (let i = 0; i < this.allitemclassificationInfo.length; i++) {
            let itemName = this.allitemclassificationInfo[i].itemClassificationCode;
            if (itemName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(itemName);
            }
        }
    }
    ItemGroupHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedItemGroup) {
                if (value == this.selectedItemGroup.toLowerCase()) {
                    this.disableSaveItemGroup = true;
                }
                else {
                    this.disableSaveItemGroup = false;

                }
            }

        }
    }

    itemGroupCode(event) {
        if (this.allitemgroupobjInfo) {
            for (let i = 0; i < this.allitemgroupobjInfo.length; i++) {
                if (event == this.allitemgroupobjInfo[i].itemGroupCode) {
                    this.sourceItemMaster.itemGroupCode = this.allitemgroupobjInfo[i].itemGroupCode;
                    this.disableSaveItemGroup = true;
                    this.selectedItemGroup = event;
                }
            }
        }
    }

    Manufacturerdescription(event) {
        if (this.allManufacturerInfo) {
            for (let i = 0; i < this.allManufacturerInfo.length; i++) {
                if (event == this.allManufacturerInfo[i].name) {
                    this.disableSaveManufacturer = true;
                    this.selectedManufacturer = event;
                }
            }
        }
    }

    ATAChapterHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedATAChapter) {
                if (value == this.selectedATAChapter.toLowerCase()) {
                    this.disableSaveATAChapter = true;
                }
                else {
                    this.disableSaveATAChapter = false;

                }
            }
        }
    }

    PriorityHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedPriority) {
                if (value == this.selectedPriority.toLowerCase()) {
                    this.disableSavePriority = true;
                }
                else {
                    this.disableSavePriority = false;
                }
            }
        }
    }


    Prioritydescription(event) {
        if (this.allPriorityInfo) {

            for (let i = 0; i < this.allPriorityInfo.length; i++) {
                if (event == this.allPriorityInfo[i].description) {
                    this.sourceItemMaster.description = this.allPriorityInfo[i].description;
                    this.disableSavePriority = true;
                    this.selectedPriority = event;
                }
            }
        }
    }

    PurchaseUOMHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedPurchaseUOM) {
                if (value == this.selectedPurchaseUOM.toLowerCase()) {
                    this.disableSavePurchaseUOM = true;
                }
                else {
                    this.disableSavePurchaseUOM = false;
                }
            }
        }
    }

    PurchaseUOMdescription(event) {
        if (this.allPurchaseUnitOfMeasureinfo) {

            for (let i = 0; i < this.allPurchaseUnitOfMeasureinfo.length; i++) {
                if (event == this.allPurchaseUnitOfMeasureinfo[i].description) {
                    this.sourceItemMaster.itemClassificationCode = this.allPurchaseUnitOfMeasureinfo[i].description;
                    this.disableSavePurchaseUOM = true;
                    this.selectedPurchaseUOM = event;
                }

            }
        }
    }

    StockUOMHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedStockUOM) {
                if (value == this.selectedStockUOM.toLowerCase()) {
                    this.disableSaveStockUOM = true;
                }
                else {
                    this.disableSaveStockUOM = false;
                }
            }

        }
    }

    StockUOMdescription(event) {
        if (this.allStockUnitOfMeasureinfo) {
            for (let i = 0; i < this.allStockUnitOfMeasureinfo.length; i++) {
                if (event == this.allStockUnitOfMeasureinfo[i].description) {
                    this.sourceItemMaster.itemClassificationCode = this.allStockUnitOfMeasureinfo[i].description;
                    this.disableSaveStockUOM = true;
                    this.selectedStockUOM = event;
                }

            }
        }
    }
    ConsumeUOMHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedConsume) {
                if (value == this.selectedConsume.toLowerCase()) {
                    this.disableSaveConsume = true;
                }
                else {
                    this.disableSaveConsume = false;
                }
            }
        }
    }


    SOLDUOMHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedSOLD) {
                if (value == this.selectedSOLD.toLowerCase()) {
                    this.disableSaveSOLD = true;
                }
                else {
                    this.disableSaveSOLD = false;
                }
            }

        }
    }

    IntegrationHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedIntegration) {
                if (value == this.selectedIntegration.toLowerCase()) {
                    this.disableSaveIntegration = true;
                }

                else {
                    this.disableSaveIntegration = false;
                }
            }

        }
    }



    Integrationdescription(event) {

        if (this.allIntegrationInfo) {

            for (let i = 0; i < this.allIntegrationInfo.length; i++) {
                if (event == this.allIntegrationInfo[i].description) {
                    this.sourceItemMaster.description = this.allIntegrationInfo[i].description;
                    this.disableSaveIntegration = true;
                    this.selectedIntegration = event;
                }

            }
        }
    }


    openDelete(content, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }


    openEdit(content, row) {
        this.disabletypeSave = false;
        this.disableClassdesc = false;
        this.disableSaveItemClassficationCode = false;
        this.isEditMode = true;
        this.disableSaveForEdit=true;
        this.isSaving = true;
        this.sourceAction = row;
        this.itemName = this.sourceAction.itemClassificationCode;
        this.className = this.sourceAction.description;
        this.itemTypeName = this.sourceAction.itemType;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openHist(content, row) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.sourceAction = row;
        this.isSaving = true;
        this.workFlowtService.historyAcion(this.sourceAction.itemClassificationId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            error => {this.isSpinnerVisible=false});
    }
    loadModalsForExistingRecords(capData) {
        if (capData.selectedAircraftTypes.length > 0) {

            let arr = [];
            capData.selectedAircraftTypes.forEach(element => {
                arr.push(element);
            });
            var selectedvalues = arr.join(",");
            this.itemser.getAircraftTypes(selectedvalues).subscribe(
                results => this.onDataLoadaircrafttypeSuccessfulForExisting(results[0], capData),
                error => {this.isSpinnerVisible = false;}
            );
        }
    }


    private onDataLoadaircrafttypeSuccessfulForExisting(allWorkFlows: any[], capData) //getting Models Based on Manfacturer Selection

    {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        capData.selectedAircraftDataModels = [];
        allWorkFlows.forEach(element => {
            for (let z = 0; z < capData.selectedAircraftModelTypes.length; z++) {
                if (element.aircraftModelId == capData.selectedAircraftModelTypes[z]) {
                    capData.selectedModel.push({ value: element.aircraftModelId, label: element.modelName, aircraftTypeId: element.aircraftTypeId })
                }
            }
            capData.selectedAircraftDataModels.push({ value: element.aircraftModelId, label: element.modelName, aircraftTypeId: element.aircraftTypeId })
        });
        this.displayModalNames(capData);
    }



    displayModalNames(capData) {
        switch (capData.formArrayName) {
            case "mfgForm":
                this.mfgFormArray.controls.forEach(mfg => {
                    mfg['controls']['aircraftModelName'].setValue(this.getAirCraftModalName(capData.selectedAircraftDataModels, mfg['controls']['aircraftModelId'].value));
                    this.mfgFormArray.updateValueAndValidity();
                });
                break;
            case "overhaulForm":
                this.overhaulFormArray.controls.forEach(orl => {
                    orl['controls']['aircraftModelName'].setValue(this.getAirCraftModalName(capData.selectedAircraftDataModels, orl['controls']['aircraftModelId'].value));
                });
                break;
            case "distributionForm":
                this.distributionFormArray.controls.forEach(dist => {
                    dist['controls']['aircraftModelName'].setValue(this.getAirCraftModalName(capData.selectedAircraftDataModels, dist['controls']['aircraftModelId'].value));
                });
                break;
            case "certificationForm":
                this.certificationFormArray.controls.forEach(cert => {
                    cert['controls']['aircraftModelName'].setValue(this.getAirCraftModalName(capData.selectedAircraftDataModels, cert['controls']['aircraftModelId'].value));
                });
                break;
            case "repairForm":
                this.repairFormArray.controls.forEach(rep => {
                    rep['controls']['aircraftModelName'].setValue(this.getAirCraftModalName(capData.selectedAircraftDataModels, rep['controls']['aircraftModelId'].value));
                });
                break;
            case "exchangeForm":
                this.exchangeFormArray.controls.forEach(ex => {
                    ex['controls']['aircraftModelName'].setValue(this.getAirCraftModalName(capData.selectedAircraftDataModels, ex['controls']['aircraftModelId'].value));
                });
                break;
        }

    }


    getAircraftTypeName(aircraftTypeId) {
        let label = "";
        for (let i = 0; i < this.manufacturerData.length; i++) {
            if (this.manufacturerData[i].value == aircraftTypeId) {
                label = this.manufacturerData[i].label
                break;
            }
        }
        return label;
    }


    getAirCraftModalName(modalData, modalId) {
        let label = "";
        for (let i = 0; i < modalData.length; i++) {
            if (modalData[i].value == modalId) {
                label = modalData[i].label
                break;
            }
        }
        return label;
    }


    checkIsExisted(type, modal, myForm, capData) {
        let itemExisted = false;
        myForm.controls.forEach(data => {
            if (data['controls']['aircraftTypeId'].value == type && data['controls']['aircraftModelId'].value == modal) {
                itemExisted = true;
                data['controls']['isDelete'].setValue(false);
            } else {
                let typeId = data['controls']['aircraftTypeId'].value;
                let typeIndex = capData.selectedAircraftTypes.indexOf(typeId);
                if (typeIndex == -1) {
                    data['controls']['isDelete'].setValue(true);
                }
                let modaleId = data['controls']['aircraftModelId'].value;
                let modalIndex = capData.selectedAircraftModelTypes.indexOf(modaleId);
                if (modalIndex == -1) {
                    data['controls']['isDelete'].setValue(true);
                }
            }


        });
        return itemExisted;
    }


    filterUnitOfMeasures(event) {

        this.localunit = [];
        if (this.allUnitOfMeasureinfo) {
            for (let i = 0; i < this.allUnitOfMeasureinfo.length; i++) {
                let unitName = this.allUnitOfMeasureinfo[i].description;
                if (unitName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.localunit.push(unitName);
                }
            }
        }
    }



    filterPurchaseUnitOfMeasures(event) {
        this.localunit = [];
        if (this.allPurchaseUnitOfMeasureinfo) {
            for (let i = 0; i < this.allPurchaseUnitOfMeasureinfo.length; i++) {
                let unitName = this.allPurchaseUnitOfMeasureinfo[i].description;
                if (unitName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.localunit.push(unitName);
                }
            }
        }
    }


    filterStockUnitOfMeasures(event) {

        this.localunit = [];
        if (this.allStockUnitOfMeasureinfo) {
            for (let i = 0; i < this.allStockUnitOfMeasureinfo.length; i++) {
                let unitName = this.allStockUnitOfMeasureinfo[i].description;
                if (unitName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.localunit.push(unitName);
                }
            }
        }
    }


    filterConsumeUnitOfMeasures(event) {

        this.localunit = [];
        if (this.allConsumeUnitOfMeasureinfo) {
            for (let i = 0; i < this.allConsumeUnitOfMeasureinfo.length; i++) {
                let unitName = this.allConsumeUnitOfMeasureinfo[i].description;
                if (unitName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.localunit.push(unitName);
                }
            }
        }
    }


    filterSOLDUnitOfMeasures(event) {

        this.localunit = [];
        if (this.allSOLDUnitOfMeasureinfo) {
            for (let i = 0; i < this.allSOLDUnitOfMeasureinfo.length; i++) {
                let unitName = this.allSOLDUnitOfMeasureinfo[i].description;
                if (unitName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.localunit.push(unitName);
                }
            }
        }
    }

    filterItemgroups(event) {

        this.localgroup = [];
        if (this.allitemgroupobjInfo) {
            for (let i = 0; i < this.allitemgroupobjInfo.length; i++) {
                let itemGroupName = this.allitemgroupobjInfo[i].itemGroupCode;
                if (itemGroupName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.localgroup.push(itemGroupName);
                }
            }
        }
    }
    filterprovisions(event) {
        this.localprovision = [];
        this.ProvisionNumber = [];
        if (this.allProvisonInfo) {
            for (let i = 0; i < this.allProvisonInfo.length; i++) {
                let provisionName = this.allProvisonInfo[i].description;
                if (provisionName) {
                    if (provisionName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                        if (this.allProvisonInfo[i].isActive === true) {
                            this.ProvisionNumber.push([{
                                "provisionId": this.allProvisonInfo[i].provisionId,
                                "provisionName": provisionName
                            }]),
                                this.localprovision.push(provisionName)
                        }
                    }
                }

            }
        }
    }
   
    setvalue() {
        this.markupListPriceValue = true;
    }
    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.workFlowtService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => {this.isSpinnerVisible=false});
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.workFlowtService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => {this.isSpinnerVisible=false});
        }
    }


    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {


        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.auditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.workFlowtService.deleteAcion(this.sourceAction.itemClassificationId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => {this.isSpinnerVisible=false});
        this.modal.close();
    }


    dismissModel() {
        this.updateBtn = true;
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.selectedAtaInformation = {};
        this.ataChapterEditMode = false;
        this.disableManufacturer = false;
        this.disableSaveItemClassficationCode = false;
        this.disableClassdesc = false;
        this.disabletypeSave = false;
        this.disableSaveItemGroup = false;
        this.disableSavePurchaseUOM = false;
        this.disableSaveStockUOM = false;
        this.disableSaveConsume  = false;
        this.sourceAction = {};
        this.unitName = "";
        if(this.modal){
            this.modal.close();
        }       
   
    }
    redirectToAddNewItemMaster(){
        this.dismissModel();
        if(this.updateBtnExp){
            this.changeOfTab('General')
            this.router.navigate(['itemmastersmodule/itemmasterpages/app-item-master-stock']);
        }
        else{
            this.itemMasterId = this._actRoute.snapshot.params['id'];
            const ItemMasterID = this.isEdit === true ? this.itemMasterId : this.collectionofItemMaster.itemMasterId;
            const data = { ...this.exportInfo, 
                createdBy : this.userName,
                updatedBy : this.userName,
                isActive : true,
                isDeleted: false,
                exportSizeHeight: this.exportInfo.exportSizeHeight === undefined || this.exportInfo.exportSizeHeight === null || this.exportInfo.exportSizeHeight === '' ? 0 : this.exportInfo.exportSizeHeight,
                exportSizeLength: this.exportInfo.exportSizeLength === undefined || this.exportInfo.exportSizeLength === null || this.exportInfo.exportSizeLength === '' ? 0 : this.exportInfo.exportSizeLength,
                exportSizeWidth: this.exportInfo.exportSizeWidth === undefined || this.exportInfo.exportSizeWidth === null || this.exportInfo.exportSizeWidth === '' ? 0 : this.exportInfo.exportSizeWidth,
                exportWeight: this.exportInfo.exportWeight === undefined || this.exportInfo.exportWeight === null || this.exportInfo.exportWeight === '' ? 0 : this.exportInfo.exportWeight,

                masterCompanyId: this.currentUserMasterCompanyId,
                exportCountryId: editValueAssignByCondition('value', this.exportInfo['exportCountryId']), 
                itemMasterId: parseInt(ItemMasterID), 
                exportValue: this.exportInfo.exportValue ? parseFloat(this.exportInfo.exportValue.toString().replace(/\,/g,'')) : 0 }

            this.itemser.newItemMasterExportInformation(data).subscribe(datas => {
                this.changeOfTab('General');
                this.tempExportCountryId = null;
                this.alertService.showMessage(
                    'Success',
                    `Saved Export Information Successfully `,
                    MessageSeverity.success
                );
                this.router.navigate(['itemmastersmodule/itemmasterpages/app-item-master-stock']);
            })
        }
    }


    deletehomeFormIndex(rowNumber: number) {
        this.manfacturerAircraftmodelsarray.splice(rowNumber, 1);
        this.changeDetectorRef.detectChanges();
    }



    deleteovhindex(rowNumber: number) {
        this.overhaulAircraftmodelsarray.splice(rowNumber, 1);
        this.changeDetectorRef.detectChanges();
    }


    deletedisindex(rowNumber: number) {
        this.distributionAircraftmodelsarray.splice(rowNumber, 1);
        this.changeDetectorRef.detectChanges();
    }

    deletecertificateindex(rowNumber: number) {
        this.certificationarrayAircraftmodelsarray.splice(rowNumber, 1);
        this.changeDetectorRef.detectChanges();
    }

    deleterepairindex(rowNumber: number) {
        this.repairAircraftmodelsarray.splice(rowNumber, 1);
        this.changeDetectorRef.detectChanges();
    }

    deleteexcahngeindex(rowNumber: number) {
        this.exchangeAircraftmodelsarray.splice(rowNumber, 1);
        this.changeDetectorRef.detectChanges();
    }


    dismissAircraftModel() {
        if (this.selectedModels.length > 0) {
            this.manfacturerAircraftmodelsarray = [];
            this.distributionAircraftmodelsarray = [];
            this.overhaulAircraftmodelsarray = [];
            this.certificationarrayAircraftmodelsarray = [];
            this.repairAircraftmodelsarray = [];
            this.exchangeAircraftmodelsarray = [];
            this.isDeleteMode = false;
            this.isEditMode = false;
            this.modal.close();
            if (this.itemser.isEditMode == false || (this.itemser.isEditMode == true && this.selectedModels.length > 0)) {

                this.manfacturerAircraftmodelsarray = this.manfacturerAircraftDataParsing(JSON.parse(JSON.stringify(this.selectedModels)));
                this.distributionAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
                this.overhaulAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
                this.certificationarrayAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
                this.repairAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
                this.exchangeAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
            }
        }
        this.showInput = true;
        this.modal.close();
    }


    manfacturerAircraftDataParsing(data) {
        if (data) {
            for (let obj of data) {
                obj["bulist"] = []
                obj["departmentList"] = []
                obj["divisionlist"] = []
            }

            return data;
        }
        return null;
    }

    public saveSelectedModel(selectedRow, indeex) {
        var models = this.selectedModels.filter(function (models) {
            return models.aircraftModelId == selectedRow.aircraftModelId
        });

        if (models == undefined || models.length == 0) {
            this.selectedModels.push(selectedRow);
        }
        else {
            this.selectedModels.splice(this.selectedModels.indexOf(models[0], 1));
            this.selectedModels.push(selectedRow);
        }

    }


    public getSelectedItem(selectedRow, event) {
        let ischange = false;
        if (this.selectedModels.length > 0) {
            this.selectedModels.map((row) => {
                if (selectedRow.aircraftModelId == row.aircraftModelId) {
                    row.priority = event.target.value;
                    ischange = true;
                }
            });
        }
        if (!ischange) {
            this.selectedModels.push(selectedRow);
        }
    }

    private saveCompleted(user?: any) {
        this.isSaving = false;

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);

        }

    }
   
    
    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }


    private saveSuccessHelper(role?: any) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);

        this.itemclass();

    }


    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    private savesuccessCompleted(user?: any) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Created ItemMaster General Info Successfully`, MessageSeverity.success);
    }

    saveitemgroup() {
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.itemGroupCode = this.itemGroupName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.itemservice.newAction(this.sourceAction).subscribe(
                data => {
                    this.alertService.showMessage("Success", `Saved Item Group Successfully`, MessageSeverity.success);
                    this.itemgroup(true);
                    
                })
        }
        else {

           this.sourceAction.updatedBy = this.userName;
           this.sourceAction.itemGroupCode = this.itemGroupName;
           this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
           this.itemservice.updateAction(this.sourceAction).subscribe(
               response => this.saveCompleted(this.sourceAction),
               error => {this.isSpinnerVisible=false});
        }

        this.modal.close();
    }

    saveatamain() {
        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.sourceAction.ataChapterName = this.ataChapterName;
            this.ataMainSer.newATAMain(this.sourceAction).subscribe(data => { 
            })

        }
        else {
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.ataChapterName = this.ataChapterName;
            this.ataMainSer.updateATAMain(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => {this.isSpinnerVisible=false});
        }

        this.modal.close();
    }


    savePurchaseunitofmeasure() {


        if (this.isEditMode == false) {
            this.isSaving = true;
            this.disableuomvalue = true;
            this.sourceUOM.createdBy = this.userName;
            this.sourceUOM.updatedBy = this.userName;
            this.sourceUOM.description = this.unitName;
            this.sourceUOM.masterCompanyId = this.currentUserMasterCompanyId;
            this.unitService.newUnitOfMeasure(this.sourceUOM).subscribe(data => {

                this.sourceItemMaster.purchaseUnitOfMeasureId = data.unitOfMeasureId;
            })

        }
        else {
            this.disableuomvalue = false;
            this.sourceUOM.updatedBy = this.userName;
            this.sourceUOM.description = this.unitName;
            this.sourceUOM.masterCompanyId = this.currentUserMasterCompanyId;
            this.unitService.updateUnitOfMeasure(this.sourceUOM).subscribe(data => { 
            });
        }

        this.modal.close();
    }

    saveStockunitofmeasure() {
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.disableuomvalue = false;
            this.sourceUOM.createdBy = this.userName;
            this.sourceUOM.updatedBy = this.userName;
            this.sourceUOM.description = this.unitName;
            this.sourceUOM.masterCompanyId = this.currentUserMasterCompanyId;
            this.unitService.newUnitOfMeasure(this.sourceUOM).subscribe(
                data => {
                    this.sourceItemMaster.stockUnitOfMeasureId = data.unitOfMeasureId;
                },
                response => this.saveCompleted(this.sourceUOM)
            )
        }
        else {
            this.disableuomvalue = false;
            this.sourceUOM.updatedBy = this.userName;
            this.sourceUOM.description = this.unitName;
            this.sourceUOM.masterCompanyId = this.currentUserMasterCompanyId;
            this.unitService.updateUnitOfMeasure(this.sourceUOM).subscribe(
                response => this.saveCompleted(this.sourceUOM),
                error => {this.isSpinnerVisible=false});
        }

        this.modal.close();
    }

    saveConsumeunitofmeasure() {
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.disableuomvalue = false;
            this.sourceUomModel.createdBy = this.userName;
            this.sourceUomModel.updatedBy = this.userName;
            this.sourceUomModel.description = this.unitName;
            this.sourceUomModel.standard = this.standard;
            this.sourceUomModel.shortName = this.shortName;
            this.sourceUomModel.masterCompanyId = this.currentUserMasterCompanyId;
            this.unitService.newUnitOfMeasure(this.sourceUomModel).subscribe(data => {
                this.sourceItemMaster.consumeUnitOfMeasureId = data.unitOfMeasureId;
            }, 
            error => {this.isSpinnerVisible=false});

        }
        else {
            this.disableuomvalue = false;
            this.sourceUOM.updatedBy = this.userName;
            this.sourceUOM.description = this.unitName;
            this.sourceUOM.description = this.unitName;
            this.sourceUOM.standard = this.standard;
            this.sourceUOM.shortName = this.shortName;
            this.sourceUOM.masterCompanyId = this.currentUserMasterCompanyId;
            this.unitService.updateUnitOfMeasure(this.sourceUOM).subscribe(
                response => this.saveCompleted(this.sourceUOM),
                error => {this.isSpinnerVisible=false});
        }

        this.modal.close();
    }

    saveSOLDunitofmeasure() {
        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceUOM.createdBy = this.userName;
            this.sourceUOM.updatedBy = this.userName;
            this.sourceUOM.description = this.unitName;
            this.sourceUOM.masterCompanyId = this.currentUserMasterCompanyId;
            this.unitService.newUnitOfMeasure(this.sourceUOM).subscribe(data => { 
             })

        }
        else {

            this.sourceUOM.updatedBy = this.userName;
            this.sourceUOM.description = this.unitName;
            this.sourceUOM.masterCompanyId = this.currentUserMasterCompanyId;
            this.unitService.updateUnitOfMeasure(this.sourceUOM).subscribe(
                response => this.saveCompleted(this.sourceUOM),
                error => {this.isSpinnerVisible=false});
        }

        this.modal.close();
    }
    savepriority() {
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.priorityName;
            this.priorityService.newPriority({ ...this.sourceAction, isDelete: this.isDeleteMode }).subscribe(
                data => {
                    this.sourceItemMaster.priorityId = data.priorityId;
                    this.loadPriority()
                });
        }
        else {
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.priorityName;
            this.priorityService.updatePriority(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => {this.isSpinnerVisible=false});
        }

        this.modal.close();
    }


    removeFile(file: File, uploader) {
        const index = uploader.files.indexOf(file);
        uploader.remove(index);
    }

    fileUploads(event) {
        if (event.files.length === 0)
            return;
        for (let file of event.files)
            this.formData.append(file.name, file);
    }


    saveintegration() {
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.description;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.inteService.newAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => {this.isSpinnerVisible=false});
        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.integrationName;
            this.inteService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => {this.isSpinnerVisible=false});
        }

        this.modal.close();
    }


    onMarkupAfterDisc(myValue, percentValue) {
        let afterpercent = percentValue / 100;
        let test = afterpercent * myValue;
        this.sourceItemMaster.salesBaselineSalesPrice = myValue - test;
    }


    onMarkupPercentonListprice(myValue, percentValue) {
        let afterpercent = percentValue / 100;
        let test = afterpercent * myValue;
        this.sourceItemMaster.salesBaselineSalesPrice = myValue - test;
    }


    // savemfginfo(partid, itemid, data) {

    //     for (let i = 0; i < data.length; i++) {

    //         if (data[i].atcChapterId1 != null) {
    //             data[i].itemId = itemid;
    //             data[i].partId = partid;
    //             data[i].capabilityTypeId = 1;
    //             data[i].verifiedBy = data[i].verifiedBy1;
    //             data[i].isCMMExist = data[i].isCMMExist1;
    //             data[i].description = data[i].modelname1;
    //             data[i].isCMMExist = data[i].isCMMExist1;
    //             data[i].aTAMainId = data[i].atcChapterId1;
    //             data[i].memo = data[i].memo1;
    //             data[i].aircraftManufacturer = data[i].description;
    //             data[i].aircraftModelId = data[i].aircraftModelId;
    //             data[i].aircraftTypeId = data[i].aircraftTypeId;
    //             data[i].entryDate = data[i].entrydate1;

    //             this.itemser.saveManfacturerinforcapes(data[i]).subscribe(data11 => {
    //                 this.collectionofItemMaster = data11;
    //             })
    //         }
    //     }
    // }


    // saveDistrbution(partid, itemid, data) {

    //     for (let i = 0; i < data.length; i++) {
    //         if (data[i].atcChapterId1 != null) {
    //             data[i].itemId = itemid;
    //             data[i].partId = partid;
    //             data[i].capabilityTypeId = 3;
    //             data[i].verifiedBy = data[i].verifiedBy1;
    //             data[i].isCMMExist = data[i].isCMMExist1;
    //             data[i].description = data[i].modelname1;
    //             data[i].isCMMExist = data[i].isCMMExist1;
    //             data[i].aTAMainId = data[i].atcChapterId1;
    //             data[i].memo = data[i].memo1;
    //             data[i].aircraftManufacturer = data[i].aircraftManufacturer;
    //             data[i].aircraftModelId = data[i].aircraftModelId;
    //             data[i].aircraftTypeId = data[i].aircraftTypeId;
    //             data[i].entryDate = data[i].entrydate1;

    //             this.itemser.saveManfacturerinforcapes(data[i]).subscribe(data11 => {
    //                 this.collectionofItemMaster = data11;
    //             })
    //         }

    //     }
    // }


    // saveovhinfo(partid, itemid, data) {

    //     for (let i = 0; i < data.length; i++) {
    //         if (data[i].atcChapterId1 != null) {
    //             data[i].itemId = itemid;
    //             data[i].partId = partid;
    //             data[i].capabilityTypeId = 2;
    //             data[i].verifiedBy = data[i].verifiedBy1;
    //             data[i].isCMMExist = data[i].isCMMExist1;
    //             data[i].description = data[i].modelname1;
    //             data[i].isCMMExist = data[i].isCMMExist1;
    //             data[i].aTAMainId = data[i].atcChapterId1;
    //             data[i].memo = data[i].memo1;
    //             data[i].aircraftManufacturer = data[i].aircraftManufacturer;
    //             data[i].aircraftModelId = data[i].aircraftModelId;
    //             data[i].aircraftTypeId = data[i].aircraftTypeId;
    //             data[i].entryDate = data[i].entrydate1;

    //             this.itemser.saveManfacturerinforcapes(data[i]).subscribe(data11 => {
    //                 this.collectionofItemMaster = data11;
    //             })
    //         }

    //     }
    // }


    // saverepairinfo(partid, itemid, data) {

    //     for (let i = 0; i < data.length; i++) {
    //         if (data[i].atcChapterId1 != null) {
    //             data[i].itemId = itemid;
    //             data[i].partId = partid;
    //             data[i].capabilityTypeId = 5;
    //             data[i].verifiedBy = data[i].verifiedBy1;
    //             data[i].isCMMExist = data[i].isCMMExist1;
    //             data[i].description = data[i].modelname1;
    //             data[i].isCMMExist = data[i].isCMMExist1;
    //             data[i].aTAMainId = data[i].atcChapterId1;
    //             data[i].memo = data[i].memo1;
    //             data[i].aircraftManufacturer = data[i].aircraftManufacturer;
    //             data[i].aircraftModelId = data[i].aircraftModelId;
    //             data[i].aircraftTypeId = data[i].aircraftTypeId;
    //             data[i].entryDate = data[i].entrydate1;

    //             this.itemser.saveManfacturerinforcapes(data[i]).subscribe(data11 => {
    //                 this.collectionofItemMaster = data11;
    //             })
    //         }

    //     }
    // }
    onChangeExpirationDateAvailable(type){
        this.sourceItemMaster.daysReceived = "";
        this.sourceItemMaster.isReceivedDateAvailable = false;
        this.sourceItemMaster.manufacturingDays = "";
        this.sourceItemMaster.isManufacturingDateAvailable = false;
        this.sourceItemMaster.tagDays = "";
        this.sourceItemMaster.isTagDateAvailable = false;
        this.sourceItemMaster.openDays = "";
        this.sourceItemMaster.isOpenDateAvailable = false;
        this.sourceItemMaster.shippedDays = "";
        this.sourceItemMaster.isShippedDateAvailable = false;
        this.sourceItemMaster.otherDays = "";
        this.sourceItemMaster.isOtherDateAvailable = false;
    }


    // saveexcahneginfo(partid, itemid, data) {

    //     for (let i = 0; i < data.length; i++) {
    //         if (data[i].atcChapterId1 != null) {
    //             data[i].itemId = itemid;
    //             data[i].partId = partid;
    //             data[i].capabilityTypeId = 6;
    //             data[i].verifiedBy = data[i].verifiedBy1;
    //             data[i].isCMMExist = data[i].isCMMExist1;
    //             data[i].description = data[i].modelname1;
    //             data[i].isCMMExist = data[i].isCMMExist1;
    //             data[i].aTAMainId = data[i].atcChapterId1;
    //             data[i].memo = data[i].memo1;
    //             data[i].aircraftManufacturer = data[i].aircraftManufacturer;
    //             data[i].aircraftModelId = data[i].aircraftModelId;
    //             data[i].aircraftTypeId = data[i].aircraftTypeId;
    //             data[i].entryDate = data[i].entrydate1;

    //             this.itemser.saveManfacturerinforcapes(data[i]).subscribe(data11 => {
    //                 this.collectionofItemMaster = data11;
    //             })
    //         }

    //     }
    // }
    // savecertification(partid, itemid, data) {
    //     for (let i = 0; i < data.length; i++) {
    //         if (data[i].atcChapterId1 != null) {
    //             data[i].itemId = itemid;
    //             data[i].partId = partid;
    //             data[i].capabilityTypeId = 4;
    //             data[i].verifiedBy = data[i].verifiedBy1;
    //             data[i].isCMMExist = data[i].isCMMExist1;
    //             data[i].description = data[i].modelname1;
    //             data[i].isCMMExist = data[i].isCMMExist1;
    //             data[i].aTAMainId = data[i].atcChapterId1;
    //             data[i].memo = data[i].memo1;
    //             data[i].aircraftManufacturer = data[i].aircraftManufacturer;
    //             data[i].aircraftModelId = data[i].aircraftModelId;
    //             data[i].aircraftTypeId = data[i].aircraftTypeId;
    //             data[i].entryDate = data[i].entrydate1;

    //             this.itemser.saveManfacturerinforcapes(data[i]).subscribe(data11 => {
    //                 this.collectionofItemMaster = data11;
    //             })
    //         }
    //     }
    // }


    saveAircraftmodelinfo(partid, itemid, data) {
        for (let i = 0; i < data.length; i++) {
            data[i].itemMasterId = itemid;
            this.itemser.saveAircraftinfo(data[i]).subscribe(aircraftdata => {
                this.collectionofItemMaster = aircraftdata;
            })

        }
    }

    // Tabs content display logic -- jyotsna
    moveGeneralInfromation() {
        this.showGeneralData = true;
        this.showpurchaseData = false;
        this.showexportData = false;
        this.showAircraftData = false;
        this.showAtachapter = false;
    }
    pnvalue: any;
    

    moveAircraftInformation() {
        this.pnvalue = this.sourceItemMaster.partNumber;
        this.pnDescription = this.sourceItemMaster.partDescription;
        this.alternatePn = this.sourceItemMaster.partAlternatePartId;
        this.currentDashNumberType = new AircraftDashNumber();       
    }
    LoadValues: any[] = [];
    newValue: any;
    // get aircraft model by type 
    getAircraftModelByManfacturer(value) {
        this.newValue = value.originalEvent.target.textContent;

        if (this.newValue) {
            this.commonService.smartDropDownList('AircraftModel', 'AircraftModelId', 'ModelName' ,this.authService.currentUser.masterCompanyId, 'AircraftTypeId', this.selectedAircraftId).subscribe(res => {
                this.LoadValues = res;
            })
           
            this.selectedModelId = [];
            this.selectedDashnumber = [];
        }
    }
    getAircraftModelByManfacturerforEdit(value) {
        this.LoadDashnumberIds = [];
        this.newValue = value;

        if(this.editAirCraftData.aircraftTypeId != value){
            this.editAirCraftData.aircraftModelId = null;
            this.editAirCraftData.dashNumberId = [];
            this.editAirCraftData.aircraftModel = "";
            this.editAirCraftData.model = "";
            this.editAirCraftData.DashNumber = ""
            this.editAirCraftData.dashNumber = ""

        }

        for(let i=0; i<this.manufacturerData.length; i++){
            if(this.manufacturerData[i].value == this.editAirCraftData.aircraftTypeId){
                this.editAirCraftData.aircraft = this.manufacturerData[i].label
                this.editAirCraftData.aircraftType = this.manufacturerData[i].label
            }
        }
        

        if (this.newValue) {
            this.commonService.smartDropDownList('AircraftModel', 'AircraftModelId', 'ModelName',this.authService.currentUser.masterCompanyId, 'AircraftTypeId', this.editAirCraftData.aircraftTypeId).subscribe(res => {
                this.LoadModelsIds = res;
            })
                      
        }

    }
    selectedAircraftIdvalue: any;
    selectedModelIdvalue: any;
    LoadModelidValues: any[] = [];


    searchByFieldUrlCreateforAircraftInformation() {
        if (this.selectAircraftManfacturer.length > 0) {
            const aircraftTypeIds = this.selectAircraftManfacturer.reduce(
                (acc, value) => {
                    return `${acc},${value}`;
                },
                ''
            );
            this.aircraftManfacturerIdsUrl = aircraftTypeIds.substr(1);
        } else {
            this.aircraftManfacturerIdsUrl = '';
        }

        if (this.selectedAircraftModel.length > 0) {
            const aircraftModelIds = this.selectedAircraftModel.reduce((acc, id) => {
                return `${acc},${id}`;
            }, '');
            this.aircraftModelsIdUrl = aircraftModelIds.substr(1);
        } else {
            this.aircraftModelsIdUrl = '';
        }
        if (this.selectedDashNumbers.length > 0) {
            const dashNumberIds = this.selectedDashNumbers.reduce((acc, id) => {
                return `${acc},${id}`;
            }, '');
            this.dashNumberIdUrl = dashNumberIds.substr(1);
        } else {
            this.dashNumberIdUrl = '';
        }

    }


    // get AircraftModels By manufacturer Type
    async getAircraftModelByManfacturerType() {
        // construct url from array
        await this.searchByFieldUrlCreateforAircraftInformation();
        // reset the dropdowns
        this.selectedAircraftModel = [];
        this.selectedDashNumbers = []
        // checks where multi select is empty or not and calls the service
        if (this.aircraftManfacturerIdsUrl !== '') {

            //this.ataMainSer
            //    .getMultiAirCraftSubDesc(this.ataChapterIdUrl)
            //    .subscribe(atasubchapter => {

            //        const responseData = atasubchapter;

            //        this.atasubchapterValues = responseData.map(x => {
            //            return {
            //                label: x.ataSubChapterCode + ' - ' + x.description,
            //                value: x.ataSubChapterId
            //            };
            //        });
            //    });

            this.commonService.smartDropDownList('AircraftModel', 'AircraftModelId', 'ModelName',this.authService.currentUser.masterCompanyId, 'AircraftTypeId', this.aircraftManfacturerIdsUrl).subscribe(res => {
                this.aircraftModelList = res;
            })

            
        } else {
            this.getAllAircraftModels();
            this.getAllDashNumbers();
        }
    }



    async getDashNumberByManfacturerandModel() {
        // construct url from array
        await this.searchByFieldUrlCreateforAircraftInformation();
        // reset dropdown
        this.selectedDashNumbers = []
        // checks where multi select is empty or not and calls the service

        if (this.aircraftManfacturerIdsUrl !== '' && this.aircraftModelsIdUrl !== '') {
            this.Dashnumservice.getDashNumberByModelTypeId(
                this.aircraftModelsIdUrl,
                this.aircraftManfacturerIdsUrl
            ).subscribe(dashnumbers => {
                const responseData = dashnumbers;
                this.dashNumberList = responseData.map(dashnumbers => {

                    return {
                        label: dashnumbers.dashNumber,
                        value: dashnumbers.dashNumberId
                    };
                });
            });
        }
    }
   


    LoadDashnumberValues: any[] = [];
    
    LoadDashnumber = [];
    newModelValue: any = [];

    // get dashNumbers by Type and Model 
    getDashNumberByTypeandModel(value) {
        this.newModelValue = value.originalEvent.target.textContent;
        this.dashNumberUrl = this.selectedModelId.reduce((acc, obj) => {

            return `${acc},${obj}`
        }, '')
        this.dashNumberUrl = this.dashNumberUrl.substr(1);
        if(this.dashNumberUrl != ""){
            this.Dashnumservice.getDashNumberByModelTypeId(this.dashNumberUrl, this.selectedAircraftId).subscribe(dashnumbers => {
                const responseData = dashnumbers;
                this.LoadDashnumber = responseData.map(dashnumbers => {
                    return {
                        label: dashnumbers.dashNumber,
                        value: dashnumbers.dashNumberId
                    }
                });
            });
        } else {
            this.LoadDashnumber = [];
            this.selectedDashnumber = [];
        }
        
    }

    // get dashNumbers by Type and Model for edit
    getDashNumberByTypeandModelForEdit(value) {
        this.newModelValue = value;
        if(this.editAirCraftData.aircraftModelId && this.editAirCraftData.aircraftTypeId) {
            this.Dashnumservice.getDashNumberByModelTypeId(this.editAirCraftData.aircraftModelId, this.editAirCraftData.aircraftTypeId).subscribe(dashnumbers => {
                const responseData = dashnumbers;
                this.LoadDashnumberIds = responseData.map(dashnumbers => {
                    return {
                        label: dashnumbers.dashNumber,
                        value: dashnumbers.dashNumberId
                    }
                });
                for(let i=0; i<this.LoadModelsIds.length; i++){
                    if(this.LoadModelsIds[i].value == this.editAirCraftData.aircraftModelId){
                        this.editAirCraftData.aircraftModel = this.LoadModelsIds[i].label;
                        this.editAirCraftData.model = this.LoadModelsIds[i].label;
    
                    }
                }             
            });
        }
    }

    //updateAircraftDashNumber
    updateAircraftDashNumber(val){
        for(let i = 0; i<this.LoadDashnumberIds.length; i++){
            if(this.LoadDashnumberIds[i].value == this.editAirCraftData.dashNumberId){
                this.editAirCraftData.DashNumber = this.LoadDashnumberIds[i].label
                this.editAirCraftData.dashNumber = this.LoadDashnumberIds[i].label
            }
        }
    }



    //  search aircraft information by all parameter
    async searchAircraftInformation() {

        await this.searchByFieldUrlCreateforAircraftInformation();
        this.searchAircraftParams = '';

        // checks where multi select is empty or not and calls the service
        if (
            this.aircraftManfacturerIdsUrl !== '' &&
            this.aircraftModelsIdUrl !== '' &&
            this.dashNumberIdUrl !== ''
        ) {
            this.searchAircraftParams = `aircraftTypeID=${this.aircraftManfacturerIdsUrl}&aircraftModelID=${this.aircraftModelsIdUrl}&dashNumberId=${this.dashNumberIdUrl}`;
        }
        // search only by manfacturer and Model and  publicationId
        else if (
            this.aircraftManfacturerIdsUrl !== '' &&
            this.aircraftModelsIdUrl !== ''
        ) {
            this.searchAircraftParams = `aircraftTypeID=${this.aircraftManfacturerIdsUrl}&aircraftModelID=${this.aircraftModelsIdUrl}`;
        } else if (this.aircraftManfacturerIdsUrl !== '') {
            this.searchAircraftParams = `aircraftTypeID=${this.aircraftManfacturerIdsUrl}`;
        }
        // search only by model and publicationId
        else if (this.aircraftModelsIdUrl !== '') {
            this.searchAircraftParams = `aircraftModelID=${this.aircraftModelsIdUrl}`;
        }
        // search only by dashNumber and publicationId
        else if (this.dashNumberIdUrl !== '') {
            this.searchAircraftParams = `dashNumberId=${this.dashNumberIdUrl}`;
        }

        const ItemMasterID = this.isEdit === true ? this.itemMasterId : this.collectionofItemMaster.itemMasterId;

        this.itemser.searchAirMappedByMultiTypeIdModelIDDashID(ItemMasterID, this.searchAircraftParams).subscribe(res => {
            this.aircraftListDataValues = res.map(x => {
                return {
                    aircraft: x.aircraftType,
                    model: x.aircraftModel,
                    dashNumber: x.dashNumber == 'Unknown' ? null : x.dashNumber,
                    memo: x.memo,
                    createdBy: x.createdBy,
                    createdDate: x.createdDate,
                    updatedBy: x.updatedBy,
                    updatedDate: x.updatedDate
                }
            })
            if (this.aircraftListDataValues.length > 0) {
                this.totalAircraftRecords = this.aircraftListDataValues.length;
                this.totalAircraftPages = Math.ceil(this.totalAircraftRecords / this.aircraftTablePageSize);
            }
        });
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    ataChapterPageIndexChange(event) {
        this.ataChapterTablePageSize = event.rows;
    }

    selectedDashnumbervalue(value) {
        this.newDashnumValue = value.originalEvent.target.textContent;
    }

    resetAircraftModelsorDashNumbers() {
        if (this.modelUnknown) {
            this.selectedModelId = [];
            this.selectedDashnumber = [];

        }
        if (this.dashNumberUnknown) {

            this.selectedDashnumber = [];
        }

    }
    checkCanAircraftAddable(){
        if(this.selectedModelId.length > 0 || this.modelUnknown){
            if(this.modelUnknown){
                this.canAddAircraft = true; 
            } else 
            if(this.dashNumberUnknown || this.selectedDashnumber.length > 0){
                this.canAddAircraft = true;
            } else {
                this.canAddAircraft = false;
            }
        }
        else {
            this.canAddAircraft = false;
        }
    }
    checkCanAircraftEditable(){    
        
            if(this.editAirCraftData.aircraftModelId || this.editAirCraftData.modelUnknown){
                if(this.editAirCraftData.modelUnknown){
                    this.canEditAircraft = true; 
                } else 
                if(this.editAirCraftData.isDashNumberUnknown || this.editAirCraftData.dashNumberId > 0){
                    this.canEditAircraft = true;
                } else {
                    this.canEditAircraft = false;
                }
            }
            else {
                if(this.editAircraftTypeID != this.editAirCraftData.aircraftTypeId) {
                    this.canEditAircraft = true;
                }
                else {
                this.canEditAircraft = false; }
            }
    }
    resetAircraftModelsorDashNumbersForEdit() {
        

        if(this.editAirCraftData.isModelUnknown == false){
            this.getAircraftModelByManfacturerforEdit(this.editAirCraftData.aircraftTypeId);
        }
        if(this.editAirCraftData.isDashNumberUnknown == false){
            if(this.editAirCraftData.aircraftModelId){
                this.getDashNumberByTypeandModelForEdit(this.editAirCraftData.aircraftModelId)
            }
        }  

    }

    mapAircraftInformation() {
        this.viewTable = true;
        // Selected All 
        if (this.selectedAircraftId !== undefined && this.selectedModelId !== undefined && this.selectedDashnumber.length > 0) {
            this.Dashnumservice.getAllDashModels(this.dashNumberUrl, this.selectedAircraftId, this.selectedDashnumber).subscribe(aircraftdata => {
                const responseValue = aircraftdata;
                this.aircraftData = responseValue.map(x => {
                    return {
                        AircraftType: x.aircraft,
                        AircraftModel: x.model,
                        DashNumber: x.dashNumber,
                        AircraftModelId: x.modelid,
                        DashNumberId: x.dashNumberId,
                        Memo: '',
                        IsChecked: false
                    }
                })
                this.enableAirCraftSaveButton = true;
                this.saveAircraft()
            })
        }


        if (this.selectedAircraftId !== undefined && this.modelUnknown) {
            this.aircraftData = [{
                AircraftType: this.newValue,
                AircraftModel: 'Unknown',
                DashNumber: 'Unknown',
                AircraftModelId: '',
                DashNumberId: '',
                Memo: '',
                IsChecked: false
            }]
            this.enableAirCraftSaveButton = true;
            this.saveAircraft()
        }

        if (this.selectedAircraftId !== undefined && this.selectedModelId !== undefined && this.dashNumberUnknown) {
            this.aircraftData = this.selectedModelId.map(x => {
                return {
                    AircraftType: this.newValue,
                    AircraftModel: getValueFromArrayOfObjectById('label', 'value', x, this.LoadValues),
                    DashNumber: 'Unknown',
                    AircraftModelId: x, //x.aircraftModelId
                    DashNumberId: '',
                    Memo: '',
                    IsChecked: false
                }
            })
            this.enableAirCraftSaveButton = true;
            this.saveAircraft()
        }
        $('#ModalDashNumber').modal('hide');

    }
    selectedMemo: any;
    saveAircraft() {
        this.isSpinnerVisible = true;

        const ItemMasterID = this.isEdit === true ? this.itemMasterId : this.collectionofItemMaster.itemMasterId;
     
        const data = this.aircraftData.map(obj => {
            return {
                ...obj,
                DashNumberId: obj.DashNumber === 'Unknown' ? null : obj.DashNumberId,
                AircraftModelId: obj.AircraftModel === 'Unknown' ? null : obj.AircraftModelId,
                ItemMasterId: ItemMasterID,
                PartNumber: this.pnvalue,
                MasterCompanyId: this.currentUserMasterCompanyId,
                CreatedBy: this.userName,
                UpdatedBy: this.userName,
                CreatedDate: new Date(),
                UpdatedDate: new Date(),
                AircraftTypeId: this.selectedAircraftId,
                IsActive: true,
                IsDeleted: false

            }
        })
      
        this.itemser.newItemMasterAircarftClass(data).subscribe(datas => {
            this.alertService.showMessage(
                'Success',
                'Mapped Aircraft Information Successfully for PN: ' + this.pnvalue,
                MessageSeverity.success
            );
            this.isSpinnerVisible = false;
            // reset poupup aircraft information
            this.aircraftData = undefined;
            this.selectedAircraftId = undefined;
            this.selectedModelId = [];
            this.selectedDashnumber = [];
            this.dashNumberUnknown = false;
            this.modelUnknown = false;
            this.isSpinnerVisible = false;
            // get aircraft Mapped Data 
            this.getAircraftMappedDataByItemMasterId();

        }, error => {
            // this.alertService.showMessage(
            //     'Failed',
            //     error.error,
            //     MessageSeverity.error
            // );
            const errorLog = error;            // reset poupup aircraft information
            this.aircraftData = undefined;
            this.selectedAircraftId = undefined;
            this.selectedModelId = [];
            this.selectedDashnumber = [];
            this.dashNumberUnknown = false;
            this.modelUnknown = false;
            this.isSpinnerVisible = false;
        })
        this.closeAddAircraftModel();
    }

    getAircraftMappedDataByItemMasterId() {
        this.isSpinnerVisible = true;
        // check whether edit or create and send and passes ItemMasterId
        const id = this.isEdit === true ? this.itemMasterId : this.collectionofItemMaster.itemMasterId;
        this.itemser.getMappedAirCraftDetails(id).subscribe(data => {
            const responseData = data;
            this.selectedAircraftLDColumns=this.colsaircraftLD
            this.aircraftListDataValues = responseData.map(x => { //aircraftListData
                return {
                    ...x,
                    aircraft: x.aircraftType,
                    model: x.aircraftModel,
                    dashNumber: x.dashNumber == 'Unknown' ? null : x.dashNumber,
                    memo: x.memo,
                    createdBy: x.createdBy,
                    createdDate: x.createdDate,
                    updatedBy: x.updatedBy,
                    updatedDate: x.updatedDate
                }
            })
            this.isSpinnerVisible = false;
        }, 
        error => {this.isSpinnerVisible = false;})
    }



    onDeleteAircraft() {
        const {itemMasterAircraftMappingId}=this.rowDataToDelete;
        this.itemser.deleteItemMasterAir(itemMasterAircraftMappingId).subscribe(res => {
            this.getAircraftMappedDataByItemMasterId();
            this.alertService.showMessage(
                'Success',
                `Deleted Successfully`,
                MessageSeverity.success
            );
        })
    }

    restoreAircraftRow() {
        const {itemMasterAircraftMappingId}=this.rowDataToDelete;
        this.itemser.restoreAircraftRow(itemMasterAircraftMappingId).subscribe(res => {
            this.getAircraftMappedDataByItemMasterId();
            this.alertService.showMessage(
                'Success',
                `Restore Successfully`,
                MessageSeverity.success
            );
        })
    }

    movePurchaseSales() {
        this.changeOfTab('PurchaseSales');
    }
    moveExportInformations() {
        this.alertService.showMessage(
            'Success',
            `Action Saved Successfully `,
            MessageSeverity.success
        );
        this.changeOfTab('Exchange');
    }
    moveNTAETab() {
        this.alertService.showMessage(
            'Success',
            `Action Saved Successfully `,
            MessageSeverity.success
        );
        this.changeOfTab('NhaTlaAlternateTab');
    }
    moveToExchangeTab(){
        this.alertService.showMessage(
            'Success',
            `Action Saved Successfully `,
            MessageSeverity.success
        );
        this.changeOfTab('Exchange');
    }
    moveAtachapter() {
        this.alertService.showMessage(
            'Success',
            `Saved Aircraft Info Successfully `,
            MessageSeverity.success
        );
        this.changeOfTab('Atachapter');
        
        this.currentAtaNumber = new ATAChapter();
        this.getAllATAChapter();

    }

    saveCapesInfo() {
        this.alertService.showMessage(
            'Success',
            `Saved Capes Details Successfully `,
            MessageSeverity.success
        );
    }

    getAllATAChapter() {
        this.isSpinnerVisible = true;
        this.ataMainSer.getATAMainDropdownList(this.currentUserMasterCompanyId).subscribe(res => {
            this.LoadAtachapter = res;
            this.ataMainchapter = this.LoadAtachapter;
            this.isSpinnerVisible = false;
        }, 
        error => {this.isSpinnerVisible=false})
    }

    getAllATASubChapter() {
        this.atasubchapter1service.getAtaSubChapter1List(this.currentUserMasterCompanyId).subscribe(res => {
            this.atasubchapter = res[0].map(x => {
                return {
                    label:  x.ataSubChapterCode + ' - ' + x.description,
                    value: x
                }
            })
        })
    }
    addNewATA() {
        this.ataChapterEditMode = false;
        this.atasubchapter = [];
        this.ataform.reset();
    }
    closeAddAircraftModel(){
        // reset poupup aircraft information
        this.aircraftData = undefined;
        this.selectedAircraftId = undefined;
        this.selectedModelId = [];
        this.selectedDashnumber = [];
        this.dashNumberUnknown = false;
        this.modelUnknown = false;
        $('#ModalDashNumber').modal('hide');

    }
    addATAMapping() {
        this.isSpinnerVisible = true;
        const ItemMasterID = this.isEdit === true ? this.itemMasterId : this.collectionofItemMaster.itemMasterId;
        const PartNumber = this.isEdit === true ? this.pnvalue : this.collectionofItemMaster.partNumber
        let ataMappingData = [];
        if(this.selectedModels.length > 0) {
            ataMappingData = this.selectedModels.map(x => {
                return {
                    ItemMasterId: ItemMasterID,
                    ATAChapterId: this.ataChaptherSelected[0].value,
                    ATASubChapterId: x.ataSubChapterId,
                    ATAChapterCode: this.ataChaptherSelected[0].ataChapterCode,
                    ATAChapterName: this.ataChaptherSelected[0].ataChapterName,
                    ATASubChapterDescription: x.description,
                    MasterCompanyId: x.masterCompanyId,
                    CreatedBy: this.userName,
                    UpdatedBy: this.userName,
                    CreatedDate: new Date(),
                    UpdatedDate: new Date(),
                    PartNumber: PartNumber,
                    IsActive: true,
                    IsDeleted: false,
                }
            })
        } else {
            ataMappingData = [{
                ItemMasterId: ItemMasterID,
                ATAChapterId: this.ataChaptherSelected[0].value,
                ATASubChapterId: null,
                ATAChapterCode: this.ataChaptherSelected[0].ataChapterCode,
                ATAChapterName: this.ataChaptherSelected[0].ataChapterName,
                ATASubChapterDescription: '',
                MasterCompanyId: this.currentUserMasterCompanyId,
                CreatedBy: this.userName,
                UpdatedBy: this.userName,
                CreatedDate: new Date(),
                UpdatedDate: new Date(),
                PartNumber: PartNumber,
                IsActive: true,
                IsDeleted: false,
            }]
        }
        

        this.itemser.postATAMapping(ataMappingData).subscribe(res => {
            this.ataform.reset();
            this.getATAMappedDataByItemMasterId();
            this.alertService.showMessage(
                'Success',
                `Ata Chapter Added Successfully for PN: ${this.pnvalue}` ,
                MessageSeverity.success
            );
            this.isSpinnerVisible = false;

        }, 
        error => {this.isSpinnerVisible=false})

    }
    updateATAMapping() {
        this.isSpinnerVisible = true;
        this.selectedAtaInformation['updatedBy'] = this.userName;
        this.selectedAtaInformation['createdBy'] = this.userName;
        this.selectedAtaInformation['ataChapterName'] = getValueFromArrayOfObjectById('ataChapterName', 'value', this.selectedAtaInformation.ataChapterId, this.ataMainchapter)
        this.selectedAtaInformation['ataChapterCode'] = getValueFromArrayOfObjectById('ataChapterCode', 'value', this.selectedAtaInformation.ataChapterId, this.ataMainchapter)
        this.selectedAtaInformation['ataSubChapterDescription'] = this.selectedAtaInformation.ataSubChapterId ? getValueFromArrayOfObjectById('description', 'ataSubChapterId', this.selectedAtaInformation.ataSubChapterId, this.orginalAtaSubChapterValues) : '';
        this.selectedAtaInformation['masterCompanyId'] = DBkeys.MASTER_COMPANY_ID;
        this.itemser.updateATAMapping(this.selectedAtaInformation, this.selectedAtaInformation.itemMasterATAMappingId).subscribe(res => {
            this.ataform.reset();
            this.alertService.showMessage(
                'Success',
                `Ata Chapter Updated Successfully for PN: ${this.pnvalue}` ,
                MessageSeverity.success
            );
            this.getATAMappedDataByItemMasterId();

            this.dismissModel();
            
            this.isSpinnerVisible = false;
        }, 
        error => {this.isSpinnerVisible=false})

    }


    getATAMappedDataByItemMasterId() {
        // check whether edit or create and send and passes ItemMasterId
        if (this.collectionofItemMaster.itemMasterId != undefined || this.itemMasterId != undefined) { 
        const id = this.isEdit === true ? this.itemMasterId : this.collectionofItemMaster.itemMasterId;
            this.itemser.getMappedATADetails(id).subscribe(res => {
                if (res) {
                    this.ataMappedList = res.map(x => {
                        return {
                            ...x,
                            ataChapterName: x.ataChapterCode + ' - ' + x.ataChapterName,
                            ataSubChapterDescription: x.ataSubChapterId ? x.ataSubChapterCode + ' - ' + x.ataSubChapterDescription : '',
                            createdBy: x.createdBy,
                            createdDate: x.createdDate,
                            updatedDate: x.updatedDate,
                            updatedBy: x.updatedBy,
                            partNumber: x.partNumber,
                            partDescription: x.partDescription,
                        }
                    })}
            })
        }
    }
    deleteATAMapped() {
        const {itemMasterATAMappingId}=this.rowDataToDelete;
        this.itemser.deleteItemMasterATA(itemMasterATAMappingId).subscribe(res => {
            this.getATAMappedDataByItemMasterId();
            this.alertService.showMessage(
                'Success',
                `Deleted Successfully`,
                MessageSeverity.success
            );
        })
    }

    restoreATAMapped() {
        const {itemMasterATAMappingId}=this.rowDataToDelete;
        this.itemser.restoreATAMapped(itemMasterATAMappingId).subscribe(res => {
            this.getATAMappedDataByItemMasterId();
            this.alertService.showMessage(
                'Success',
                `Restore Successfully`,
                MessageSeverity.success
            );
        })
    }


    // get all Aircraft Models
    getAllAircraftModels() {
        this.aircraftModelService.getAll(this.currentUserMasterCompanyId).subscribe(models => {
            const responseValue = models[0];
            this.aircraftModelList = responseValue.map(models => {
                return {
                    label: models.modelName,
                    value: models.aircraftModelId
                };
            });
        });
    }


    // get all dashnumber
    getAllDashNumbers() {
        this.Dashnumservice.getAll(this.currentUserMasterCompanyId).subscribe(dashnumbers => {
            const responseData = dashnumbers[0];
            this.dashNumberList = responseData.map(dashnumbers => {
                return {
                    label: dashnumbers.dashNumber,
                    value: dashnumbers.dashNumberId
                };
            });
        });
    }

    // ata search by itemmaster  id
    searchByFieldUrlCreateforATA() {

        if (this.selectedATAchapter.length > 0) {
            const ataIds = this.selectedATAchapter.reduce((acc, value) => {
                return `${acc},${value}`;
            }, '');
            this.ataChapterIdUrl = ataIds.substr(1);
        } else {
            this.ataChapterIdUrl = '';
        }
        if (this.selectedATASubChapter.length > 0) {
            const ataSubchapterIds = this.selectedATASubChapter.reduce((acc, id) => {
                return `${acc},${id}`;
            }, '');
            this.ataSubchapterIdUrl = ataSubchapterIds.substr(1);
        } else {
            this.ataSubchapterIdUrl = '';
        }
    }

    // get all subchapter for dropdown
    getAllSubChapters() {
        this.isSpinnerVisible = true;
        this.atasubchapter1service.getAtaSubChapter1List(this.currentUserMasterCompanyId).subscribe(atasubchapter => {
                const responseData = atasubchapter[0];
                this.orginalAtaSubChapterValues = responseData;
                this.atasubchapterValues = responseData.map(x => {
                    return {
                        label:  x.ataSubChapterCode + ' - ' + x.description,
                        value: x.ataSubChapterId
                    };
                    
                });
                
                this.getATAMappedDataByItemMasterId();
                this.isSpinnerVisible = false;
            }, error => {this.isSpinnerVisible = false;});
    }

    getSubChapterByATAChapter() {
        this.searchByFieldUrlCreateforATA();

        if (this.ataChapterIdUrl !== '') {
            this.ataMainSer.getMultiATASubDesc(this.ataChapterIdUrl).subscribe(atasubchapter => {
                    const responseData = atasubchapter;
                    this.atasubchapterValues = responseData.map(x => {
                        return {
                            label:  x.ataSubChapterCode + ' - ' + x.description,
                            value: x.ataSubChapterId
                        };
                    });
                });

        } else {
            this.getAllSubChapters();
        }
    }

    async getItemTypesList() {
         await this.commonService.autoSuggestionSmartDropDownList('ItemType', 'ItemTypeId', 'Description','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {   
            this.itemTypesList = res;
        });
    }

    getCapabilityType() {
         this.commonService.autoSuggestionSmartDropDownList('CapabilityType', 'CapabilityTypeId', 'CapabilityTypeDesc','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {  
            this.capabilityTypeList = res;
        });
    }

    onSelectAta(value) {
    }
    addCape() {

        this.capeBldList = [];
        this.distinctAtaList = [];
        const result = [];
        const map = new Map();
        for (const item of this.ataMappedList) {
            if (!map.has(item.ataChapterId)) {
                map.set(item.ataChapterId, true);    // set any value to Map
                this.distinctAtaList.push({
                    id: item.ataChapterId,
                    name: item.ataChapterName
                });
            }
        }
        // need to get the list of aircraft and have to populate rows for each aircrat
        this.selectedCapabilityTypes.forEach(cap => {
            this.aircraftListDataValues.forEach(x => {
                this.capeBldList.push(
                    {
                        capabilityType: this.capabilityTypeList.find(c => c.value === cap),
                        entity: 'ent1',
                        companyId: 1,
                        buId: 2,
                        departmentId: 3,
                        aircraft: x
                    }
                )
            });


        });


    }

    async searchATA() {
        this.isSpinnerVisible = true
        await this.searchByFieldUrlCreateforATA();
        this.searchATAParams = '';
        // checks where multi select is empty or not and calls the service
        if (this.ataChapterIdUrl !== '' && this.ataSubchapterIdUrl !== '') {
            this.searchATAParams = `ataChapterId=${
                this.ataChapterIdUrl
                }&ataSubChapterId=${this.ataSubchapterIdUrl}`;
        }
        else if (this.ataChapterIdUrl !== '') {
            this.searchATAParams = `ataChapterId=${this.ataChapterIdUrl}`;
        }
        else if (this.ataSubchapterIdUrl !== '') {
            this.searchATAParams = `ataSubChapterId=${this.ataSubchapterIdUrl}`;
        }

        const ItemMasterID = this.isEdit === true ? this.itemMasterId : this.collectionofItemMaster.itemMasterId;
        this.itemser
            .searchItemMasterATAMappedByMultiTypeIdModelIDDashID(
                ItemMasterID,
                this.searchATAParams,
            )
            .subscribe(res => {
                this.ataMappedList = res.map(x => {
                    return {
                        ataChapterName: x.ataChapterCode + ' - ' + x.ataChapterName,
                        ataSubChapterDescription: getValueFromArrayOfObjectById('ataSubChapterCode', 'ataSubChapterId', x.ataSubChapterId, this.orginalAtaSubChapterValues) + ' - ' +x.ataSubChapterDescription,
                        ataChapterCode: x.ataChapterCode,
                        ataSubChapterId: x.ataSubChapterId,
                        ataChapterId: x.ataChapterId,
                        createdBy: x.createdBy,
                        createdDate: x.createdDate,
                        updatedDate: x.updatedDate,
                        updatedBy: x.updatedBy
                    };
                });
                this.isSpinnerVisible = false;
            }, error => {this.isSpinnerVisible = false;});
    }


    movePurchaseInformation() {
        this.alertService.showMessage(
            'Success',
            `Saved ATA Chapter Successfully `,
            MessageSeverity.success
        );
        this.changeOfTab('PurchaseSales');
       
    }

    moveExportInformation() {
        this.savePurchaseandSales();
    }

     checkDuplicateInObject(propertyName, inputArray) {
        var seenDuplicate = false,
            testObject = {};
      
        inputArray.map(function(item) {
          var itemPropertyName = item[propertyName];
          if (itemPropertyName in testObject) {
            testObject[itemPropertyName].duplicate = true;
            item.duplicate = true;
            seenDuplicate = true;
          }
          else {
            testObject[itemPropertyName] = item;
            delete item.duplicate;
          }
        });
      
        return seenDuplicate;
      }

      deletePurchaseSaleRow(i, field) {
            this.deletePSRecordRow = {
                ...field,
                conditionName: field.ConditionId ? getValueFromArrayOfObjectById('label', 'value', field.ConditionId, this.conditionList) : null
            };
            this.deletePSRecordRowIndex = i;
      }

      deletePurchaseSaleRowRecord(value) {
        if(value == 'Yes') {
            const i = this.deletePSRecordRowIndex
        if(this.fieldArray[i].itemMasterPurchaseSaleId){
            if (this.fieldArray.length > 0) {
            
                this.fieldArray[i].isDeleted = true;
            }
            else {
                this.Delete = false;
            }
            
            this.itemser.deleteItemMasterPurcSaleRecord(this.deletePSRecordRow.itemMasterPurchaseSaleId, this.userName).subscribe(res => {
                    this.fieldArray.splice(i, 1);
                    this.alertService.showMessage(
                        'Success',
                        `Item Deleted Successfully `,
                        MessageSeverity.success
                    );
            })
           
        } else {
            if (this.fieldArray.length > 0) {
                        this.fieldArray.splice(i, 1);
                        this.alertService.showMessage(
                            'Success',
                            `Item Deleted Successfully `,
                            MessageSeverity.success
                        );
                    }
                    else {
                        this.Delete = false;
                    }
        }
        } else {
            this.deletePSRecordRow = undefined;
            this.deletePSRecordRowIndex = undefined;
        }
       
    }

    formatToGlobalValue(val, decLength){
        return formatNumberAsGlobalSettingsModule(val, decLength)
    }

    onChangeSalePriceSelectId(field) {
        if(field.SalePriceSelectId == 1) {
            field.SP_CalSPByPP_MarkUpPercOnListPrice = '0.00';
            field.SP_CalSPByPP_MarkUpAmount = '0.00';            
            field.SP_CalSPByPP_BaseSalePrice = '0.00';
            field.SP_CalSPByPP_SaleDiscPerc = '0.00';
            field.SP_CalSPByPP_SaleDiscAmount = '0.00';            
            field.SP_FSP_LastFlatPriceDate = new Date();
            field.SP_CalSPByPP_LastSalesDiscDate = ''; 
            field.SP_CalSPByPP_LastMarkUpDate =  ''; 
            field.SP_CalSPByPP_UnitSalePrice = '0.00';
            field.SP_FSP_CurrencyId = this.sourceItemMaster.salesCurrencyId;
            field.SP_CalSPByPP_UnitSalePrice = field.SP_FSP_FXRatePerc ? formatNumberAsGlobalSettingsModule(field.SP_FSP_FXRatePerc, 2) : '0.00';            
        } 
        else if(field.SalePriceSelectId == 2) {
            field.SP_FSP_UOMId = this.sourceItemMaster.consumeUnitOfMeasureId;
            field.SP_FSP_CurrencyId = this.sourceItemMaster.salesCurrencyId;
            field.SP_FSP_FXRatePerc = 1;
            field.SP_FSP_FlatPriceAmount = '0.00';
            field.SP_CalSPByPP_LastSalesDiscDate = new Date(); 
            field.SP_CalSPByPP_LastMarkUpDate = new Date(); 
            field.SP_FSP_LastFlatPriceDate = '';
            this.getPercentValueSPUsingPP(field);
        } 
        else {
            field.SP_CalSPByPP_MarkUpPercOnListPrice = '0.00';
            field.SP_CalSPByPP_MarkUpAmount = '0.00';
            field.SP_CalSPByPP_LastMarkUpDate = ''; //new Date();
            field.SP_CalSPByPP_BaseSalePrice = '0.00';
            field.SP_CalSPByPP_SaleDiscPerc = '0.00';
            field.SP_CalSPByPP_SaleDiscAmount = '0.00';
            field.SP_CalSPByPP_LastSalesDiscDate = '' ;//new Date();
            field.SP_CalSPByPP_UnitSalePrice = '0.00';
            field.SP_FSP_UOMId = this.sourceItemMaster.consumeUnitOfMeasureId;
            field.SP_FSP_CurrencyId = this.sourceItemMaster.purchaseCurrencyId;
            field.SP_FSP_FXRatePerc = 1;
            field.SP_FSP_FlatPriceAmount = '0.00';
            field.SP_FSP_LastFlatPriceDate = '';// new Date();
        }
    }

    onChangePPCurrency(field) {
        field.SP_FSP_CurrencyId = field.PP_CurrencyId;
    }

    savePurchaseandSales() {
        const ItemMasterID = this.isEdit === true ? this.itemMasterId : this.collectionofItemMaster.itemMasterId;

        const data = this.fieldArray.map(obj => {
            obj.SP_CalSPByPP_SaleDiscPerc = parseInt(obj.SP_CalSPByPP_SaleDiscPerc);
            obj.PP_PurchaseDiscPerc = parseInt(obj.PP_PurchaseDiscPerc);
            obj.SP_CalSPByPP_MarkUpPercOnListPrice = parseInt(obj.SP_CalSPByPP_MarkUpPercOnListPrice);
            obj.PP_VendorListPrice = obj.PP_VendorListPrice ? parseFloat(obj.PP_VendorListPrice.toString().replace(/\,/g,'')) : null;
            obj.PP_PurchaseDiscAmount = obj.PP_PurchaseDiscAmount ? parseFloat(obj.PP_PurchaseDiscAmount.toString().replace(/\,/g,'')) : null;
            obj.PP_UnitPurchasePrice = obj.PP_UnitPurchasePrice ? parseFloat(obj.PP_UnitPurchasePrice.toString().replace(/\,/g,'')) : null;
            obj.SP_FSP_FlatPriceAmount = obj.SP_FSP_FlatPriceAmount ? parseFloat(obj.SP_FSP_FlatPriceAmount.toString().replace(/\,/g,'')) : null;
            obj.SP_CalSPByPP_MarkUpAmount = obj.SP_CalSPByPP_MarkUpAmount ? parseFloat(obj.SP_CalSPByPP_MarkUpAmount.toString().replace(/\,/g,'')) : null;
            obj.SP_CalSPByPP_BaseSalePrice = obj.SP_CalSPByPP_BaseSalePrice ? parseFloat(obj.SP_CalSPByPP_BaseSalePrice.toString().replace(/\,/g,'')) : null;
            obj.SP_CalSPByPP_SaleDiscAmount = obj.SP_CalSPByPP_SaleDiscAmount ? parseFloat(obj.SP_CalSPByPP_SaleDiscAmount.toString().replace(/\,/g,'')) : null;
            obj.SP_CalSPByPP_UnitSalePrice = obj.SP_CalSPByPP_UnitSalePrice ? parseFloat(obj.SP_CalSPByPP_UnitSalePrice.toString().replace(/\,/g,'')) : null;

            return {
                ...obj,
                ItemMasterId: ItemMasterID,
                PartNumber: this.pnvalue,
                MasterCompanyId: this.currentUserMasterCompanyId,
                CreatedBy: this.userName,
                UpdatedBy: this.userName,
                CreatedDate: new Date(),
                UpdatedDate: new Date(),
                IsActive: true,
                IsDeleted: false
            }
        })
        const isduplicatesexists = this.checkDuplicateInObject('ConditionId', data)
        // this.itemser.newItemMasterPurcSaleClass(data).subscribe(datas => {
            if(isduplicatesexists == true){
                this.alertService.showMessage(
                    'Error',
                    `Conditions are unique for Purchase and Sales `,
                    MessageSeverity.error
                );
            } else {
                this.itemser.updateItemMasterPurchaseSale(ItemMasterID, data).subscribe(datas => {
                    this.alertService.showMessage(
                        'Success',
                        `Saved Purchase and Sale Successfully `,
                        MessageSeverity.success
                    );
                    this.disablepurchaseSales = true;
                    this.getPurchaseSalesDetailById(ItemMasterID);
                },
                error => {this.isSpinnerVisible=false})
            }
    }

    getConditionsList() {
        //this.commonService.smartDropDownWithStatusList('Condition', 'ConditionId', 'Description').subscribe(res => {
          this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {
            this.conditionList = res;
        })
    }

    moveExportInformation1() {
        this.showpurchaseData = true;
        this.showGeneralData = false;
        this.showexportData = false;
        this.showAircraftData = false;
    }

    movePurchaseInformation1() {
        this.showpurchaseData = false;
        this.showGeneralData = true;
        this.showexportData = false;
    }
    

    saveExportInformation() {        
        this.itemMasterId = this._actRoute.snapshot.params['id'];
        const ItemMasterID = this.isEdit === true ? this.itemMasterId : this.collectionofItemMaster.itemMasterId;
        const data = { ...this.exportInfo, 
            createdBy : this.userName,
            updatedBy : this.userName,
            isActive : true,
            isDeleted: false,
            exportSizeHeight: this.exportInfo.exportSizeHeight === undefined || this.exportInfo.exportSizeHeight === null || this.exportInfo.exportSizeHeight === '' ? 0 : this.exportInfo.exportSizeHeight,
            exportSizeLength: this.exportInfo.exportSizeLength === undefined || this.exportInfo.exportSizeLength === null || this.exportInfo.exportSizeLength === '' ? 0 : this.exportInfo.exportSizeLength,
            exportSizeWidth: this.exportInfo.exportSizeWidth === undefined || this.exportInfo.exportSizeWidth === null || this.exportInfo.exportSizeWidth === '' ? 0 : this.exportInfo.exportSizeWidth,
            exportWeight: this.exportInfo.exportWeight === undefined || this.exportInfo.exportWeight === null || this.exportInfo.exportWeight === '' ? 0 : this.exportInfo.exportWeight,

            masterCompanyId: this.currentUserMasterCompanyId,
            //exportCountryId: editValueAssignByCondition('value', this.exportInfo['exportCountryId']), 
            exportCountryId:getValueFromObjectByKey('countries_id', this.exportInfo['exportCountryId']),
            itemMasterId: parseInt(ItemMasterID), 
            exportValue: this.exportInfo.exportValue ? parseFloat(this.exportInfo.exportValue.toString().replace(/\,/g,'')) : 0 }

            
        this.itemser.newItemMasterExportInformation(data).subscribe(datas => {
            this.tempExportCountryId = null;
            this.alertService.showMessage(
                'Success',
                `Saved Export Information Successfully `,
                MessageSeverity.success
            );
            this.router.navigate(['itemmastersmodule/itemmasterpages/app-item-master-list'])
        })
    }
    saveandcreate(exportInfoormatiom) {
            this.itemMasterId = this._actRoute.snapshot.params['id'];
            const ItemMasterID = this.isEdit === true ? this.itemMasterId : this.collectionofItemMaster.itemMasterId;
            let expirationDate = null;
            if(this.exportInfo['exportCountryId'] == undefined){
                expirationDate = null;
            } else {
                expirationDate = this.exportInfo['exportCountryId']['countries_id']
            }
            const data = { ...this.exportInfo, 
                createdBy : this.userName,
                updatedBy : this.userName,
                isActive : true,
                isDeleted: false,
                exportCountryId: expirationDate || null, 
                itemMasterId: parseInt(ItemMasterID) ,

                exportSizeHeight: this.exportInfo.exportSizeHeight === undefined || this.exportInfo.exportSizeHeight === null || this.exportInfo.exportSizeHeight === '' ? 0 : this.exportInfo.exportSizeHeight,
                exportSizeLength: this.exportInfo.exportSizeLength === undefined || this.exportInfo.exportSizeLength === null || this.exportInfo.exportSizeLength === '' ? 0 : this.exportInfo.exportSizeLength,
                exportSizeWidth: this.exportInfo.exportSizeWidth === undefined || this.exportInfo.exportSizeWidth === null || this.exportInfo.exportSizeWidth === '' ? 0 : this.exportInfo.exportSizeWidth,
                exportWeight: this.exportInfo.exportWeight === undefined || this.exportInfo.exportWeight === null || this.exportInfo.exportWeight === '' ? 0 : this.exportInfo.exportWeight,
                exportValue: this.exportInfo.exportValue ? parseFloat(this.exportInfo.exportValue.toString().replace(/\,/g,'')) : 0 ,
            }
            
            this.itemser.newItemMasterExportInformation(data).subscribe(datas => {
                this.tempExportCountryId = null;
                this.alertService.showMessage(
                    'Success',
                    `Saved Export Information Successfully `,
                    MessageSeverity.success
                );
                this.router.navigate(['itemmastersmodule/itemmasterpages/app-item-master-non-stock']);
               
            });

    }
    navigateToAddNewItemMaster(content){
        
        if (!this.formdataexport.form.dirty) {
            this.redirectToAddNewItemMaster();
        }
        else
        {
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
            //let content = this.tabRedirectConfirmationModal;
            //this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        }
    }

    selectedOEM(value) {

        this.tempOEMpartNumberId = value.value;
    }
	getmemo() {
        
		this.disableSaveForEdit=false;
    }
    enableAircraftSave()
    {
        this.disableAircraftSaveForEdit=false;
    }

    saveItemMasterGeneralInformation(addItemMasterStockForm) {
        this.listOfErrors = pulloutRequiredFieldsOfForm(addItemMasterStockForm);
        if (this.listOfErrors.length > 0) {

            this.display = true;
            this.modelValue = true;
            return false;

        } else {
            this.isSaving = true;
            if (!this.isItemMasterCreated) //for create ItemMaster
            {
                this.oemPnData = this.sourceItemMaster.isOemPNId;
                this.sourceItemMaster.createdBy = this.userName;
                this.sourceItemMaster.updatedBy = this.userName;
                this.sourceItemMaster.masterCompanyId = this.currentUserMasterCompanyId;
                //this.sourceItemMaster.itemTypeId = this.currentItemTypeId;
                this.sourceItemMaster.itemTypeId = 1;

                if (this.selectedIntegrationTypes != null) {

                    this.sourceItemMaster.IntegrationPortalId = this.selectedIntegrationTypes.toString().split(",");
                }
                
                const itemMasterData = {
                    ...this.sourceItemMaster,
                    revisedPartId: editValueAssignByCondition('itemMasterId', this.sourceItemMaster.revisedPartId),
                    isPma: this.sourceItemMaster.isOEM == 'true' ? 'false' : 'true',          
                    isDER: this.sourceItemMaster.isDER,
                    warehouseId: this.sourceItemMaster.warehouseId === undefined || this.sourceItemMaster.warehouseId === 0 ? null : this.sourceItemMaster.warehouseId,
                    locationId: this.sourceItemMaster.locationId === undefined || this.sourceItemMaster.locationId === 0 ? null : this.sourceItemMaster.locationId,
                    shelfId: this.sourceItemMaster.shelfId === undefined || this.sourceItemMaster.shelfId === 0 ? null : this.sourceItemMaster.shelfId,
                    binId: this.sourceItemMaster.binId === undefined || this.sourceItemMaster.binId === 0 ? null : this.sourceItemMaster.binId,

                    tagDays: this.sourceItemMaster.tagDays === undefined || this.sourceItemMaster.tagDays === null || this.sourceItemMaster.tagDays === "" ? 0 : this.sourceItemMaster.tagDays,
                    openDays: this.sourceItemMaster.openDays === undefined || this.sourceItemMaster.openDays === null ||  this.sourceItemMaster.openDays === "" ? 0 : this.sourceItemMaster.openDays,  
                    otherDays: this.sourceItemMaster.otherDays === undefined || this.sourceItemMaster.otherDays === null || this.sourceItemMaster.otherDays === "" ? 0 : this.sourceItemMaster.otherDays,  
                    shippedDays: this.sourceItemMaster.shippedDays === undefined || this.sourceItemMaster.shippedDays === null || this.sourceItemMaster.shippedDays === "" ? 0 : this.sourceItemMaster.shippedDays,
                    daysReceived: this.sourceItemMaster.daysReceived === undefined || this.sourceItemMaster.daysReceived === null || this.sourceItemMaster.daysReceived === "" ? 0 : this.sourceItemMaster.daysReceived,
                    manufacturingDays: this.sourceItemMaster.manufacturingDays === undefined || this.sourceItemMaster.manufacturingDays === null || this.sourceItemMaster.manufacturingDays === "" ? 0 : this.sourceItemMaster.manufacturingDays,

                    rpHours: this.sourceItemMaster.rpHours === undefined || this.sourceItemMaster.rpHours === null ? 0 : this.sourceItemMaster.rpHours,
                    overhaulHours: this.sourceItemMaster.overhaulHours === undefined || this.sourceItemMaster.overhaulHours === null ? 0 : this.sourceItemMaster.overhaulHours,
                    testHours: this.sourceItemMaster.testHours === undefined || this.sourceItemMaster.testHours === null ? 0 : this.sourceItemMaster.testHours,
                    mfgHours: this.sourceItemMaster.mfgHours === undefined || this.sourceItemMaster.mfgHours === null ? 0 : this.sourceItemMaster.mfgHours,
                    turnTimeOverhaulHours: this.sourceItemMaster.turnTimeOverhaulHours === undefined || this.sourceItemMaster.turnTimeOverhaulHours === null ? 0 : this.sourceItemMaster.turnTimeOverhaulHours,
                    turnTimeRepairHours: this.sourceItemMaster.turnTimeRepairHours === undefined || this.sourceItemMaster.turnTimeRepairHours === null ? 0 : this.sourceItemMaster.turnTimeRepairHours,
                    turnTimeBenchTest: this.sourceItemMaster.turnTimeBenchTest === undefined || this.sourceItemMaster.turnTimeBenchTest === null ? 0 : this.sourceItemMaster.turnTimeBenchTest,
                    turnTimeMfg: this.sourceItemMaster.turnTimeMfg === undefined || this.sourceItemMaster.turnTimeMfg === null ? 0 : this.sourceItemMaster.turnTimeMfg,

                    leadTimeDays: this.sourceItemMaster.leadTimeDays === undefined || this.sourceItemMaster.leadTimeDays === null ? 0 : this.sourceItemMaster.leadTimeDays,
                    stockLevel: this.sourceItemMaster.stockLevel === undefined || this.sourceItemMaster.stockLevel === null ? 0 : this.sourceItemMaster.stockLevel,
                    reorderPoint: this.sourceItemMaster.reorderPoint === undefined || this.sourceItemMaster.reorderPoint === null ? 0 : this.sourceItemMaster.reorderPoint,
                    reorderQuantiy: this.sourceItemMaster.reorderQuantiy === undefined || this.sourceItemMaster.reorderQuantiy === null ? 0 : this.sourceItemMaster.reorderQuantiy,
                    minimumOrderQuantity: this.sourceItemMaster.minimumOrderQuantity === undefined || this.sourceItemMaster.minimumOrderQuantity === null ? 0 : this.sourceItemMaster.minimumOrderQuantity,

                    isOemPNId: editValueAssignByCondition('itemMasterId', this.sourceItemMaster.isOemPNId),
                    expirationDate: this.sourceItemMaster.expirationDate ? this.datePipe.transform(this.sourceItemMaster.expirationDate, "MM/dd/yyyy") : null,
                }
                this.itemser.newItemMaster(itemMasterData).subscribe(data => {
                    if (data != null) {   
                        this.itemMasterReferenceId = data.itemMasterId;                    
                        this.ItemMasterId = data.itemMasterId;
                        this.itemMasterId = this.ItemMasterId;                        
                        localStorage.setItem('commonId',this.itemMasterId.toString())
                        this.uploadDocs.next(true);                                       
                        this.router.navigateByUrl(`/itemmastersmodule/itemmasterpages/app-item-master-stock/edit/${this.itemMasterId}`);
                        this.getItemMasterDetailsById();
                        if (this.isSaveCapes == true) {
                            this.saveCapabilities();
                        }
                        //this.onUploadDocumentListNew();
                        this.isItemMasterCreated = true;
                    }

                    this.isItemMasterCreated = true;                 
                    this.collectionofItemMaster = data;
                    this.savesuccessCompleted(this.sourceItemMaster);                  
                    this.moveAircraftInformation();
                })
                this.isDisabledSteps = true;
                this.isItemMasterCreateGeneralInfoEditMode = true;
            }
            else if (this.isItemMasterCreated || this.itemMasterId) //for Edit Screen
            {
                const itemMasterId = this.isEdit === true ? this.itemMasterId : this.collectionofItemMaster.itemMasterId;
                // takes copy of current object to reassign to UI after submit data only on create edit Method

                this.oemPnData = this.sourceItemMaster.isOemPNId;

                if (this.selectedIntegrationTypes != null) //separting Array whic is having ","
                {
                    this.sourceItemMaster.IntegrationPortalId = this.selectedIntegrationTypes.toString().split(",");
                }
                this.sourceItemMaster.updatedBy = this.userName;
                this.sourceItemMaster.createdBy = this.userName;
                this.sourceItemMaster.masterCompanyId = this.currentUserMasterCompanyId;
                //this.sourceItemMaster.itemTypeId = this.currentItemTypeId;
                this.sourceItemMaster.itemTypeId = 1;

                if (this.sourceItemMaster.isOEM == 'false') {
                    // checks whether the Change of Data is Happened or not if not and its is in edit mode binds the old data id if not edit and no change it will get the old create oemPnID
                    //this.sourceItemMaster.isOemPNId = this.tempOEMpartNumberId === null ? this.isEdit === true ? this.sourceItemMaster.isOemPNId.itemMasterId : this.oemPnData.itemMasterId : this.tempOEMpartNumberId;
                }

                this.sourceItemMaster.itemMasterId = itemMasterId;
                const itemMasterData = {
                    ...this.sourceItemMaster,
                    isPma: this.sourceItemMaster.isOEM == 'true' ? 'false' : 'true',
                    isDER: this.sourceItemMaster.isDER,
                    warehouseId: this.sourceItemMaster.warehouseId === undefined || this.sourceItemMaster.warehouseId === 0 ? null : this.sourceItemMaster.warehouseId,
                    locationId: this.sourceItemMaster.locationId === undefined || this.sourceItemMaster.locationId === 0 ? null : this.sourceItemMaster.locationId,
                    shelfId: this.sourceItemMaster.shelfId === undefined || this.sourceItemMaster.shelfId === 0 ? null : this.sourceItemMaster.shelfId,
                    binId: this.sourceItemMaster.binId === undefined || this.sourceItemMaster.binId === 0 ? null : this.sourceItemMaster.binId,

                    tagDays: this.sourceItemMaster.tagDays === undefined || this.sourceItemMaster.tagDays === null || this.sourceItemMaster.tagDays === "" ? 0 : this.sourceItemMaster.tagDays,
                    openDays: this.sourceItemMaster.openDays === undefined || this.sourceItemMaster.openDays === null ||  this.sourceItemMaster.openDays === "" ? 0 : this.sourceItemMaster.openDays,  
                    otherDays: this.sourceItemMaster.otherDays === undefined || this.sourceItemMaster.otherDays === null || this.sourceItemMaster.otherDays === "" ? 0 : this.sourceItemMaster.otherDays,  
                    shippedDays: this.sourceItemMaster.shippedDays === undefined || this.sourceItemMaster.shippedDays === null || this.sourceItemMaster.shippedDays === "" ? 0 : this.sourceItemMaster.shippedDays,
                    daysReceived: this.sourceItemMaster.daysReceived === undefined || this.sourceItemMaster.daysReceived === null || this.sourceItemMaster.daysReceived === "" ? 0 : this.sourceItemMaster.daysReceived,
                    manufacturingDays: this.sourceItemMaster.manufacturingDays === undefined || this.sourceItemMaster.manufacturingDays === null || this.sourceItemMaster.manufacturingDays === "" ? 0 : this.sourceItemMaster.manufacturingDays,

                    rpHours: this.sourceItemMaster.rpHours === undefined || this.sourceItemMaster.rpHours === null ? 0 : this.sourceItemMaster.rpHours,
                    overhaulHours: this.sourceItemMaster.overhaulHours === undefined || this.sourceItemMaster.overhaulHours === null ? 0 : this.sourceItemMaster.overhaulHours,
                    testHours: this.sourceItemMaster.testHours === undefined || this.sourceItemMaster.testHours === null ? 0 : this.sourceItemMaster.testHours,
                    mfgHours: this.sourceItemMaster.mfgHours === undefined || this.sourceItemMaster.mfgHours === null ? 0 : this.sourceItemMaster.mfgHours,
                    turnTimeOverhaulHours: this.sourceItemMaster.turnTimeOverhaulHours === undefined || this.sourceItemMaster.turnTimeOverhaulHours === null ? 0 : this.sourceItemMaster.turnTimeOverhaulHours,
                    turnTimeRepairHours: this.sourceItemMaster.turnTimeRepairHours === undefined || this.sourceItemMaster.turnTimeRepairHours === null ? 0 : this.sourceItemMaster.turnTimeRepairHours,
                    turnTimeBenchTest: this.sourceItemMaster.turnTimeBenchTest === undefined || this.sourceItemMaster.turnTimeBenchTest === null ? 0 : this.sourceItemMaster.turnTimeBenchTest,
                    turnTimeMfg: this.sourceItemMaster.turnTimeMfg === undefined || this.sourceItemMaster.turnTimeMfg === null ? 0 : this.sourceItemMaster.turnTimeMfg,

                    leadTimeDays: this.sourceItemMaster.leadTimeDays === undefined || this.sourceItemMaster.leadTimeDays === null ? 0 : this.sourceItemMaster.leadTimeDays,
                    stockLevel: this.sourceItemMaster.stockLevel === undefined || this.sourceItemMaster.stockLevel === null ? 0 : this.sourceItemMaster.stockLevel,
                    reorderPoint: this.sourceItemMaster.reorderPoint === undefined || this.sourceItemMaster.reorderPoint === null ? 0 : this.sourceItemMaster.reorderPoint,
                    reorderQuantiy: this.sourceItemMaster.reorderQuantiy === undefined || this.sourceItemMaster.reorderQuantiy === null ? 0 : this.sourceItemMaster.reorderQuantiy,
                    minimumOrderQuantity: this.sourceItemMaster.minimumOrderQuantity === undefined || this.sourceItemMaster.minimumOrderQuantity === null ? 0 : this.sourceItemMaster.minimumOrderQuantity,

                    revisedPartId: editValueAssignByCondition('itemMasterId', this.sourceItemMaster.revisedPartId),
                    isOemPNId: editValueAssignByCondition('itemMasterId', this.sourceItemMaster.isOemPNId),
                    expirationDate: this.sourceItemMaster.expirationDate ? this.datePipe.transform(this.sourceItemMaster.expirationDate, "MM/dd/yyyy") : null,
                }
                // Destructing the Object in Services Place Apply Changes there also 
                this.itemser.updateItemMaster(itemMasterData).subscribe(data => {                    
                    this.sourceItemMaster.isOemPNId = this.oemPnData;
                    this.tempOEMpartNumberId = null;
                    this.collectionofItemMaster = data;
                    this.getItemMasterDetailsById();
                    if (data != null) {                           
                        this.itemMasterId = data.itemMasterId;   
                        this.itemMasterReferenceId = data.itemMasterId;  
                        localStorage.setItem('commonId',this.itemMasterId.toString())                   
                        this.uploadDocs.next(true);
                        if (data.partId && data.itemMasterId) {
                            if (this.selectedModels.length > 0) {
                                this.saveAircraftmodelinfo(data.partId, data.itemMasterId, this.selectedModels);
                            }
                        }
                        //this.onUploadDocumentListNew();                        
                    }
                    this.isSaving = false;
                    this.isEditMode = true;
                    this.disableSaveForEdit = true;
                    this.alertService.showMessage("Success", `Updated ItemMaster General Info Successfully`, MessageSeverity.success);
                    this.moveAircraftInformation();
                })
            }
        }
    }

    onChangeOfPurchaseUOM(){
        this.sourceItemMaster.stockUnitOfMeasureId = this.sourceItemMaster.purchaseUnitOfMeasureId;
        this.sourceItemMaster.consumeUnitOfMeasureId = this.sourceItemMaster.purchaseUnitOfMeasureId;
    }

    salesfinalPrice(myValue, percentValue) {
        let afterpercent = percentValue / 100;
        let test = afterpercent * myValue;
        this.sourceItemMaster.salesPrice = myValue - test;
    }
    onPercentageCal(myValue, percentValue) {
        let afterpercent = percentValue / 100;
        let test = afterpercent * myValue;
        this.sourceItemMaster.purchaseListPriceAfterDiscount = myValue - test;
    }
   
    //Itemclassification Save
    itemclassification(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.sourceAction.isActive = true;
        this.itemName = "";
        this.className = "";
        this.itemTypeName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    saveitemclassification() {
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.itemClassificationCode = this.itemName;
            this.sourceAction.description = this.itemClassificationId;
            this.sourceAction.itemType = this.itemTypeName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.workFlowtService.newAction(this.sourceAction).subscribe(
                data => {
                    this.sourceItemMaster.itemClassificationId = data.itemClassificationId;
                    this.allitemclassificationInfo.push(data);
                    this.onItemClassificationChange()
                    this.itemclass();
                })
        }
        this.modal.close();
    }

    // Manufacturer Save
    filtermanufacturer(event) {
        this.manufacturerCollection = [];
        this.manufacturerNumber = [];
        if (this.allManufacturerInfo) {
            if (this.allpnNumbers.length > 0) {
                for (let i = 0; i < this.allManufacturerInfo.length; i++) {
                    let name = this.allManufacturerInfo[i].name;
                    if (name) {

                        if (name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                            this.manufacturerNumber.push([{
                                "manufacturerId": this.allManufacturerInfo[i].manufacturerId,
                                "name": name
                            }]),

                                this.manufacturerCollection.push(name);
                        }
                    }
                }
            }
        }
    }

    Manufacturer(content) {
        this.sourcemanufacturer.name = '';
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.sourceAction.isActive = true;
        this.manufacturerName = " "
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    // Provision --- Save
    provisionope(content) {
        this.provisionName = '';
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.sourceAction.isActive = true;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    exportUOmOpen(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    ProvisionHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedProvision) {
                if (value == this.selectedProvision.toLowerCase()) {
                    this.disableSaveProvision = true;
                }
                else {
                    this.disableSaveProvision = false;
                }
            }
        }
    }
    ProvisionDescription(event) {
        if (this.allProvisonInfo) {
            for (let i = 0; i < this.allProvisonInfo.length; i++) {
                if (event == this.allProvisonInfo[i].description) {
                    this.sourceItemMaster.description = this.allProvisonInfo[i].description;
                    this.disableSaveProvision = true;
                    this.selectedProvision = event;
                }
            }
        }
    }
    saveprovision() {
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.provisionName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.proService.newProvision(this.sourceAction).subscribe(
                data => {
                    this.sourceItemMaster.provisionId = data.provisionId;
                },
                response => this.saveCompleted(this.sourceAction));

        }
        this.modal.close();
    }

    captureId(event) {
        if (this.itemclaColl) {
            for (let i = 0; i < this.itemclaColl.length; i++) {
                if (event == this.itemclaColl[i][0].partName) {
                    this.sourceItemMaster.partId = this.itemclaColl[i][0].partId;
                }
            }
        }
    }

    filterpn(event) {        
        if (event.query !== undefined && event.query !== null) {
			this.loadOemPnPartNumData(event.query);            
    	}       
    }

    getEditDataForPN(editRevisedPartId = 0, editIsOemPNId = 0) {
		if(this.arrayItemMasterlist.length == 0) {			
            this.arrayItemMasterlist.push(0); }
		this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'partNumber', '', true, 20, this.arrayItemMasterlist.join(),this.currentUserMasterCompanyId).subscribe(response => {
			this.allPartnumbersList = response.map(x => {
                return {
                    partNumber: x.label, itemMasterId: x.value 
                }
            })
            
            this.sourceItemMaster = {
                ...this.sourceItemMaster,
                revisedPartId : getObjectById('itemMasterId', editRevisedPartId, this.allPartnumbersInfo),
                isOemPNId : getObjectById('itemMasterId', editIsOemPNId, this.allPartnumbersInfo)
            }

		}, error => {this.isSpinnerVisible=false});
	}

    loadOemPnPartNumData(strText = '') {
		if(this.arrayItemMasterlist.length == 0) {			
            this.arrayItemMasterlist.push(0); }
		this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'partNumber', strText, true, 20, this.arrayItemMasterlist.join(),this.currentUserMasterCompanyId).subscribe(response => {
			this.allPartnumbersList = response.map(x => {
                return {
                    partNumber: x.label, itemMasterId: x.value 
                }
			})

			const revisedPartId = this.sourceItemMaster.revisedPartId ? editValueAssignByCondition('itemMasterId', this.sourceItemMaster.revisedPartId) : 0;
        	this.oempnList = [];

			const oemList = [...this.allPartnumbersList.filter(x => {
                return x.partNumber.toLowerCase().includes(strText.toLowerCase())
            })]
        
			for (let i = 0; i < oemList.length; i++) {
				if(oemList[i].partNumber != this.selectedPartNumber && oemList[i].itemMasterId != revisedPartId){
					this.oempnList.push(oemList[i]);
				}                
			};        

		}, error => {this.isSpinnerVisible=false});
	}

    filterpartItems(event) {
        if(this.arrayItemMasterlist.length == 0) {			
            this.arrayItemMasterlist.push(0); }
        this.commonService.autoSuggestionSmartDropDownList('MasterParts', 'MasterPartId', 'PartNumber', event.query, false, DBkeys.AUTO_COMPLETE_COUNT_LENGTH, this.arrayItemMasterlist.join(),this.currentUserMasterCompanyId).subscribe(res => {
            this.itemclaColl = [];
            this.partCollection = [];
            for (let i = 0; i < res.length; i++) {
                this.partCollection.push(res[i].label);
                this.itemclaColl.push(res[i].label);
            };
        });
    }

    // loadOemPnPartNumDataold(strText = '') {
	// 	if(this.arrayItemMasterlist.length == 0) {			
    //         this.arrayItemMasterlist.push(0); }
	// 	this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'partnumber', strText, true, 20, this.arrayItemMasterlist.join()).subscribe(response => {
	// 		this.allPartnumbersList = response.map(x => {
    //             return {
    //                 partnumber: x.label, itemMasterId: x.value 
    //             }
	// 		})
	// 		this.partNumbersCollection = this.allPartnumbersList;
	// 	}, error => this.saveFailedHelper(error));
	// }


    filterpnOld(event) {
        const revisedPartId = this.sourceItemMaster.revisedPartId ? editValueAssignByCondition('itemMasterId', this.sourceItemMaster.revisedPartId) : 0;
        this.oempnList = [];
            if (event.query !== undefined && event.query !== null) {
                const oemList = [...this.oempnCollection.filter(x => {
                    return x.label.toLowerCase().includes(event.query.toLowerCase())
                })]
            
            for (let i = 0; i < oemList.length; i++) {
                if(oemList[i].partNumber != this.selectedPartNumber && oemList[i].value != revisedPartId){
                    this.oempnList.push(oemList[i]);
                }                
            };        
        }       
    }


    async  filterdescription(event) {
      await  this.commonService.autoSuggestionSmartDropDownList('MasterParts', 'MasterPartId', 'Description', event.query, false, DBkeys.AUTO_COMPLETE_COUNT_LENGTH,'0',this.currentUserMasterCompanyId).subscribe(res => {
        this.descriptionCollection = [];   
        for (let i = 0; i < res.length; i++) {
                this.descriptionCollection.push(res[i].label);
            }
            this.descriptionCollection = this.descriptionCollection.filter((el, i, a) => i === a.indexOf(el));
        });
      
    }

    filterRevisedPart(event) {
        this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'partnumber', event.query, false, DBkeys.AUTO_COMPLETE_COUNT_LENGTH,'0',this.currentUserMasterCompanyId).subscribe(res => {                    
            this.revisedPartNumCollection = [];
            for (let i = 0; i < res.length; i++) {
                if(res[i].label != this.selectedPartNumber && res[i].value != this.tempOEMpartNumberId){
                    this.revisedPartNumCollection.push({itemMasterId: res[i].value,
                        partNumber: res[i].label});
                }                
            };
        });
    }

    partdescriptionId(event) {
        if (this.allPartnumbersInfo) {
            for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
                if (event == this.allPartnumbersInfo[i].partDescription) {
                    this.sourceItemMaster.partDescription = event;
                    this.selectdescription = event;
                }
            }
        }
    }


    descriptionHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    this.disableSavepartDescription = true;
                }
                else {
                    this.disableSavepartDescription = false;
                }
            }
        }
    }

    public AddIntegration(imObj) {
        for (let i = 0; i < this.selectedIntegrationTypes.length; i++) {
            imObj.employeeLeaveTypeId = this.selectedIntegrationTypes[i];
            this.itemser.Addmultileaves(imObj).subscribe(data => {
                this.localCollection = data;
            })
        }
    }


    private Integration() {        
        //this.commonService.smartDropDownWithStatusList('IntegrationPortal', 'integrationPortalId', 'description', '', 1, 0).subscribe(res => {
          this.commonService.autoSuggestionSmartDropDownList('IntegrationPortal', 'integrationPortalId', 'description','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {
            this.integrationvalues= res;                     
        })
    }

    classificationId(event) {
       
        if (this.allitemclassificationInfo) {
            for (let i = 0; i < this.allitemclassificationInfo.length; i++) {
                if (event.toLowerCase() == this.allitemclassificationInfo[i].description.toLowerCase()) {
                    this.disableClassdesc = true;
                    this.disableClassdescMsg = true;
                    this.selectedActionName = event;
                }
            }
        }
    }

    classificationtypeId(event) {
        if (this.allitemclassificationInfo) {
            for (let i = 0; i < this.allitemclassificationInfo.length; i++) {
                if (event == this.allitemclassificationInfo[i].itemType) {
                    this.disabletypeSave = true;
                    this.selectedActionName = event;
                }
            }
        }
    }

    filterItemNames(event) {

        this.localNameCollection = [];
        if (this.allitemclassificationInfo) {
            for (let i = 0; i < this.allitemclassificationInfo.length; i++) {
                let itemClassificationId = this.allitemclassificationInfo[i].description;
               
                if (itemClassificationId.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
               
                    this.localNameCollection.push(itemClassificationId);
                }
            }
        }
    }
    filterItemtypes(event) {

        this.localtypeCollection = [];
        if (this.allitemclassificationInfo) {
            for (let i = 0; i < this.allitemclassificationInfo.length; i++) {
                let itemTypeName = this.allitemclassificationInfo[i].itemType;
                if (itemTypeName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.classificationtypecolle.push([{
                        "itemClassificationId": this.allitemclassificationInfo[i].itemClassificationId,
                        "itemTypeName": itemTypeName
                    }]),
                        this.localtypeCollection.push(itemTypeName);
                }
            }
        }
    }
    classeventHandler(field, value) {    
        this.disableClassdescMsg = false;
        for (let i = 0; i < this.allitemclassificationInfo.length; i++) {

            if (value == this.allitemclassificationInfo[i].itemClassificationId) {
                this.disableClassdescMsg = true;
                this.disableClassdesc = true;
                return;
            }
        }
    }

    saveCapabilitiesEnable() {
        this.isSaveCapes = true;
        this.modal.close();
    }

    saveCapabilities() {
        let capbilitiesForm = this.capabilitiesForm.value;
        let capabilityCollection: any = [];
        let mfgForm = capbilitiesForm.mfgForm;
        let overhaulForm = capbilitiesForm.overhaulForm;
        let distributionForm = capbilitiesForm.distributionForm;
        let certificationForm = capbilitiesForm.certificationForm;
        let repairForm = capbilitiesForm.repairForm;
        let exchangeForm = capbilitiesForm.exchangeForm;
        mfgForm.forEach(element => {
            element.itemMasterId = this.ItemMasterId
            capabilityCollection.push(element);
        });
        overhaulForm.forEach(element => {
            element.itemMasterId = this.ItemMasterId
            capabilityCollection.push(element);
        });
        distributionForm.forEach(element => {
            element.itemMasterId = this.ItemMasterId
            capabilityCollection.push(element);
        });
        certificationForm.forEach(element => {
            element.itemMasterId = this.ItemMasterId
            capabilityCollection.push(element);
        });
        repairForm.forEach(element => {
            element.itemMasterId = this.ItemMasterId
            capabilityCollection.push(element);
        });
        exchangeForm.forEach(element => {
            element.itemMasterId = this.ItemMasterId
            capabilityCollection.push(element);
        });

        // this.itemser.saveManfacturerinforcapes(capabilityCollection).subscribe(data11 => {
        //     this.router.navigateByUrl("/itemmastersmodule/itemmasterpages/app-item-master-list");
        // })
    }

    getATASubChapterData(ataMainId) {
        this.allSubChapter = [];
        this.vendorser.getATASubchapterData(ataMainId).subscribe( //calling and Subscribing for Address Data
            results => this.onDataLoadAtaSubChapterDataSuccessful(results[0]), //sending Address
            error => {this.isSpinnerVisible = false;}
        );
    }

    private onDataLoadAtaSubChapterDataSuccessful(data: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allSubChapter = data;
    }

    nhaHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    this.disableSaveNHANumber = false;
                }
                else {
                    this.disableSaveNHANumber = true;
                }
            }
        }
    }

    onNHASelect(event) {
        if (this.itemclaColl) {
            for (let i = 0; i < this.itemclaColl.length; i++) {
                if (event == this.itemclaColl[i][0].partName) {
                    this.sourceItemMaster.partId = this.itemclaColl[i][0].partId;
                    this.disableSaveNHANumber = false;
                    this.selectedActionName = event;
                }
            }
        }
    }

    addIntegrationModelSingle(integration) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.sourceUOM = new UnitOfMeasure();
        this.sourceUOM.isActive = true;
        this.portalURL = "";
        this.integrationName = "";
        this.sourceAction.description = "";
        this.modal = this.modalService.open(integration, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    createIntegration() {
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.sourceIntegration.createdBy = this.userName;
            this.sourceIntegration.updatedBy = this.userName;
            this.sourceIntegration.portalURL = this.portalURL;
            this.integrationService.newAction(this.sourceIntegration).subscribe(
                role => this.saveSuccessHelper(role),
                error => {this.isSpinnerVisible=false});
        }
        else {
            this.sourceIntegration.updatedBy = this.userName;
            this.sourceIntegration.description = this.integrationName;
            this.sourceIntegration.portalURL = this.portalURL;
            this.integrationService.updateAction(this.sourceIntegration).subscribe(
                response => this.saveCompleted(this.sourceIntegration),
                error => {this.isSpinnerVisible=false});
        }
        this.modal.close();
    }

    // New code for loading dropdown
    getATASubChapterByATAChapter() {
        const selectedATAChapterId = this.ataform.value.atanumber;
        this.ataChaptherSelected = this.ataMainchapter.filter(x => {
            if (x.value === selectedATAChapterId) {
                return x;
            }
        });
        this.atasubchapter1service.getATASubChapterListByATAChapterId(selectedATAChapterId).subscribe(atasubchapter => {
            const responseData = atasubchapter[0];
            this.atasubchapter = responseData.map(x => {
                return {
                    label: x.ataSubChapterCode + ' - ' + x.description,
					value: x
                }
            })
            this.atasubchapterforEdit = responseData.map(x => {
                return {
                    label: x.ataSubChapterCode + ' - ' + x.description,
					value: x.ataSubChapterId
                }
            })
            this.selectedModels = []
        })

        this.disables = true;
        this.view = false;
    }

    resetATASubChapter() {
        this.selectedAtaInformation.ataSubChapterId = null;
    }

    updateBtnChange(){
        this.updateBtn = false;
    }

     getAtaChapterName()
     {
         if(this.selectedAtaInformation.ataChapterId > 0)
         {
            return getValueFromArrayOfObjectById('ataChapterCode', 'value', this.selectedAtaInformation.ataChapterId, this.ataMainchapter) + ' - ' + getValueFromArrayOfObjectById('ataChapterName', 'value', this.selectedAtaInformation.ataChapterId, this.ataMainchapter)
         }
     }
     getAtaChapterCodeName()
     {
         return getValueFromArrayOfObjectById('description', 'ataSubChapterId', this.selectedAtaInformation.ataSubChapterId, this.orginalAtaSubChapterValues)
     }

    getATASubChapterByATAChapterForEdit(val) {
        if(val == 'enable'){
        this.updateBtn = false;
        }

        const selectedATAChapterId = this.selectedAtaInformation.ataChapterId;
        this.ataChaptherSelected = this.ataMainchapter.filter(x => {
            if (x.value === selectedATAChapterId) {
                return x;
            }
        });
        this.atasubchapter1service.getATASubChapterListByATAChapterId(selectedATAChapterId).subscribe(atasubchapter => {
            const responseData = atasubchapter[0];
            
            this.atasubchapter = responseData.map(x => {
                return {
                    label: x.ataSubChapterCode + ' - ' + x.description,
					value: x
                }
            })
            this.atasubchapterforEdit = responseData.map(x => {
                return {
                    label: x.ataSubChapterCode + ' - ' + x.description,
					value: x.ataSubChapterId
                }
            })
        })

        this.disables = true;
        this.view = false;
    }
    LoadAircraft: any[];
    selectedModels1: any;
    viewcheck1: boolean = false;
    addDashnumber() {
        this.viewCheck = false;
        this.disabled = true;
        this.disable1 = true;
        this.viewcheck1 = true;
        if (this.selectedModels1 == '') {
            this.viewCheck = true;
            this.disabled = false;
            this.disable1 = false;
            this.viewcheck1 = false;
        }
    }
    check($event) {
        this.disables = true;
        this.view = false;
    }
    Adddash($event) {
        this.disabled = false;
    }
    onToggle(i) {
        this.disable1 = true;
    }
    viewDash: boolean = true;
    viewCheck: boolean = true;

    schematic = false;
    onSchematic(e) {
        this.schematic = e.target.checked;
    }

    addFieldValue(): void {
        this.newFields.PP_UOMId = this.sourceItemMaster.purchaseUnitOfMeasureId;
        this.newFields.SP_FSP_UOMId = this.sourceItemMaster.consumeUnitOfMeasureId;
        this.newFields.PP_CurrencyId = this.sourceItemMaster.purchaseCurrencyId;
        this.newFields.SP_FSP_CurrencyId = this.sourceItemMaster.salesCurrencyId;
        this.newFields.isEditable = true;
        this.newFields.isNewItem = true;
        this.newFields.PP_FXRatePerc = 1;
        this.newFields.SP_FSP_FXRatePerc = 1;
        this.newFields.PP_VendorListPrice = '0.00';
        this.newFields.PP_PurchaseDiscAmount = '0.00';
        this.newFields.PP_UnitPurchasePrice = '0.00';
        this.newFields.SP_FSP_FlatPriceAmount = '0.00';
        this.newFields.SP_CalSPByPP_MarkUpAmount = '0.00';
        this.newFields.SP_CalSPByPP_BaseSalePrice = '0.00';
        this.newFields.SP_CalSPByPP_SaleDiscAmount = '0.00';
        this.newFields.SP_CalSPByPP_UnitSalePrice = '0.00';
        this.disablepurchaseSales = false;
        for(let i=0; i<this.conditionList.length; i++){
            if(this.conditionList[i].label == "New"){
                this.newFields.ConditionId = this.conditionList[i].value;
            }
        }
        
            this.fieldArray = [...this.fieldArray, { ...this.newFields }]
    }

    getPercentValuePP(field) {
        let vendorListPrice = field.PP_VendorListPrice ? parseFloat(field.PP_VendorListPrice.toString().replace(/\,/g,'')) : 0;
        let discountlabel=0;
        this.itemQuantitys.forEach((discount) => {
            if (discount.value == field.PP_PurchaseDiscPerc) 
            {
                discountlabel = discount.label;
            }
        })
        
        let purchaseDiscAmount = ((vendorListPrice * discountlabel) / 100);
        let unitPurchasePrice = vendorListPrice - purchaseDiscAmount;
        field.PP_PurchaseDiscAmount = purchaseDiscAmount ? formatNumberAsGlobalSettingsModule(purchaseDiscAmount, 2) : '0.00';
        field.PP_UnitPurchasePrice = unitPurchasePrice ? formatNumberAsGlobalSettingsModule(unitPurchasePrice, 2) : '0.00';
        field.PP_VendorListPrice = vendorListPrice ? formatNumberAsGlobalSettingsModule(vendorListPrice, 2) : '0.00';
    }

    onChangeFXRate(SP_FSP_FXRatePerc,field) {        
        //field.SP_FSP_FXRatePerc = SP_FSP_FXRatePerc ? formatNumberAsGlobalSettingsModule(SP_FSP_FXRatePerc, 5) : '0.00000';                              
        if(field.SP_FSP_FlatPriceAmount == 0.00)
            field.SP_CalSPByPP_UnitSalePrice = field.SP_FSP_FXRatePerc ? formatNumberAsGlobalSettingsModule(field.SP_FSP_FXRatePerc, 2) : '0.00';                    
    }

    onChangeFlatPriceAmt(field) {               
        field.SP_FSP_FlatPriceAmount = field.SP_FSP_FlatPriceAmount ? formatNumberAsGlobalSettingsModule(field.SP_FSP_FlatPriceAmount, 2) : '0.00';
        if(field.SP_FSP_FlatPriceAmount == 0.00 && field.SP_FSP_FXRatePerc > 0)
            field.SP_CalSPByPP_UnitSalePrice = field.SP_FSP_FXRatePerc ? formatNumberAsGlobalSettingsModule(field.SP_FSP_FXRatePerc, 2) : '0.00';
        else
            field.SP_CalSPByPP_UnitSalePrice = field.SP_FSP_FlatPriceAmount ? formatNumberAsGlobalSettingsModule(field.SP_FSP_FlatPriceAmount, 2) : '0.00';
    }

    getPercentValueSPUsingPP(field) {
        if(field.SalePriceSelectId == 2) {
            let vendorListPrice = field.PP_VendorListPrice ? parseFloat(field.PP_VendorListPrice.toString().replace(/\,/g,'')) : 0;
            
            let SP_CalSPByPP_MarkUpPercOnListPrice=0;
            this.itemQuantity.forEach((markup) => {
            if (markup.value == field.SP_CalSPByPP_MarkUpPercOnListPrice) 
            {
                SP_CalSPByPP_MarkUpPercOnListPrice = markup.label;
            }
            })
            
            let markUpAmount = ((vendorListPrice * SP_CalSPByPP_MarkUpPercOnListPrice) / 100);
            let baseSalePrice = vendorListPrice + markUpAmount;
            let saleDiscAmount: any;
            let unitSalePrice: any;
            if (baseSalePrice) {
                saleDiscAmount = ((baseSalePrice * field.SP_CalSPByPP_SaleDiscPerc) / 100);
                saleDiscAmount = saleDiscAmount ? saleDiscAmount : 0;
                unitSalePrice = baseSalePrice - saleDiscAmount;
            }
            field.SP_CalSPByPP_BaseSalePrice = baseSalePrice ? formatNumberAsGlobalSettingsModule(baseSalePrice, 2) : '0.00';
            field.SP_CalSPByPP_MarkUpAmount = markUpAmount ? formatNumberAsGlobalSettingsModule(markUpAmount, 2) : '0.00';
            field.SP_CalSPByPP_SaleDiscAmount = saleDiscAmount ? formatNumberAsGlobalSettingsModule(saleDiscAmount, 2) : '0.00';
            field.SP_CalSPByPP_UnitSalePrice = unitSalePrice ? formatNumberAsGlobalSettingsModule(unitSalePrice, 2) : '0.00';
            
        }
        field.PP_LastListPriceDate = new Date();       
        field.PP_LastPurchaseDiscDate = new Date();
    }
    
    atasubchapterValues = [];
    selectedATachapter: any;
    
    getAircraftAllList() {
        this.aircraftManufacturerService.getAll().subscribe(
            details => this.onDataLoad(details[0]),
            error => {this.isSpinnerVisible = false;}
        );
    }
    private onDataLoad(allACList: any[]) {
        this.alertService.stopLoadingMessage();
        this.aircraftList = allACList;
    }

    arrayCountrylist: any[] = [];
    countryListOriginal: any[] = [];
    editCountryId: number;
    countrylist(strText = '') {
        if (this.arrayCountrylist.length == 0) {
            this.arrayCountrylist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Countries', 'countries_id', 'nice_name', strText, true, 20, this.arrayCountrylist.join(),this.currentUserMasterCompanyId).subscribe(res => {
            this.countryListOriginal = res.map(x => {
                return {
                    nice_name: x.label, countries_id: x.value
                }
            })
            this.countrycollection = this.countryListOriginal;
            this.countrycollection = [...this.countryListOriginal.filter(x => {
                return x.nice_name.toLowerCase().includes(strText.toLowerCase())
            })]
            
            if (this.editCountryId > 0) {
                this.exportInfo = {
                    ...this.exportInfo,
                    exportCountryId: getObjectById('countries_id', this.editCountryId, this.countryListOriginal)
                };
                this.editCountryId = 0;
            }
        })
    }

    filtercountry(event) {
        if (event.query !== undefined && event.query !== null) {
            this.countrylist(event.query);
        }
    }

    btnChange(){

        const isExportWeight = this.exportInfo.exportWeight ? (this.exportInfo.exportWeightUnit ? 1 : 0) : 1;
        const isEExportSize = this.exportInfo.exportSizeLength || this.exportInfo.exportSizeWidth || this.exportInfo.exportSizeHeight ? (this.exportInfo.exportSizeUnitOfMeasureId ? 1 : 0) : 1;

        if(this.exportInfo.exportECCN && isExportWeight && isEExportSize)
        {
            this.updateBtnExp = false;
        }
        else{
            this.updateBtnExp = true;
        }
    }
    selectedExportCountry(value) {
        this.updateBtnExp = false;

    }
    // filtercountry(event) {
    //     this.countrycollection = this.allCountryinfo;

    //     const countryNameFilterData = [...this.allCountryinfo.filter(x => {
    //         return x.label.toLowerCase().includes(event.query.toLowerCase())
    //     })]
    //     this.countrycollection = countryNameFilterData;
    // }

    changeOfTab(value) {
        if (value === 'General') {
            this.currentTab = 'General';
            this.activeMenuItem = 1;
            
        } else if (value === 'AircraftInfo') {
            this.currentTab = 'AircraftInfo';
            this.activeMenuItem = 2;
            this.aircraftManfacturerData();
            //this.getAircraftModelsData();    
        } else if (value === 'Atachapter') {
            this.currentTab = 'Atachapter';
            this.activeMenuItem = 3;
            this.getAllATAChapter();
            this.getAllSubChapters();
        } else if (value == "Capes") {
            this.currentTab = 'Capes';
            this.activeMenuItem = 4;
            this.getCapabilityType();
        } else if (value === 'PurchaseSales') {
            this.currentTab = 'PurchaseSales';
            this.activeMenuItem = 5;
            this.disablepurchaseSales = true;
            this.isSpinnerVisible = true;
            this.getUOMListAll();
            this.getCurrencyListAll();
            this.CurrencyData();
            this.Purchaseunitofmeasure();
            this.getDefaultCurrency();
            this.getConditionsList();
            this.getConditionListAll();
            this.getDiscountTableData();
            this.getPercentTableData();
            this.getItemMasterPurchaseSaleMaster();   
            this.isSpinnerVisible = false;     
        } else if (value === 'NhaTlaAlternateTab') {
            this.isSpinnerVisible = true;
            this.currentTab = 'NhaTlaAlternateTab';
            this.activeMenuItem = 6;
            this.isSpinnerVisible = false;
        } else if (value === "Exchange") {
            this.currentTab = 'Exchange';
            this.activeMenuItem = 7;
            this.getCurrencyListAll(); 
            this.exchLoan.loadData(this.ItemMasterId);            
        }
        else if (value === 'ExportInfo') {
            this.currentTab = 'ExportInfo';
            this.activeMenuItem = 8;
             if(!this.exportInfo.exportCurrencyId){
                this.getDefaultCurrency()
            }
            this.countrylist();
            this.getUOMListAll();
            this.getCurrencyListAll(); 
            this.getItemMasterExportInfoById(this.ItemMasterId)            
        }

        localStorage.setItem('currentTab', value);

    }
    changeOfNTAETab(value) {
        if (value === 'NHA') {
            this.currentNTAETab = 'NHA';
            this.activeNTAEMenuItem = 1;
        } else if (value === 'TLA') {
            this.currentNTAETab = 'TLA';
            this.activeNTAEMenuItem = 2;
        } else if (value === 'Alternate') {
            this.currentNTAETab = 'Alternate';
            this.activeNTAEMenuItem = 3;
        } else if (value == "Equivalency") {
            this.currentNTAETab = 'Equivalency';
            this.activeNTAEMenuItem = 4;
        }

    }
    //New Priority
    private loadPriority() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.priorityService.getPriorityList().subscribe(
            results => this.onDataSuccessful(results[0]),
            error => {this.isSpinnerVisible = false;}
        );
    }
    private onDataSuccessful(getPriorityList: Priority[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allPriorityInfo = getPriorityList;

    }
    priorityeventHandler(event) {
        let value = event.target.value.toLowerCase()
        if (this.selectedreason) {
            if (value == this.selectedreason.toLowerCase()) {
                this.disableSave = true;
            }
            else {
                this.disableSave = false;
            }
        }
    }
    priorityId(event) {
        for (let i = 0; i < this.allpriority.length; i++) {
            if (event == this.allpriority[i][0].priorityName) {
                this.disableSave = true;
                this.selectedreason = event;
            }
        }
    }
    filterpriorities(event) {
        this.localCollection = [];
        for (let i = 0; i < this.allPriorityInfo.length; i++) {
            let priorityName = this.allPriorityInfo[i].description;
            if (priorityName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.allpriority.push([{
                    "priorityId": this.allPriorityInfo[i].priorityId,
                    "priorityName": priorityName
                }]),
                    this.localCollection.push(priorityName);
            }
        }
    }
   
    redirectToSingleScreenIntegration(){
        this.router.navigateByUrl('/singlepages/singlepages/app-integration');
    }
  

    integrationeventHandler(event) {
        let value = event.target.value.toLowerCase();
        if (this.selectedActionName) {
            if (value == this.selectedActionName.toLowerCase()) {
                this.disableSave = true;
            }
            else {
                this.disableSave = false;
            }
        }

    }
    integrationId(event) {
        for (let i = 0; i < this.actionamecolle.length; i++) {
            if (event == this.actionamecolle[i][0].integrationName) {
                this.disableSave = true;
                this.selectedActionName = event;
            }
        }
    }
    Exportuom(content) {
        this.isDeleteMode = false;
        this.isSaving = true;
        this.sourceUOM = new UnitOfMeasure();
        this.sourceUOM.isActive = true;
        this.unitName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    StockUOMstandard(event) {
        if (this.allUnitOfMeasureinfo) {
            for (let i = 0; i < this.allUnitOfMeasureinfo.length; i++) {
                if (event == this.allUnitOfMeasureinfo[i].shortName) {
                    this.disableSaveStockUOM = true;
                    this.selectedStockUOM = event;
                }

            }
        }
    }
    consumeUOMstandard(event) {
        if (this.allUnitOfMeasureinfo) {
            for (let i = 0; i < this.allUnitOfMeasureinfo.length; i++) {
                if (event == this.allUnitOfMeasureinfo[i].standard) {
                    this.disableSaveConsume = true;
                    this.selectedConsume = event;
                }
                else {
                    this.disableSaveConsume = false;
                }

            }
        }
    }

    saveexportuom() {
        this.isSaving = true;
        this.disableuomvalue = false;
        this.sourceUOM.createdBy = this.userName;
        this.sourceUOM.updatedBy = this.userName;
        this.sourceUOM.description = this.unitName;
        this.sourceUOM.masterCompanyId = this.currentUserMasterCompanyId;
        this.unitService.newUnitOfMeasure(this.sourceUOM).subscribe(data => {
            this.sourceItemMaster.consumeUnitOfMeasureId = data.unitOfMeasureId;
            this.Purchaseunitofmeasure();
        })
        this.modal.close();
    }

    filterStandardUOM(event) {
        this.unitofmeasureValue = [];
        if (this.allUnitOfMeasureinfo) {
            for (let i = 0; i < this.allUnitOfMeasureinfo.length; i++) {
                let unitName = this.allUnitOfMeasureinfo[i].shortName;
                if (unitName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.unitofmeasureValue.push(unitName)
                }
            }
        }

    }
    filterconsumeUOM(event) {
        this.unitofmeasureValue = [];
        if (this.allUnitOfMeasureinfo) {
            for (let i = 0; i < this.allUnitOfMeasureinfo.length; i++) {
                let unitName = this.allUnitOfMeasureinfo[i].standard;
                if (unitName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                    this.unitofmeasureValue.push(unitName)
                }
            }
        }

    }
    filterintegrations(event) {
        this.localmanufacturer = [];
        for (let i = 0; i < this.allIntegrationInfo.length; i++) {
            let integrationName = this.allIntegrationInfo[i].description;
            if (integrationName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.actionamecolle.push([{
                    "chargeId": this.allIntegrationInfo[i].integrationPortalId,
                    "integrationName": integrationName
                }]),
                    this.localmanufacturer.push(integrationName);
            }
        }
    }

    saveIntegration() {

        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.portalURL = this.portalURL;
            this.integrationService.newAction(this.sourceAction).subscribe((data) => { this.Integration(); },
                role => this.saveSuccessHelper(role)
            );
        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.description = this.integrationName;
            this.sourceAction.portalURL = this.portalURL;
            this.integrationService.updateAction(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => {this.isSpinnerVisible=false});
        }

        this.modal.close();
    }
    onSubmit(value) {

    }

    toGetAllDocumentsList(itemMasterId) {
        var moduleId = this.schematicAttachModuleId;
        this.commonService.GetDocumentsList(itemMasterId, moduleId).subscribe(res => {
            this.allUploadedDocumentsList = res;
        })
    }
    downloadFileUpload(rowData) {
        this.commonService.toDownLoadFile(rowData.link);
    }

    getAttachmentDeleteById(rowData) {
        let attachmentDetailId = rowData.attachmentDetailId;
        let updatedBy = this.userName;

        this.commonService.GetAttachmentDeleteById(attachmentDetailId, updatedBy).subscribe(res => {
            this.toGetAllDocumentsList(this.itemMasterId);
            this.documentDeleted = true;
        })
    }
    
    onViewAircraft(rowData) {
        this.viewAircraftData = rowData;
    }
    onViewAircraftonDbl(rowData) {
        this.onViewAircraft(rowData);
        $('#viewAircraft').modal('show');
    }

    onViewATAonDbl(rowData) {
        this.onViewATA(rowData);
        $('#viewATA').modal('show');
    }

    onViewATA(rowData) {
        this.viewATAData = rowData;
    }

    onEditAircraft(rowData) {
        this.editAirCraftData = {...rowData};
        this.editAircraftTypeID = this.editAirCraftData.aircraftTypeId;
        if(this.editAirCraftData.aircraftModel != 'Unknown'){
            this.getAircraftModelByManfacturerforEdit(this.editAirCraftData.aircraftTypeId);
            this.editAirCraftData["isModelUnknown"] = false;
        }
         else {
             this.editAirCraftData["isModelUnknown"] = true;
       
         }
        if(this.editAirCraftData.dashNumber != 'Unknown'){
            this.editAirCraftData["isDashNumberUnknown"] = false;
            if(this.editAirCraftData.aircraftModelId){
                this.getDashNumberByTypeandModelForEdit(this.editAirCraftData.aircraftModelId)
            }
            
        }       
        else {
            this.editAirCraftData["isDashNumberUnknown"] = true;
        }

        // disable check boxes
        if(this.editAirCraftData.aircraftModel){
           
        } else{
            this.editAirCraftData["isModelUnknown"] = true;
            this.resetAircraftModelsorDashNumbersForEdit();
            //this.checkCanAircraftEditable();
        }

        if(this.editAirCraftData.dashNumber){
           
        } else{
            this.editAirCraftData["isDashNumberUnknown"] = true;
            this.resetAircraftModelsorDashNumbersForEdit();
            //this.checkCanAircraftEditable();
        }
        this.canEditAircraft = false;

    }
    editATAInformation(rowData){    
        
        this.selectedAtaInformation  = rowData;
        this.ataChapterEditMode = true;
        this.getATASubChapterByATAChapterForEdit('no')
        this.ataform = this.fb.group({
            atanumber: new FormControl(0),
            atasubchaptername: new FormControl('')
        });
    }

    updateAircraft() {
        if(this.editAirCraftData.isModelUnknown == true){
            this.editAirCraftData.dashNumber = 'Unknown';
            this.editAirCraftData.aircraftModel = 'Unknown';
            this.editAirCraftData.model = 'Unknown';
            this.editAirCraftData.isDashNumberUnknown = true;
            this.editAirCraftData.dashNumber = 'Unknown';
        }
        if(this.editAirCraftData.isDashNumberUnknown == true){
            this.editAirCraftData.dashNumber = 'Unknown'; //DashNumber
        }
        
        const data = {...this.editAirCraftData,
                itemMasterId: this.itemMasterId,
                partNumber: this.pnvalue,
                aircraftType: this.editAirCraftData.aircraftType,
                aircraft: this.editAirCraftData.aircraft,
                dashNumberId: this.editAirCraftData.isDashNumberUnknown === true ? null : this.editAirCraftData.dashNumberId,
                AircraftModelId: this.editAirCraftData.isModelUnknown === true ? null : this.editAirCraftData.AircraftModelId,
                
             updatedBy: this.userName, createdBy: this.userName, isActive: true};
        this.itemser.updateItemMasterAircraftById(data).subscribe(res => {
            this.alertService.showMessage(
                'Success',
                'Aircraft Information Updated Successfully for PN: ' + this.pnvalue,
                MessageSeverity.success
            );
            this.getAircraftMappedDataByItemMasterId();
        });
    }

    getAircraftAuditHistory(rowData) {
        this.itemser.getItemMasterAircraftAuditHistory(rowData.itemMasterAircraftMappingId).subscribe(res => {
            this.aircraftauditHistory = res;
        });
        
    }
    getAtaChapterAuditHistory(rowData) {
        this.itemser.getATAMappedAudit(rowData.itemMasterATAMappingId).subscribe(res => {
            this.ataChapterAuditHistory = res;
        });
        
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.aircraftauditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    getColorCodeForHistoryATA(i, field, value) {
        const data = this.ataChapterAuditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    getDefaultCurrency() {
        this.legalEntityId = this.currentUserLegalEntityId;
        this.commonService.getDefaultCurrency(this.legalEntityId,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.exportInfo.exportCurrencyId = res.currencyId;
        })
    }

    onCheckPMA() {
        this.sourceItemMaster.isOemPNId = undefined;
    }

    onAddTextAreaInfo(value) {    
         
		if(value == 'memo') {
            this.textAreaLabel = 'Memo';   
            this.disableSaveMemo = true;            
			this.textAreaInfo = this.sourceItemMaster.memo;
		}
	}

	onSaveTextAreaInfo() {
		if(this.textAreaLabel == 'Memo') {
			this.sourceItemMaster.memo = this.textAreaInfo;
		}
    }
    get currentUserLocalId(): number {
        return this.authService.currentUser
          ? this.authService.currentUserLocalId
          : 'en-US';
    }
    addDocumentDetails() {
        this.selectedFileAttachment = [];

        this.isEditButton = false;
        this.documentInformation = {

            docName: '',
            docMemo: '',
            docDescription: '',
            attachmentDetailId: 0
        }
    }
    dismissDocumentPopupModel(type) {
        this.fileUploadInput.clear();
        this.closeMyModel(type);
        this.disableDocSave = true;
    }
    closeMyModel(type) {
        $(type).modal("hide");

    }

    downloadFileUploadNew(link) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${link}`;
        window.location.assign(url);
    }

    fileUpload(event) {

        if (event.files.length === 0){
			return  this.disableDocSave = true;
		}else{
			this.disableDocSave = false;	
		}

        const filesSelectedTemp = [];
        this.selectedFileAttachment = [];
        for (let file of event.files) {
            filesSelectedTemp.push({
                link: file.objectURL,
                fileName: file.name,
                isFileFromServer: false,
                fileSize: file.size,
            })


            this.formData.append(file.name, file);
        }

        for (var i = 0; i < filesSelectedTemp.length; i++) {
            this.selectedFileAttachment.push({

                docName: this.documentInformation.docName,
                docMemo: this.documentInformation.docMemo,
                docDescription: this.documentInformation.docDescription,
                createdBy: this.userName,
                updatedBy: this.userName,
                link: filesSelectedTemp[i].link,
                fileName: filesSelectedTemp[i].fileName,
                fileSize: filesSelectedTemp[i].fileSize,

                isFileFromServer: false,
                attachmentDetailId: 0,

            })
        }
    }
    onFileChanged(event) {
        this.selectedFile = event.target.files[0];
    }

    enableSave() {
        if(this.sourceViewforDocumentList && this.sourceViewforDocumentList.length>0){
            this.disableDocSave = false;
        }else if(this.isEditButton == true){
            this.disableDocSave = false; 
        }else{
            this.disableDocSave = true; 
        }
    }

    enableSaveMemo() {
        this.disableSaveMemo = false;
        this.disableSaveForEdit=false;
    }

    addDocumentInformation(type, documentInformation) {
        if (this.selectedFileAttachment != []) {
            for (var i = 0; i < this.selectedFileAttachment.length; i++) {
                this.sourceViewforDocumentList  = [...this.sourceViewforDocumentList, {

                    docName: documentInformation.docName,
                    docMemo: documentInformation.docMemo,
                    docDescription: documentInformation.docDescription,
                    link: this.selectedFileAttachment[i].link,
                    fileName: this.selectedFileAttachment[i].fileName,
                    isFileFromServer: false,
                    attachmentDetailId: 0,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    createdDate: Date.now(),
                    updatedDate: Date.now(),
                    fileSize: ((this.selectedFileAttachment[i].fileSize) / (1024 * 1024)).toFixed(2),
                }]

            
            }
            if(!this.isEditButton) {
                this.alertService.showMessage(
                    'Success',
                    `Saved Documents Successfully `,
                    MessageSeverity.success
                );
            } else {
                this.alertService.showMessage(
                    'Success',
                    `Updated Documents Successfully `,
                    MessageSeverity.success
                );
            }
            }

        if (documentInformation.attachmentDetailId > 0) {
            for (var i = 0; i <= this.sourceViewforDocumentList.length; i++) {
                if (this.sourceViewforDocumentList[i].attachmentDetailId == documentInformation.attachmentDetailId) {

                    this.sourceViewforDocumentList[i].docName = documentInformation.docName;
                    this.sourceViewforDocumentList[i].docMemo = documentInformation.docMemo;
                    this.sourceViewforDocumentList[i].docDescription = documentInformation.docDescription;
                    break;

                }
            }

            this.dismissDocumentPopupModel(type)

        }
        this.dismissDocumentPopupModel(type)

        if (this.fileUploadInput) {
            this.fileUploadInput.clear()
        }
        this.disableDocSave = true;

    }
    editCustomerDocument(rowdata) {
        this.selectedFileAttachment = [];
        this.isEditButton = true;
        this.documentInformation = rowdata;
        this.toGetDocumentView(rowdata.attachmentDetailId);

    }
    deleteAttachmentRow(rowdata, index, content) {
        this.selectedRowForDelete = rowdata;
        this.rowIndex = index;
        this.modal = this.modalService.open(content, { size: 'sm' });
    }
    deleteItemAndCloseModelNew() {
        let attachmentDetailId = this.selectedRowForDelete.attachmentDetailId;
        if (attachmentDetailId > 0) {
            this.commonService.GetAttachmentDeleteById(attachmentDetailId, this.userName).subscribe(res => {
                this.toGetDocumentsListNew(this.ItemMasterId);
                this.alertService.showMessage(
                    'Success',
                    `Deleted Attachment  Successfully`,
                    MessageSeverity.success
                );
            })
        }
        else {
            this.sourceViewforDocumentList.splice(this.rowIndex, 1)
        }

        this.modal.close();
    }


    onUploadDocumentListNew() {
        // file upload
        const vdata = {
            referenceId: this.ItemMasterId,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
            moduleId: this.schematicAttachModuleId,
        }
        for (var key in vdata) {
            this.formData.append(key, vdata[key]);
        }
        this.formData.append('attachmentdetais', JSON.stringify(this.sourceViewforDocumentList));

        this.commonService.uploadDocumentsEndpoint(this.formData).subscribe(res => {
            this.formData = new FormData();
            this.toGetDocumentsListNew(this.ItemMasterId);
        });
    }

    toGetDocumentsListNew(id) {
        var moduleId = this.schematicAttachModuleId;
        this.commonService.GetDocumentsListNew(id, moduleId).subscribe(res => {
            this.sourceViewforDocumentList = res || [];
            this.allDocumentListOriginal = res;

            if (this.sourceViewforDocumentList.length > 0) {
                this.sourceViewforDocumentList.forEach(item => {
                    item["isFileFromServer"] = true;

                })
            }
        })
    }
    toGetDocumentView(id) {

        this.commonService.GetAttachment(id).subscribe(res => {
            this.sourceViewforDocument = res;
            this.schematicFilesListForView.push(this.sourceViewforDocument)
        })
    }
    dateFilterForTableNew(date, field) {

        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            const data = [...this.sourceViewforDocumentList.filter(x => {

                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.sourceViewforDocumentList = data;
        } else {
            this.sourceViewforDocumentList = this.allDocumentListOriginal;
        }
    }

    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.sourceViewforDocumentAudit = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
       
    }
    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        setTimeout(() => this.alertService.stopLoadingMessage(), 5000);
    }

    // openHistory(content, rowData) {
    //     this.alertService.startLoadingMessage();

    //     this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
    //         results => this.onAuditHistoryLoadSuccessful(results, content),
    //         error => {this.isSpinnerVisible = false});
    // }
    openHistoryOfPurchaseAndSales(content, rowData) {
        this.alertService.startLoadingMessage();

        this.commonService.GetPurchaseAndSalesAuditHistory(rowData.itemMasterPurchaseSaleId).subscribe(
            results => this.onHistoryOfPurchaseandSalesSuccess(results, content),
            error => {this.isSpinnerVisible = false});
    }
    private onHistoryOfPurchaseandSalesSuccess(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.sourceViewforPurchaseandSalesAudit = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }
    getColorCodeForHistoryForDoc(i, field, value) {
        const data = this.sourceViewforDocumentAudit;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    getColorCodeForHistoryForPandS(i, field, value) {
        const data = this.sourceViewforPurchaseandSalesAudit;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    removeFileNew(event) {
        this.formData.delete(event.file.name)
        this.uploadedFileLength--;
        this.selectedFileAttachment = this.selectedFileAttachment.filter(({ fileName }) => fileName !== event.file.name);
        if(this.selectedFileAttachment.length == 0){
        this.disableDocSave = true;
        }
    }
    private getConditionListAll() {
        this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(response => {
			this.allConditionsList = response;
		});
    }

    private getUOMListAll() {
        this.commonService.autoSuggestionSmartDropDownList('UnitOfMeasure', 'unitOfMeasureId', 'shortname','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {
            this.allPurchaseInfoListActiveandInactive = res;
        })
    }

    private getCurrencyListAll() {
       // this.commonService.smartDropDownWithStatusList('Currency', 'CurrencyId', 'Code').subscribe(res => {
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code','', false, 0,'0',this.currentUserMasterCompanyId).subscribe(res => {
            this.allCurrencyInfoActiveandInactive = res;
        })
    }

    nextOrPreviousClick(nextOrPrevious) {
        this.nextOrPreviousTab = nextOrPrevious;
        //if (this.formdataexportinfo.form.dirty) {
        if (!this.disableSaveForEdit) {            
            let content = this.tabRedirectConfirmationModal;
            this.modal = this.modalService.open(content, { size: 'sm' });
        }
        else {
            //this.formdataexportinfo.reset();
            this.stopmulticlicks = true;
            if(this.nextOrPreviousTab == "Next"){
                if(this.activeMenuItem == 1) this.changeOfTab('AircraftInfo');
                if(this.activeMenuItem == 5) this.changeOfTab('NhaTlaAlternateTab');
            }
            if(this.nextOrPreviousTab == "Previous"){
                if(this.activeMenuItem == 5) this.changeOfTab('Capes');
                if(this.activeMenuItem == 8) this.changeOfTab('Exchange')
            }
            setTimeout(() => {
                this.stopmulticlicks = false;
            }, 500)
        }

    }
    redirectToTab(addItemMasterStockForm){
        this.dismissModel();
        
        if (!this.disableSaveForEdit) {   
            if(this.activeMenuItem == 1) {       
                this.saveItemMasterGeneralInformation(addItemMasterStockForm)
            }
        }
        if(this.nextOrPreviousTab == "Next"){
            if(this.activeMenuItem == 1) this.changeOfTab('AircraftInfo');
            if(this.activeMenuItem == 5) this.changeOfTab('NhaTlaAlternateTab');
        }
        if(this.nextOrPreviousTab == "Previous"){
            if(this.activeMenuItem == 5) this.changeOfTab('Capes');
            if(this.activeMenuItem == 8) this.changeOfTab('Exchange')
        }

    }
    onCheckOem(){
        if(this.sourceItemMaster.isOEM == 'true'){
            this.sourceItemMaster.isOemPNId = undefined;
        }
    }
    leadtime(){        
        this.sourceItemMaster.leadTimeDays = this.sourceItemMaster.leadTimeDays ? formatNumberAsGlobalSettingsModule(this.sourceItemMaster.leadTimeDays, 2) : '0'; 
        this.disableSaveForEdit=false;
    }

    onChangeExportVal() {
        this.exportInfo.exportValue = this.exportInfo.exportValue ? formatNumberAsGlobalSettingsModule(this.exportInfo.exportValue, 2) : '0.00';
    }
    onChangeWeight() {
        this.exportInfo.exportWeight = this.exportInfo.exportWeight ? formatNumberAsGlobalSettingsModule(this.exportInfo.exportWeight, 2) : '0';
    }
    onChangeExportSizeLength(){
        this.exportInfo.exportSizeLength = this.exportInfo.exportSizeLength ? formatNumberAsGlobalSettingsModule(this.exportInfo.exportSizeLength, 2) : '0';
    }
    onChangeExportSizeWidth(){
        this.exportInfo.exportSizeWidth = this.exportInfo.exportSizeWidth ? formatNumberAsGlobalSettingsModule(this.exportInfo.exportSizeWidth, 2) : '0';
    }
    onChangeExportSizeHeight(){
        this.exportInfo.exportSizeHeight = this.exportInfo.exportSizeHeight ? formatNumberAsGlobalSettingsModule(this.exportInfo.exportSizeHeight, 2) : '0';
    }
    getItemMasterExportInfoById(id) {
        this.isSpinnerVisible = true;    
		this.itemser.getItemMasterExportInfoById(id).subscribe(res => {
			if (res[0] != null && res[0] != undefined) {
                                
                if (res[0].exportCountryId > 0) {
                     this.arrayCountrylist.push(res[0].exportCountryId);
                     this.editCountryId = res[0].exportCountryId;
                     this.countrylist(res[0].exportCountryName)
                }                     
                
                const responseDataExpInfoOfEdit = res[0];
                this.sourceExportInfo = {
                    ...responseDataExpInfoOfEdit
                };
               
				this.exportInfo = {
                    ...responseDataExpInfoOfEdit,

                exportSizeUnitOfMeasureId: this.getInactiveObjectOnEditExportInfoUOM('value', this.sourceExportInfo.exportSizeUnitOfMeasureId, this.allSizeUnitOfMeasureInfo, 'UnitOfMeasure', 'unitOfMeasureId', 'shortname', 'SizeUOM'),
                exportECCN: this.sourceExportInfo.exportECCN,
                iTARNumber: this.sourceExportInfo.itarNumber,
                exportUomId: this.getInactiveObjectOnEditExportInfoUOM('value', this.sourceExportInfo.exportUomId, this.allExportUnitOfMeasureInfo, 'UnitOfMeasure', 'unitOfMeasureId', 'shortname', 'ExportUOM'),
                //exportCountryId: getObjectById('value', this.sourceExportInfo.exportCountryId, this.allCountryinfo),                
                exportCountryId: getObjectById('countries_id', this.sourceExportInfo.exportCountryId,this.countryListOriginal),
                exportValue: this.sourceExportInfo.exportValue ? formatNumberAsGlobalSettingsModule(this.sourceExportInfo.exportValue, 2) : '0.00',
                exportCurrencyId: this.getInactiveObjectOnEdit('value', this.sourceExportInfo.exportCurrencyId, this.allCurrencyInfo, 'Currency', 'CurrencyId', 'Code'),
                exportWeightUnit: this.getInactiveObjectOnEditExportInfoUOM('value', parseInt(this.sourceExportInfo.exportWeightUnit), this.allWeightUnitOfMeasureInfo, 'UnitOfMeasure', 'unitOfMeasureId', 'shortname', 'WeightUOM'),
                exportWeight: this.sourceExportInfo.exportWeight == 0 ? '' : this.sourceExportInfo.exportWeight,
                exportSizeLength: this.sourceExportInfo.exportSizeLength == 0 ? '' : this.sourceExportInfo.exportSizeLength,
                exportSizeWidth: this.sourceExportInfo.exportSizeWidth == 0 ? '' : this.sourceExportInfo.exportSizeWidth,
                exportSizeHeight: this.sourceExportInfo.exportSizeHeight == 0 ? '' : this.sourceExportInfo.exportSizeHeight,
                exportClassificationId: this.sourceExportInfo.exportClassificationId,
                }                                     
            }
            this.isSpinnerVisible = false;
        },
        error => {this.isSpinnerVisible = false})
    }

    ConsumeUOMdescription($event) {}
    SOLDUOMdescription($event) {}
    savewarnings() {}
    dismissModelNew() {}

    changeOfStatus(status){
        this.disableSaveForEdit=false;
    }     
    
    setcurrentdate(PP_FXRatePerc,field) {       
        field.PP_LastListPriceDate = new Date();       
        field.PP_LastPurchaseDiscDate = new Date();
    }

    SetSalesCurrency() {
        this.sourceItemMaster.salesCurrencyId = this.sourceItemMaster.purchaseCurrencyId;
    }
    clearSerchDataAirInfo(){
        this.selectedDashNumbers=undefined;
        this.selectedAircraftModel=undefined;
        this.selectAircraftManfacturer=undefined; 
    }
}