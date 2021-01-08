import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ConditionService } from '../../../services/condition.service';
import { Condition } from '../../../models/condition.model';
import { fadeInOut } from '../../../services/animations';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Integration } from '../../../models/integration.model';
import { IntegrationService } from '../../../services/integration-service';
import { HttpClient } from '@angular/common/http';
  
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AtaMainService } from '../../../services/atamain.service';
import { StocklineService } from '../../../services/stockline.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { SiteService } from '../../../services/site.service';
import { Site } from '../../../models/site.model';
import { BinService } from '../../../services/bin.service';
import { LegalEntityService } from '../../../services/legalentity.service';
import { CustomerService } from '../../../services/customer.service';
import { VendorService } from '../../../services/vendor.service';
import { GLAccountClassService } from '../../../services/glaccountclass.service';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { TreeNode } from 'primeng/api';
import { ManufacturerService } from '../../../services/manufacturer.service';
import { EmployeeService } from '../../../services/employee.service';

@Component({
    selector: 'app-stock-line-edit',
    templateUrl: './stock-line-edit.component.html',
	styleUrls: ['./stock-line-edit.component.scss'],
	animations: [fadeInOut]
})
/** stock-line-edit component*/
export class StockLineEditComponent implements OnInit, AfterViewInit
{
	showNormalQuantity: boolean = true;
	allSites: Site[]
	public sourceBin: any = {};
	allWareHouses: any;
	allLocations: any;
	allShelfs: any;
	wareHouseId: any;
	allBins: any;
	allTagTypes: any;
	bulist: any[];
	departmentList: any[];
	divisionlist: any[];
    allManagemtninfo: any[] = [];
    alllegalEntityInfo: any[] = [];
	copyOfAllManagemtninfo: any[] = [];
	maincompanylist: any[] = [];
	managementStructureList: any[] = [];
	divisionId: any;
	departmentId: any;
	businessUnitId: any;
	companyId: any;
	locationId: any;
	warehouseId: any;
	allintegrationdetails: any[];
	integrationvalues: any[] = [];
	allCustomer: any[];
	allVendorList: any[];
	allGLAccountClassData: any[];
	partCollection: any[];
	itemclaColl: any[];
	allPartnumbersInfo: any[];
	getCompanyListList: any[];
	selectedActionName: any;
	descriptionbyPart: any;
	sourcePartAction: any;
	selectedPartId: any;
	gridData: TreeNode[];
	cols1: any[];
	showManagement: boolean;
	allCompanys: any[];
	selectedOwnerFromValue: string = '';
	AllowEdit: boolean;
	hideSerialNumber: boolean;
	modelValue: boolean;
	allPolistInfo: any[] = [];
	allRolistInfo: any[] = [];
	allEmployeeList: any[] = [];
	testManagementStructure: any[] = [];
	currentStocklineIntegrationPortalData: any[];
	selectedModels: any[] = [];
    showRestrictQuantity: boolean;
    showquantity: boolean;
	collectionofstocklineIntegrationPortalData: any;
    attempToDelete: boolean = false;
	availableQty: number;
	invalidQtyError: boolean;
	showPartNumberError: boolean;
	disableSaveglAccount: boolean;
	glAccountcla: any[];
	glAccountCollection: any[];
	allglAccountInfo: any[];
	showCompanyError: boolean;
	showPartDescriptionError: boolean;
	showConditionError: boolean;
	showSiteError: boolean;
	showReceiveDateError: boolean;
	showReceiverNumberError: boolean;
	showGlAccountNumberError: boolean;
	QuantityOnHandError: boolean;
	hasSerialized: boolean;
	showSerialNumberError: boolean;

    stocklineEditForm = new FormGroup({
        companyId: new FormControl('companyId', Validators.minLength(1)),

    });

	ngOnInit(): void
	{
		this.stocklineser.currentUrl = '/stocklinemodule/stocklinepages/app-stock-line-edit';
		this.stocklineser.bredcrumbObj.next(this.stocklineser.currentUrl);
		this.loadData();
		this.loadCompanyData();
		this.loadManagementdata();
		this.loadSiteData();
		this.Integration();
		this.loadManufacturerData();
		this.loadPoData();
		this.loadRoData();
        this.loadIntegrationPortal();
        this.loadLegalEntityData();
		this.loadEmployeeData();
		this.glAccountlistdata();
		this.customerList();
		this.vendorList();
		this.loadGlAccountData();
		this.ptnumberlistdata();
		this.filterpartItems(this.sourceStockLineSetup.PartNumber);
		this.partnmId(this.sourceStockLineSetup.PartNumber);
		this.loadTagTypes();
	}
	selectedObtainFromValue: string = '';
	selectedTracableToValue: string = '';
	showLable: boolean;
	sourceStockLine: any = {};
	sourceStockLineSetup: any = {};
	sourceTimeLife: any = {};
	sourceItemMaster: any = {};
	loadingIndicator: boolean;
	private isDeleteMode: boolean = false;
	isDisabled = true;
	collectionofstockLine: any;
	value: number;
	displayError: boolean;
	modal: NgbModalRef;
	timeLifeEditAllow: any;
	allConditionInfo: Condition[] = [];
	allManufacturerInfo: any[] = [];
	allIntegrationInfo: any[] = [];
    managementStructureData: any[];

    constructor(private fb: FormBuilder, private empService: EmployeeService,public integrationService: IntegrationService,public vendorservice: VendorService, public manufacturerService: ManufacturerService, public itemser: ItemMasterService, public glAccountService: GLAccountClassService, public vendorService: VendorService, public customerService: CustomerService, public inteService: IntegrationService, public workFlowtService1: LegalEntityService, public workFlowtService: BinService, public siteService: SiteService, public integration: IntegrationService, public stocklineser: StocklineService, private http: HttpClient, public ataservice: AtaMainService, private changeDetectorRef: ChangeDetectorRef, private router: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public conditionService: ConditionService, private dialog: MatDialog) {
		this.dataSource = new MatTableDataSource();
        if (this.stocklineser.listCollection && this.stocklineser.isEditMode == true)
        {
            this.stocklineEditForm = fb.group({
                'companyId': [0, Validators.compose([Validators.required, Validators.minLength(1)])],
                'BusinessUnitId': [0],
                'divisionId': [0],
                'departmentId': [0],
            });
			this.showLable = true;
			this.sourceStockLine = this.stocklineser.listCollection; // Storing List Collection into this
			this.sourceStockLineSetup.managementStructureId = this.sourceStockLine.managementStructureId;
			this.sourceStockLineSetup.itemMasterId = this.sourceStockLine.im.itemMasterId;
			this.sourceStockLineSetup.stockLineId = this.sourceStockLine.stl.stockLineId;
			this.sourceStockLineSetup.PartNumber = this.sourceStockLine.partNumber;
			this.sourceStockLineSetup.partId = this.sourceStockLine.partId;
			this.selectedPartId = this.sourceStockLineSetup.partId //By Default Value
			this.sourceStockLineSetup.partNumber = this.sourceStockLine.partNumber;
			this.sourceStockLineSetup.partDescription = this.sourceStockLine.partDescription;
			this.sourceStockLineSetup.stockLineNumber = this.sourceStockLine.stockLineNumber;
			this.sourceStockLineSetup.controlNumber = this.sourceStockLine.controlNumber;
			this.sourceStockLineSetup.isSerialized = this.sourceStockLine.isSerialized;
			this.sourceStockLineSetup.condition = this.sourceStockLine.condition;
			this.sourceStockLineSetup.conditionId = this.sourceStockLine.conditionId;
			this.sourceStockLineSetup.serialNumber = this.sourceStockLine.serialNumber;
			if (this.sourceStockLineSetup.serialNumber)
			{
				this.sourceStockLineSetup.isSerialized = true;
			}

			if (this.sourceStockLineSetup.serialNumber == null)
			{
				this.sourceStockLineSetup.isSerialized = false;
			}
			if (this.sourceStockLineSetup.isSerialized == false) {
				this.hideSerialNumber = false;
			}
			else {
				this.hideSerialNumber = true;
			}
			this.sourceStockLineSetup.shelfLife = this.sourceStockLine.shelfLife;
			this.sourceStockLineSetup.shelfLifeExpirationDate = this.sourceStockLine.shelfLifeExpirationDate;
			this.sourceStockLineSetup.siteId = this.sourceStockLine.siteId;
			this.sourceStockLineSetup.warehouseId = this.sourceStockLine.warehouseId;
			this.sourceStockLineSetup.locationId = this.sourceStockLine.locationId;
			this.sourceStockLineSetup.obtainFrom = this.sourceStockLine.obtainFrom;
			this.sourceStockLineSetup.obtainFromType = this.sourceStockLine.obtainFromType;
			this.sourceStockLineSetup.ownerType = this.sourceStockLine.ownerType;
			this.sourceStockLineSetup.traceableToType = this.sourceStockLine.traceableToType;
			this.sourceStockLineSetup.unitCostAdjustmentReasonTypeId = this.sourceStockLine.unitCostAdjustmentReasonTypeId;
			this.sourceStockLineSetup.unitSalePriceAdjustmentReasonTypeId = this.sourceStockLine.unitSalePriceAdjustmentReasonTypeId;
			this.sourceStockLineSetup.idNumber = this.sourceStockLine.idNumber;
			this.sourceStockLineSetup.owner = this.sourceStockLine.owner;
			this.sourceStockLineSetup.traceableTo = this.sourceStockLine.traceableTo;
			this.sourceStockLineSetup.manufacturer = this.sourceStockLine.manufacturer;
			this.sourceStockLineSetup.manufacturerLotNumber = this.sourceStockLine.manufacturerLotNumber;
			this.sourceStockLineSetup.manufacturingDate = this.sourceStockLine.manufacturingDate;
			this.sourceStockLineSetup.manufacturingBatchNumber = this.sourceStockLine.manufacturingBatchNumber;
			this.sourceStockLineSetup.partCertificationNumber = this.sourceStockLine.partCertificationNumber;
			this.sourceStockLineSetup.certifiedBy = this.sourceStockLine.certifiedBy;
			this.sourceStockLineSetup.certifiedDate = this.sourceStockLine.certifiedDate;
			this.sourceStockLineSetup.tagDate = this.sourceStockLine.tagDate;
			this.sourceStockLineSetup.tagType = this.sourceStockLine.tagType;
			this.sourceStockLineSetup.certifiedDueDate = this.sourceStockLine.certifiedDueDate;
			this.sourceStockLineSetup.calibrationMemo = this.sourceStockLine.calibrationMemo;
			this.sourceStockLineSetup.orderDate = this.sourceStockLine.orderDate;
			this.sourceStockLineSetup.purchaseOrderNumber = this.sourceStockLine.purchaseOrderNumber;
			this.sourceStockLineSetup.purchaseOrderUnitCost = this.sourceStockLine.purchaseOrderUnitCost;
			this.sourceStockLineSetup.repairOrderNumber = this.sourceStockLine.repairOrderNumber;
			this.sourceStockLineSetup.repairOrderUnitCost = this.sourceStockLine.repairOrderUnitCost;
			this.sourceStockLineSetup.receivedDate = this.sourceStockLine.receivedDate;
			this.sourceStockLineSetup.receiverNumber = this.sourceStockLine.receiver;
			this.sourceStockLineSetup.reconciliationNumber = this.sourceStockLine.reconciliationNumber;
			this.sourceStockLineSetup.unitSalesPrice = this.sourceStockLine.unitSalesPrice;
			this.sourceStockLineSetup.coreUnitCost = this.sourceStockLine.coreUnitCost;
            this.sourceStockLineSetup.glAccountId = this.sourceStockLine.glAccountId;
            this.sourceStockLineSetup.glAccountName = this.sourceStockLine.glAccountName;
			this.sourceStockLineSetup.assetId = this.sourceStockLine.assetId;
			this.sourceStockLineSetup.isHazardousMaterial = this.sourceStockLine.isHazardousMaterial;
			this.sourceStockLineSetup.isPMA = this.sourceStockLine.isPMA;
			this.sourceStockLineSetup.isDER = this.sourceStockLine.isDER;
			this.sourceStockLineSetup.oem = this.sourceStockLine.oem;
			this.sourceStockLineSetup.memo = this.sourceStockLine.memo;
			this.sourceStockLineSetup.siteId = this.sourceStockLine.siteId;
			this.sourceStockLineSetup.shelfId = this.sourceStockLine.shelfId;
			this.sourceStockLineSetup.binId = this.sourceStockLine.binId;
			this.sourceStockLineSetup.controlNumber = this.sourceStockLine.controlNumber;
			this.sourceStockLineSetup.inventoryUnitCost = this.sourceStockLine.inventoryUnitCost;
			this.sourceStockLineSetup.timeLife = this.sourceStockLine.timeLife;
			this.sourceTimeLife.timeLife = this.sourceStockLine.timeLife;
			this.sourceStockLineSetup.timeLifeCyclesId = this.sourceStockLine.timeLifeCyclesId  //TimeLifeId
			this.sourceStockLineSetup.managementCode = this.sourceStockLine.code
            this.sourceStockLineSetup.itemTypeId = this.sourceStockLine.itemTypeId
            if (this.sourceStockLine.po != null) {
                this.sourceStockLineSetup.PurchaseOrderId = this.sourceStockLine.po.purchaseOrderId
            }
            if (this.sourceStockLine.ro != null) {
                this.sourceStockLineSetup.RepairOrderId = this.sourceStockLine.ro.repairOrderId
            }
            this.sourceStockLineSetup.manufacturerId = this.sourceStockLine.manufacturerId;
            this.sourceStockLineSetup.blackListed = this.sourceStockLine.blackListed;
            this.sourceStockLineSetup.blackListedReason = this.sourceStockLine.blackListedReason;
            this.sourceStockLineSetup.incident = this.sourceStockLine.incident;
            this.sourceStockLineSetup.incidentReason = this.sourceStockLine.incidentReason;
            this.sourceStockLineSetup.accident = this.sourceStockLine.accident;
            this.sourceStockLineSetup.accidentReason = this.sourceStockLine.accidentReason;
            this.sourceStockLineSetup.engineSerialNumber = this.sourceStockLine.engineSerialNumber;
			this.sourceStockLineSetup.aircraftTailNumber = this.sourceStockLine.aircraftTailNumber;
            this.sourceStockLineSetup.quantityOnHand = this.sourceStockLine.quantityOnHand
            this.sourceStockLineSetup.quantityReserved = this.sourceStockLine.quantityReserved
            this.sourceStockLineSetup.quantityIssued = this.sourceStockLine.quantityIssued
            this.sourceStockLineSetup.quantityAvailable = this.sourceStockLine.quantityAvailable;
			//TimeLife
			this.sourceTimeLife.timeLifeCyclesId = this.sourceStockLine.timeLifeCyclesId
			this.sourceTimeLife.cyclesSinceNew = this.sourceStockLine.cyclesSinceNew;
			this.sourceTimeLife.cyclesSinceOVH = this.sourceStockLine.cyclesSinceOVH;
			this.sourceTimeLife.cyclesSinceRepair = this.sourceStockLine.cyclesSinceRepair;
			this.sourceTimeLife.cyclesSinceInspection = this.sourceStockLine.cyclesSinceInspection;
			this.sourceTimeLife.timeSinceNew = this.sourceStockLine.timeSinceNew;
			this.sourceTimeLife.timeSinceOVH = this.sourceStockLine.timeSinceOVH;
			this.sourceTimeLife.timeSinceRepair = this.sourceStockLine.timeSinceRepair;
			this.sourceTimeLife.timeSinceInspection = this.sourceStockLine.timeSinceInspection;
			this.sourceTimeLife.lastSinceNew = this.sourceStockLine.lastSinceNew;
			this.sourceTimeLife.lastSinceOVH = this.sourceStockLine.lastSinceOVH;
			this.sourceTimeLife.lastSinceInspection = this.sourceStockLine.lastSinceInspection;
			//Loading Site,WareHouse,Location Values Based on Dependencies
			if (this.sourceStockLineSetup.siteId) {
				this.workFlowtService.getWareHouseDate(this.sourceStockLineSetup.siteId).subscribe( //calling and Subscribing for WareHouse Data
					results => this.onDataLoadWareHouse(results), //sending WareHouse
					error => this.onDataLoadFailed(error)
				);
			}
			if (this.sourceStockLineSetup.warehouseId) {
				this.workFlowtService.getLocationDate(this.sourceStockLineSetup.warehouseId).subscribe( //calling and Subscribing for Location Data
					results => this.onDataLoadLocation(results), //sending Location
					error => this.onDataLoadFailed(error)
				);
			}
			if (this.sourceStockLineSetup.locationId) {
				this.workFlowtService.getShelfDate(this.sourceStockLineSetup.locationId).subscribe( //calling and Subscribing for Location Data
					results => this.onDataLoadShelf(results), //sending Location
					error => this.onDataLoadFailed(error)
				);
			}
			if (this.sourceStockLineSetup.shelfId) {
				this.workFlowtService.getBinDataById(this.sourceStockLineSetup.shelfId).subscribe(
					results => this.onDataLoadBin(results), //sending Location
					error => this.onDataLoadFailed(error));
			}
			if (this.sourceStockLine.certifiedDate == "0001-01-01T00:00:00" || this.sourceStockLine.certifiedDate == undefined || this.sourceStockLine.certifiedDate == "undefined") {
				this.sourceStockLineSetup.certifiedDate = new Date();
			}
			else {
				this.sourceStockLineSetup.certifiedDate = new Date(this.sourceStockLine.certifiedDate);
			}
			if (this.sourceStockLine.certifiedDueDate == "0001-01-01T00:00:00" || this.sourceStockLine.certifiedDueDate == undefined || this.sourceStockLine.certifiedDueDate == "undefined") {
				this.sourceStockLineSetup.certifiedDueDate = new Date();
			}
			else {
				this.sourceStockLineSetup.certifiedDueDate = new Date(this.sourceStockLine.certifiedDueDate);
			}
			if (this.sourceStockLine.shelfLifeExpirationDate == "0001-01-01T00:00:00" || this.sourceStockLine.shelfLifeExpirationDate == undefined || this.sourceStockLine.shelfLifeExpirationDate == "undefined") {
				this.sourceStockLineSetup.shelfLifeExpirationDate = new Date();
			}
			else {
				this.sourceStockLineSetup.shelfLifeExpirationDate = new Date(this.sourceStockLine.shelfLifeExpirationDate);
			}
			if (this.sourceStockLine.manufacturingDate == "0001-01-01T00:00:00" || this.sourceStockLine.manufacturingDate == undefined || this.sourceStockLine.manufacturingDate == "undefined") {
				this.sourceStockLineSetup.manufacturingDate = new Date();
			}
			else {
				this.sourceStockLineSetup.manufacturingDate = new Date(this.sourceStockLine.manufacturingDate);
			}
			if (this.sourceStockLine.tagDate == "0001-01-01T00:00:00" || this.sourceStockLine.tagDate == undefined || this.sourceStockLine.tagDate == "undefined") {
				this.sourceStockLineSetup.tagDate = new Date();
			}
			else {
				this.sourceStockLineSetup.tagDate = new Date(this.sourceStockLine.tagDate);
			}
			if (this.sourceStockLine.orderDate == "0001-01-01T00:00:00" || this.sourceStockLine.orderDate == undefined || this.sourceStockLine.orderDate == "undefined") {
				this.sourceStockLineSetup.orderDate = new Date();
			}
			else {
				this.sourceStockLineSetup.orderDate = new Date(this.sourceStockLine.orderDate);
			}
			if (this.sourceStockLine.receivedDate == "0001-01-01T00:00:00" || this.sourceStockLine.receivedDate == undefined || this.sourceStockLine.receivedDate == "undefined") {
				this.sourceStockLineSetup.receivedDate = new Date();
			}
			else {
				this.sourceStockLineSetup.receivedDate = new Date(this.sourceStockLine.receivedDate);
			}
		}
    }

    loadLegalEntityData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.workFlowtService1.getManagemtentLengalEntityData().subscribe(
            results => this.onManagemtntlegaldataLoad(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onManagemtntlegaldataLoad(getAtaMainList: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.alllegalEntityInfo = getAtaMainList;
        for (let i = 0; i < this.alllegalEntityInfo.length; i++) {
            if (this.alllegalEntityInfo[i].parentId == null) {
                this.maincompanylist.push(this.alllegalEntityInfo[i]);
            }
        }
    }

	private ptnumberlistdata() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;
		this.itemser.getPrtnumberslistList().subscribe(
			results => this.onptnmbersSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private glAccountlistdata() {
		 this.alertService.startLoadingMessage();
		this.loadingIndicator = true;
		let value = "Stock";
		this.itemser.getItemStockList(value).subscribe(
			results => this.onglAccountSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onglAccountSuccessful(allWorkFlows: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allglAccountInfo = allWorkFlows;
	}
	private onptnmbersSuccessful(allWorkFlows: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allPartnumbersInfo = allWorkFlows;
	}
	glAccountHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedActionName) {
				if (value == this.selectedActionName.toLowerCase()) {
					this.disableSaveglAccount = true;
				}
				else {
					this.disableSaveglAccount = false;
				}
			}
		}
	}

	glAccountId(event) {
		if (this.glAccountcla) {
			for (let i = 0; i < this.glAccountcla.length; i++) {
				if (event == this.glAccountcla[i][0].glAccountId) {
					this.sourceStockLineSetup.itemMasterId = this.itemclaColl[i][0].ItemMasterId;
				}
			}
		}
	}

	filterglAccount(event) {
		this.glAccountCollection = [];
		this.glAccountcla = [];
		if (this.allglAccountInfo) {
			for (let i = 0; i < this.allglAccountInfo.length; i++) {
				let glAccountId = this.allglAccountInfo[i].glAccountId;
				if (glAccountId) {
					this.glAccountCollection.push(glAccountId);
				}
			}
		}
	}

	loadEmployeeData() {
		this.empService.getEmployeeList().subscribe(
			results => this.onDataLoadEmployeeSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}
	onDataLoadEmployeeSuccessful(allWorkFlows: any[]) {
		this.dataSource.data = allWorkFlows;
		this.allEmployeeList = allWorkFlows;
	}

	ChnageValue(value) {
		this.sourceStockLineSetup.obtainFrom = "";
		this.sourceStockLineSetup.obtainFrom = null;
		this.sourceStockLineSetup.obtainFrom = '';

	}
	ChnageOwnerValue(value)
	{
		this.sourceStockLineSetup.owner = "";
	}
	ChnageTracebleValue(value)
	{
		this.sourceStockLineSetup.traceableTo = "";
	}
	loadPoData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.vendorservice.getPurchaseOrderlist().subscribe(
			results => this.onPoListDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	onPoListDataLoadSuccessful(getCreditTermsList: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getCreditTermsList;

		this.allPolistInfo = getCreditTermsList;

	}

	loadRoData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.vendorservice.getRepaireOrderlist().subscribe(
			results => this.onDataLoadRepairOrderDataSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}
	onDataLoadRepairOrderDataSuccessful(getCreditTermsList: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getCreditTermsList;
		this.allRolistInfo = getCreditTermsList;

	}

	private Integration() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.inteService.getWorkFlows().subscribe(
			results => this.onIntegrationData(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	loadManufacturerData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;
		this.manufacturerService.getWorkFlows().subscribe(
			results => this.onmanufacturerSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onmanufacturerSuccessful(allWorkFlows: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allManufacturerInfo = allWorkFlows;
	}

	private onIntegrationData(getEmployeeCerficationList: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getEmployeeCerficationList;
		this.allintegrationdetails = getEmployeeCerficationList;
		if (this.allintegrationdetails.length > 0) {
			for (let i = 0; i < this.allintegrationdetails.length; i++)
				this.integrationvalues.push(
					{ value: this.allintegrationdetails[i].integrationPortalId, label: this.allintegrationdetails[i].description },
				);
		}
	}

	private loadTagTypes() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;
		this.stocklineser.getAllTagTypes().subscribe(
			results => this.onLoadloadTagTypesSuccessful(results),
			error => this.onDataLoadFailed(error)
		);
	}

	private onLoadloadTagTypesSuccessful(allWorkFlows: any) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allTagTypes = allWorkFlows;
	}

	filterpartItems(event) {
		this.partCollection = [];
		this.itemclaColl = [];
		if (this.allPartnumbersInfo) {
			if (this.allPartnumbersInfo.length > 0) {
				for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
					let partName = this.allPartnumbersInfo[i].partNumber;
					if (partName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
						this.itemclaColl.push([{
							"partId": this.allPartnumbersInfo[i].partId,
							"partName": partName
						}]),

							this.partCollection.push(partName);
					}
				}
			}
		}


	}


	partnmId(event) {
		//debugger;
		if (this.itemclaColl) {
			for (let i = 0; i < this.itemclaColl.length; i++) {
				if (event == this.itemclaColl[i][0].partName) {
					this.selectedPartId = this.itemclaColl[i][0].partId; //Storing PartId in Local
					console.log(this.selectedPartId);
					this.selectedActionName = event;
				}
			}
			this.itemser.getDescriptionbypart(event).subscribe(
				results => this.onpartnumberloadsuccessfull(results[0]),
				error => this.onDataLoadFailed(error)
			);
		}
	}

	private onpartnumberloadsuccessfull(allWorkFlows: any[]) {
		this.descriptionbyPart = allWorkFlows[0]
		this.sourcePartAction = this.descriptionbyPart;
		this.sourceStockLineSetup.partDescription = allWorkFlows[0].partDescription; //Passing Part Description based on Change Part

		this.sourceStockLineSetup.isSerialized = allWorkFlows[0].isSerialized;

		this.sourceStockLineSetup.ITARNumber = allWorkFlows[0].t.itarNumber;
		this.sourceStockLineSetup.nationalStockNumber = allWorkFlows[0].t.nationalStockNumber;
		this.sourceStockLineSetup.ExportECCN = allWorkFlows[0].t.exportECCN;
		this.sourceStockLineSetup.NHA = allWorkFlows[0].t.nha;
		this.sourceStockLineSetup.tagDate = allWorkFlows[0].t.TagDate;
		this.sourceStockLineSetup.openDate = allWorkFlows[0].t.openDate;
		this.sourceStockLineSetup.tagDays = allWorkFlows[0].t.tagDays;
		this.sourceStockLineSetup.manufacturingDays = allWorkFlows[0].t.manufacturingDays
		this.sourceStockLineSetup.daysReceived = allWorkFlows[0].t.daysReceived
		this.sourceStockLineSetup.openDays = allWorkFlows[0].t.openDays

		if (this.sourceStockLineSetup.isSerialized == true) {
			this.hideSerialNumber = true;
			this.showRestrictQuantity = true;
			this.showNormalQuantity = false;
		}
		else {
			this.hideSerialNumber = false;
			this.showRestrictQuantity = false;
			this.showNormalQuantity = true;

		}

		if (this.sourceStockLineSetup.isSerialized == null)
		{
			this.sourceStockLineSetup.isSerialized == false;
		}
	}

	private customerList() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.customerService.getWorkFlows().subscribe(
			results => this.onCustomerDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onCustomerDataLoadSuccessful(allCustomerFlows: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allCustomerFlows;
		this.allCustomer = allCustomerFlows;
	}

	private vendorList() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;
		this.vendorService.getVendorList().subscribe(
			results => this.onVendorDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}
	private onVendorDataLoadSuccessful(allVendorWorkFlows: any[]) {
		//debugger;
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allVendorWorkFlows;
		this.allVendorList = allVendorWorkFlows;
	}


	private loadIntegrationPortal() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.integrationService.getWorkFlows().subscribe(
			results => this.onDataLoadIntegrationSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	calculateQtyAvailable(event) {

		if (this.sourceStockLineSetup.quantityOnHand) { this.availableQty = this.sourceStockLineSetup.quantityOnHand };
		if (this.sourceStockLineSetup.quantityOnHand && this.sourceStockLineSetup.quantityReserved) {
			this.availableQty = this.sourceStockLineSetup.quantityOnHand - this.sourceStockLineSetup.quantityReserved
		}
		if (this.sourceStockLineSetup.quantityOnHand && this.sourceStockLineSetup.quantityReserved && this.sourceStockLineSetup.quantityIssued) {
			this.availableQty = this.sourceStockLineSetup.quantityOnHand - this.sourceStockLineSetup.quantityReserved - this.sourceStockLineSetup.quantityIssued;
		}
		this.sourceStockLineSetup.quantityAvailable = this.availableQty;
	}

	private onDataLoadIntegrationSuccessful(allWorkFlows: Integration[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allIntegrationInfo = allWorkFlows;

		this.loadIntegrationPortalDataIfIdExist();//loading Data Based on Id
	}

	private loadIntegrationPortalDataIfIdExist()
	{
		this.stocklineser.getStockLineIntegrationList(this.sourceStockLineSetup.stockLineId).subscribe(
			results => this.onDataIntegrationPortalForStockId(results),
			error => this.onDataLoadFailed(error)
		);
		
	}
	onDataIntegrationPortalForStockId(allWorkFlows: any[])
	{
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.currentStocklineIntegrationPortalData = allWorkFlows;
			if (allWorkFlows)
			{
				for (let i = 0; i < allWorkFlows.length; i++)
				{
					allWorkFlows[i].attempToDelete = false;
					this.selectedModels.push(JSON.parse(JSON.stringify(allWorkFlows[i])));
			}
		}
		if ((this.allIntegrationInfo) && (this.currentStocklineIntegrationPortalData))
		{
			for (let i = 0; i < this.currentStocklineIntegrationPortalData.length; i++)
			{
				for (let j = 0; j < this.allIntegrationInfo.length; j++)
				{
					if (this.allIntegrationInfo[j].integrationPortalId == this.currentStocklineIntegrationPortalData[i].integrationPortalId)
					{
						this.allIntegrationInfo[j].integratedCheckbox = true;

						if (this.currentStocklineIntegrationPortalData[i].isListed == true)
						{
							this.allIntegrationInfo[j].listedCheckbox = true;
						}

					}
				}
			}
		}
	}

	private loadGlAccountData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;
		this.glAccountService.getGlAccountClassList().subscribe(
			results => this.onDataLoadGlAccountSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onDataLoadGlAccountSuccessful(allWorkFlows: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allGLAccountClassData = allWorkFlows;
	}

	private loadSiteData()  //retriving SIte Information
	{
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.siteService.getSiteList().subscribe(   //Getting Site List Hear
			results => this.onSaiteDataLoadSuccessful(results), //Pasing first Array and calling Method
			error => this.onDataLoadFailed(error)
		);
	}


	private onDataLoadWareHouse(getWarehousList: any) { //Storing WareHouse Data

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allWareHouses = getWarehousList; //chaallIntegrationInfo
	}


	private onDataLoadLocation(getLocationList: any) { //Storing WareHouse Data

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allLocations = getLocationList; //cha
	}

	private onDataLoadShelf(getShelfList: any) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allShelfs = getShelfList; //cha
	}

	private onDataLoadBin(getBinList: any) {
		this.loadingIndicator = false;
		this.allBins = getBinList; //cha
	}
	private onSaiteDataLoadSuccessful(getSiteList) { //Storing Site Data
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getSiteList; //need
		this.allSites = getSiteList; //Contain first array of Loaded table Data will put in Html as [value]
	}

	siteValueChange(data) //Site Valu Selection in Form
	{
		this.allWareHouses = [];
		this.allLocations = [];
		this.allShelfs = [];
		this.allBins = [];

		this.sourceStockLineSetup.warehouseId = 0
		this.sourceStockLineSetup.locationId = 0;
		this.sourceStockLineSetup.shelfId = 0;
		this.sourceStockLineSetup.binId = 0;

		this.workFlowtService.getWareHouseDate(this.sourceStockLineSetup.siteId).subscribe( //calling and Subscribing for WareHouse Data
			results => this.onDataLoadWareHouse(results), //sending WareHouse
			error => this.onDataLoadFailed(error)
		);

	}

	wareHouseValueChange(warehouseId) {
		this.allLocations = [];
		this.allShelfs = [];
		this.allBins = [];
		this.sourceStockLineSetup.locationId = 0;
		this.sourceStockLineSetup.shelfId = 0;
		this.sourceStockLineSetup.binId = 0;
		this.workFlowtService.getLocationDate(warehouseId).subscribe( //calling and Subscribing for Location Data
			results => this.onDataLoadLocation(results), //sending Location
			error => this.onDataLoadFailed(error)
		);
	}

	eventHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedActionName) {
				if (value == this.selectedActionName.toLowerCase()) {
				}
				else {
				}
			}

		}
	}
	locationValueChange(locationId) {
		this.allShelfs = [];
		this.allBins = [];
		this.sourceStockLineSetup.shelfId = 0;
		this.sourceStockLineSetup.binId = 0;
		this.workFlowtService.getShelfDate(locationId).subscribe( //calling and Subscribing for Location Data
			results => this.onDataLoadShelf(results), //sending Location
			error => this.onDataLoadFailed(error)
		);

	}

	shelfValueChange(binId) {
		this.allBins = [];
		this.sourceStockLineSetup.binId = 0;
		this.workFlowtService.getBinDataById(binId).subscribe(
			results => this.onDataLoadBin(results), //sending Location
			error => this.onDataLoadFailed(error));
	}

    binValueSelect(data) { }

    private loadManagementdata() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.workFlowtService1.getManagemententity().subscribe(
            results => this.onManagemtntdataLoad(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onManagemtntdataLoad(getAtaMainList: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getAtaMainList;
        this.allManagemtninfo = getAtaMainList;
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == null) {
                this.maincompanylist.push(this.allManagemtninfo[i]);
            }
        }

        if (this.sourceStockLine.managmentLegalEntity != null && this.sourceStockLine.divmanagmentLegalEntity != null && this.sourceStockLine.biumanagmentLegalEntity != null && this.sourceStockLine.compmanagmentLegalEntity != null) {
            this.stocklineEditForm.controls['companyId'].setValue(this.sourceStockLine.compmanagmentLegalEntity.managementStructureId);
            this.stocklineEditForm.controls['BusinessUnitId'].setValue(this.sourceStockLine.biumanagmentLegalEntity.managementStructureId);
            this.stocklineEditForm.controls['divisionId'].setValue(this.sourceStockLine.divmanagmentLegalEntity.managementStructureId);
            this.stocklineEditForm.controls['departmentId'].setValue(this.sourceStockLine.mana.managementStructureId);
        }
        else if (this.sourceStockLine.biumanagmentLegalEntity != null && this.sourceStockLine.divmanagmentLegalEntity != null && this.sourceStockLine.managmentLegalEntity != null) {
            this.stocklineEditForm.controls['companyId'].setValue(this.sourceStockLine.biumanagmentLegalEntity.managementStructureId);
            this.stocklineEditForm.controls['BusinessUnitId'].setValue(this.sourceStockLine.divmanagmentLegalEntity.managementStructureId);
            this.stocklineEditForm.controls['divisionId'].setValue(this.sourceStockLine.managmentLegalEntity.managementStructureId);
        }
        else if (this.sourceStockLine.divmanagmentLegalEntity != null && this.sourceStockLine.managmentLegalEntity != null) {
            this.stocklineEditForm.controls['companyId'].setValue(this.sourceStockLine.divmanagmentLegalEntity.managementStructureId);
            this.stocklineEditForm.controls['BusinessUnitId'].setValue(this.sourceStockLine.managmentLegalEntity.managementStructureId);
        }
        else if (this.sourceStockLine.mana != null) {
            this.stocklineEditForm.controls['companyId'].setValue(this.sourceStockLine.managmentLegalEntity.managementStructureId);
        }
        this.setManagementStrucureData(this.sourceStockLine);
    }

    setManagementStrucureData(obj) {
        this.managementStructureData = [];
        this.checkMSParents(this.sourceStockLineSetup.managementStructureId);
        if (this.managementStructureData.length == 4) {
            this.sourceStockLineSetup.companyId = this.managementStructureData[3];
            this.sourceStockLineSetup.buisinessUnitId = this.managementStructureData[2];
            this.sourceStockLineSetup.departmentId = this.managementStructureData[1];
            this.sourceStockLineSetup.divisionId = this.managementStructureData[0];
            this.getBUList2(this.sourceStockLineSetup.companyId);
            this.getDepartmentlist2(this.sourceStockLineSetup.buisinessUnitId);
            this.getDivisionlist(this.sourceStockLineSetup.departmentId);
        }
        if (this.managementStructureData.length == 3) {
            this.sourceStockLineSetup.companyId = this.managementStructureData[2];
            this.sourceStockLineSetup.buisinessUnitId = this.managementStructureData[1];
            this.sourceStockLineSetup.departmentId = this.managementStructureData[0];
            this.getBUList2(this.sourceStockLineSetup.companyId);
            this.getDepartmentlist2(this.sourceStockLineSetup.buisinessUnitId);
        }
        if (this.managementStructureData.length == 2) {
            this.sourceStockLineSetup.companyId = this.managementStructureData[1];
            this.sourceStockLineSetup.buisinessUnitId = this.managementStructureData[0];
            this.getBUList2(this.sourceStockLineSetup.companyId);
        }
        if (this.managementStructureData.length == 1) {
            this.sourceStockLineSetup.companyId = this.managementStructureData[0];
        }

    }

    checkMSParents(msId) {
        this.managementStructureData.push(msId);
        for (let a = 0; a < this.allManagemtninfo.length; a++) {
            if (this.allManagemtninfo[a].managementStructureId == msId) {
                if (this.allManagemtninfo[a].parentId) {
                    this.checkMSParents(this.allManagemtninfo[a].parentId);
                    break;
                }
            }
        }
    }
    getBUList2(id) {
        var companyId = id;
        this.bulist = [];
        this.departmentList = [];
        this.divisionlist = [];
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == companyId) {
                this.bulist.push(this.allManagemtninfo[i])
            }
        }
    }

    getBUList(event) {
        var companyId = this.stocklineEditForm.controls['companyId'].value;
       
            this.sourceStockLineSetup.buisinessUnitId = null;
            this.stocklineEditForm.controls['BusinessUnitId'].setValue(null);
            this.stocklineEditForm.controls['divisionId'].setValue(null);
            this.stocklineEditForm.controls['departmentId'].setValue(null);
            this.sourceStockLineSetup.departmentId = "";
            this.sourceStockLineSetup.divisionId = "";
            this.sourceStockLineSetup.buisinessUnitId = "";
            this.bulist = [];
            this.departmentList = [];
            this.divisionlist = [];

            for (let i = 0; i < this.allManagemtninfo.length; i++) {
                if (this.allManagemtninfo[i].parentId == companyId) {
                    this.bulist.push(this.allManagemtninfo[i])
                }
            }
    }

    getDepartmentlist(value) {
        var splitted = value.split(": ");
        var businessUnitId = this.stocklineEditForm.controls['BusinessUnitId'].value;
        this.stocklineEditForm.controls['divisionId'].setValue(null);
        this.stocklineEditForm.controls['departmentId'].setValue(null);
        this.sourceStockLineSetup.departmentId = "";
        this.sourceStockLineSetup.divisionId = "";
        this.departmentList = [];
        this.divisionlist = [];
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == businessUnitId) {
                this.departmentList.push(this.allManagemtninfo[i]);
            }
        }
    }

    getDepartmentlist2(value) {

        this.departmentList = [];
        this.divisionlist = [];
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == value) {
                this.departmentList.push(this.allManagemtninfo[i]);
            }
        }

    }

    getDivisionlist(value) {
        var departmentId = this.stocklineEditForm.controls['divisionId'].value;;

        this.divisionlist = [];
        for (let i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].parentId == departmentId) {
                this.divisionlist.push(this.allManagemtninfo[i]);
            }
        }
    }

    divisionChange(divisionId) {
        this.sourceStockLineSetup.managementStructureId = divisionId;
    }

	POValueChange(POId) {
	}
	ROValueChange(RoId) {
	}
	private onDataLoadFailed(error: any) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
	}
	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	private saveCompleted(user?: any) {
		if (this.isDeleteMode == true) {
			this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
			this.isDeleteMode = false;
		}
		else {
			this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);

		}
	}

	private saveFailedHelper(error: any) {
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
	}

	savestockLineclose() {
		if ((this.sourceStockLineSetup.partNumber)) {
			this.showPartNumberError = false;
		}
		else {
			this.showPartNumberError = true;
			this.displayError = true;
		}

		if (this.stocklineEditForm.get('companyId').value || this.sourceStockLineSetup.legalEntityId) {
			this.showCompanyError = false;
		}
		else {
		this.showCompanyError = true;
			this.displayError = true;
		}

		if (this.sourceStockLineSetup.conditionId) {
			this.showConditionError = false;
		}
		else {
		this.showConditionError = true;
			this.displayError = true;
		}

		if (this.sourceStockLineSetup.siteId) {
			this.showSiteError = false;
		}
		else {
		this.showSiteError = true;
			this.displayError = true;
		}

		if (this.sourceStockLineSetup.receivedDate) {
			this.showReceiveDateError = false;
		}
		else {
		this.showReceiveDateError = true;
			this.displayError = true;
		}

		if (this.sourceStockLineSetup.receiverNumber) {
			this.showReceiverNumberError = false;
		}
		else {
		this.showReceiverNumberError = true;
			this.displayError = true;
		}

		if (this.sourceStockLineSetup.quantityOnHand) {
			this.QuantityOnHandError = false;
		}
		else {
		this.QuantityOnHandError = true;
			this.displayError = true;
		}

		if (this.sourceStockLineSetup.isSerialized != null) {
			if ((this.sourceStockLineSetup.isSerialized == true) && (this.sourceStockLineSetup.serialNumber)) {
				this.showSerialNumberError = false;
			}
			else if ((this.sourceStockLineSetup.isSerialized == false) && (!this.sourceStockLineSetup.serialNumber)) {
				this.showSerialNumberError = false;
			}
			else {
				this.showSerialNumberError = true;
				this.displayError = true;
			}
		}

		if (this.availableQty > 0 || this.sourceStockLineSetup.quantityAvailable >0) {
			this.invalidQtyError = false;
		}
		else {
			this.invalidQtyError = true;
			this.displayError = true;
		}
		if (!this.displayError) {
			if ((this.sourceStockLineSetup.isSerialized == true) && (this.sourceStockLineSetup.serialNumber)) {
				if (!this.sourceStockLine.stockLineId) {
					this.sourceStockLine.createdBy = this.userName;
					this.sourceStockLine.updatedBy = this.userName;
					this.sourceStockLine.masterCompanyId = 1;
					this.sourceStockLine.itemTypeId = 1;
					this.stocklineser.newStockLine(this.sourceStockLine).subscribe(data => {
						this.collectionofstockLine = data;
						this.router.navigateByUrl('/stocklinemodule/stocklinepages/app-stock-line-list')
						this.value = 1;
					})
				}
				else {
					this.sourceStockLineSetup.updatedBy = this.userName;
					this.sourceStockLineSetup.masterCompanyId = 1;
					this.sourceItemMaster.itemMasterId = this.sourceStockLineSetup.itemMasterId;
					this.sourceItemMaster.partId = this.selectedPartId
					if (this.stocklineEditForm.get('departmentId').value != null && this.stocklineEditForm.get('departmentId').value > 0) {
						this.sourceStockLineSetup.managementStructureId = this.stocklineEditForm.get('departmentId').value;
					}
					else if (this.stocklineEditForm.get('divisionId').value != null && this.sourceStockLineSetup.departmentId == '' && this.sourceStockLineSetup.departmentId > 0) {
						this.sourceStockLineSetup.managementStructureId = this.stocklineEditForm.get('divisionId').value;
					}
					else if (this.stocklineEditForm.get('BusinessUnitId').value != null && this.sourceStockLineSetup.departmentId == '' && this.sourceStockLineSetup.divisionId == '' && this.sourceStockLineSetup.divisionId > 0) {
						this.sourceStockLineSetup.managementStructureId = this.stocklineEditForm.get('BusinessUnitId').value;
					}
					else {
						this.sourceStockLineSetup.managementStructureId = this.stocklineEditForm.get('companyId').value;
					}
					this.stocklineser.updateStockSetupLine(this.sourceStockLineSetup).subscribe(
						data => {
							if (data) {
								this.saveCompleted(this.sourceStockLineSetup);
								//for Saving Time Life start
								if (this.sourceStockLineSetup.timeLifeCyclesId) {
									console.log("Update Timelife");
									this.stocklineser.updateStockLineTimelife(this.sourceTimeLife).subscribe(data => {
										//this.saveItemMasterDetails(this.sourceStockLineSetup);
										this.collectionofstockLine = data;
										this.router.navigateByUrl('/stocklinemodule/stocklinepages/app-stock-line-list')
									})

								}
								else {
									this.stocklineser.newStockLineTimeLife(this.sourceTimeLife).subscribe(data => {
										this.collectionofstockLine = data;
										//this.saveItemMasterDetails(this.sourceStockLineSetup);
										this.value = 1;
										this.router.navigateByUrl('/stocklinemodule/stocklinepages/app-stock-line-list')
									})
								}
								//for Saving Time Life End
								//for Saving Integration Multiselect Start
								if (this.selectedModels.length > 0) {
									//in this while Edit if we unselect Check box that also treating as a select only
									//so we have list before edi
									//if list in previous and selected Model Data Has same PortalId then i will pop in Previous list
									if (this.selectedModels.length > 0) {
										this.stocklineser.deleteIntegrationById(this.sourceStockLineSetup.stockLineId).subscribe();
									}
									for (let i = 0; i < this.currentStocklineIntegrationPortalData.length; i++) {
										for (let j = 0; j < this.selectedModels.length; j++) {
											if (this.currentStocklineIntegrationPortalData[i].integrationPortalId == this.selectedModels[j].integrationPortalId) {
												if ((this.attempToDelete == true) && (this.selectedModels[j].attempToDelete == true)) {
													this.selectedModels.splice(j, 1);
												}
											}
										}
									}
									this.saveStocklineIntegrationPortalData(this.sourceStockLineSetup.stockLineId, this.selectedModels);
								}

							}
						});
				}
			}
			else if (((this.sourceStockLineSetup.isSerialized == false) || (this.sourceStockLineSetup.isSerialized == undefined) || (this.sourceStockLineSetup.isSerialized == "undefined") || (this.sourceStockLineSetup.isSerialized == null)) && (!this.sourceStockLineSetup.serialNumber)) {
				this.sourceStockLine.updatedBy = this.userName;
				this.sourceStockLine.masterCompanyId = 1;
				this.sourceItemMaster.itemMasterId = this.sourceStockLineSetup.itemMasterId;
				this.sourceItemMaster.partId = this.selectedPartId

				this.stocklineser.updateStockSetupLine(this.sourceStockLineSetup).subscribe(
					data => {
						this.saveCompleted(this.sourceStockLineSetup);
						if (this.sourceStockLineSetup.timeLifeCyclesId) {
							console.log("Update Timelife");
							this.stocklineser.updateStockLineTimelife(this.sourceTimeLife).subscribe(data => {
								this.collectionofstockLine = data;
								//this.saveItemMasterDetails(this.sourceStockLineSetup);
								this.router.navigateByUrl('/stocklinemodule/stocklinepages/app-stock-line-list')
							})
						}
						else {
							this.stocklineser.newStockLineTimeLife(this.sourceTimeLife).subscribe(data => {
								this.collectionofstockLine = data;
								this.value = 1;
								//this.saveItemMasterDetails(this.sourceStockLineSetup);
								this.router.navigateByUrl('/stocklinemodule/stocklinepages/app-stock-line-list')
							})
						}

						if (this.selectedModels.length > 0) {
							if (this.selectedModels.length > 0) {
								this.stocklineser.deleteIntegrationById(this.sourceStockLineSetup.stockLineId).subscribe();
							}
							for (let i = 0; i < this.currentStocklineIntegrationPortalData.length; i++) {
								for (let j = 0; j < this.selectedModels.length; j++) {
									if (this.currentStocklineIntegrationPortalData[i].integrationPortalId == this.selectedModels[j].integrationPortalId) {
										if ((this.attempToDelete == true) && (this.selectedModels[j].attempToDelete == true)) {
											this.selectedModels.splice(j, 1);
										}

									}
								}
							}
							this.saveStocklineIntegrationPortalData(this.sourceStockLineSetup.stockLineId, this.selectedModels);
						}
					})
			}
		}
		
	}

	ngAfterViewInit() {

	}

	private loadData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.conditionService.getConditionList().subscribe(
			results => this.onDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private loadCompanyData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.stocklineser.getStockCompanyList().subscribe(
			results => this.onDataLoadCompanySuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onDataLoadCompanySuccessful(getCompanyListList: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getCompanyListList;
		this.allCompanys = getCompanyListList;
	}

	private onDataLoadSuccessful(getConditionList: Condition[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.dataSource.data = getConditionList;
		this.allConditionInfo = getConditionList;
	}
	public getSelectedItem(selectedRow, event) {
		//;
		let ischange = false;
		selectedRow.isListed = true;
		if (this.selectedModels.length > 0) {
			//praveen's code//
			this.selectedModels.map((row) => {
				if (selectedRow.integrationPortalId == row.integrationPortalId)
				{
					if (selectedRow.integratedCheckbox) //Added
					{
						row.isListed = false;
						ischange = true;
					}
					if ((row.isListed == false) && (selectedRow.listedCheckbox == true))
					{
						selectedRow.isListed = true;
						row.isListed = true;
						ischange = false;
					}
				}
				
			});
		}
		if (!ischange) {
			this.selectedModels.push(selectedRow);
		}
	}
	public saveSelectedModel(selectedRow, indeex) {
		selectedRow.isBoolean = indeex;
		if (!selectedRow.isListed) {
			selectedRow.isListed = false;
		}
		//Moveing getSelectedItem from here Below Code
		let ischange = false; 
		if (this.selectedModels.length > 0) {
			//praveen's code//
			this.selectedModels.map((row) => {
				if (selectedRow.integrationPortalId == row.integrationPortalId)
				{
					if ( selectedRow.isListed == false) //Added
					{
						this.attempToDelete = true;
						selectedRow.attempToDelete = true;
						ischange = false;
					}
				}
			});
		}
		if (!ischange) {
			this.selectedModels.push(selectedRow);
		}
	}
	dataSource: MatTableDataSource<any>;
    triggerSomeEvent() {
		this.isDisabled = !this.isDisabled;
		return;
	}

	saveStocklineIntegrationPortalData(id, models)
	{
		for (let i = 0; i < models.length; i++)
		{
			models[i].StocklineId = id;
			this.stocklineser.saveStocklineIntegrationPortalData(models[i]).subscribe(stocklineIntegrationPortalData => {
				this.collectionofstocklineIntegrationPortalData = stocklineIntegrationPortalData;
			})

		}
	}
}