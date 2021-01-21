import { Component, OnInit, AfterViewInit, Input,SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';//bread crumb
import { ItemMasterService } from "../../../services/itemMaster.service";
import { fadeInOut } from '../../../services/animations';
import { AuthService } from '../../../services/auth.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { MasterCompany } from '../../../models/mastercompany.model';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { CommonService } from '../../../services/common.service';
import { Currency } from '../../../models/currency.model';
import { ItemMasterLoanExchange } from '../../../models/item-master-loan-exchange.model';
import { CurrencyService } from '../../../services/currency.service';
declare var $ : any;
import { getValueFromArrayOfObjectById, listSearchFilterObjectCreation } from '../../../generic/autocomplete';
import { AtaSubChapter1Service } from '../../../services/atasubchapter1.service';
import { TableModule, Table } from 'primeng/table';

import * as moment from 'moment';
@Component({
	selector: 'app-item-master-view',
	templateUrl: './item-master-view.component.html',
	styleUrls: ['./item-master-view.component.scss'],
	animations: [fadeInOut]
})
/** item-master-list component*/
export class ItemMasterViewComponent implements OnInit, AfterViewInit {
	@Input() itemMasterRowData: any = {}
	public isCollapsed = false;
	private table: Table;
	viewItemMaster: any = {};
	EquipmentDelete: boolean = false;
	isDeleteMode: boolean = false;
	allitemstockinfo: any[] = [];
	Active: string;
	partNumber: any = "";
	partDescription: any = "";
	isAlternatePartChecked: any = "";
	isSerialized: any = "";
	isTimeLife: any = "";
	nha: any = "";
	nationalStockNumber: any = "";
	itemClassificationId: any = "";
	itemGroupId: any = "";
	isAcquiredMethodBuy: any = "";
	expirationDate: any = "";
	isReceivedDateAvailable: any = "";
	isManufacturingDateAvailable: any = "";
	isTagDateAvailable: any = "";
	isOpenDateAvailable: any = "";
	isShippedDateAvailable: any = "";
	isOtherDateAvailable: any = "";
	provisionId: any = "";
	manufacturerId: any = "";
	isHazardousMaterial: any = "";
	selectedAircraftTypes: any = "";
	isEnabeCapes: any = "";
	pma: any = "";
	der: any = "";
	ataMainId: any = "";
	isSchematic: any = "";
	overhaulHours: any = "";
	rpHours: any = "";
	testHours: any = "";
	turnTimeOverhaulHours: any = "";
	turnTimeRepairHours: any = "";
	rfqTracking: any = "";
	glAccountId: any = "";
	purchaseUnitOfMeasureId: any = "";
	stockUnitOfMeasureId: any = "";
	consumeUnitOfMeasureId: any = "";
	soldUnitOfMeasureId: any = "";
	leadTimeDays: any = "";
	leadTimeHours: any = "";
	stockLevel: any = "";
	reorderPoint: any = "";
	reorderQuantiy: any = "";
	minimumOrderQuantity: any = "";
	isExchangeInfoAvailable: any = "";
	createdBy: any = "";
	updatedBy: any = "";
	createddate: any = "";
	updatedDate: any = "";

	EquipmentView: boolean = false;
	partdescription: any = "";
	itemClassificationCode: any = "";
	isActive: any = "";
	currencyId: any = "";
	exportCurrencyId: any = ""
	discountPurchasePercent: any = "";
	unitCost: any = "";
	listPrice: any = "";
	priceDate: any = "";
	descriptionName: any = "";
	manufacturingDays: any;
	salesMarkUpOnListPrice: any = "";
	EquipmentAdd: boolean = false;
	EquipmentUpdate: boolean = false;
	NonstockDelete: boolean = false;
	selectedColumns1: any[];
	cols1: any[];
	cols2: any[];
	selectedstockColumn: any[];
	selectedNonstockColumn: any[];
	selectedEquipmentColumn: any[];
	selectedColumns2: any[];
	getSelectedCollection: any;
	NonstockView: boolean = false;
	NonstockAdd: boolean = false; priorityId: any;
	memo: any;
	exportWeight: any;
	exportValue: any;
	exportSizeLength: any;
	exportClassificationId: any;
	description: any;
	exportSizeWidth: any;
	exportSizeHeight: any;
	orginalAtaSubChapterValues: any = [];
	NonstockUpdate: boolean = false;
	Delete: boolean = false;
	View: boolean = false;
	Add: boolean = false;
	Update: boolean = false;
	allRolesInfo: any[] = [];
	activeIndex: number;
	sourceItemMaster: any;
	allEquipmentInfo: any[];
	allNonstockInfo: any[] = [];
	loanTable: boolean;
	exchangeTable: any;
	equipmentTable: boolean;
	nonStockTable: boolean;
	public sourceAction: any = {};
	stockTable: boolean;
	radioButtonValue: string = "Stock";
	cols: any[];
	allStockInfo: any[] = [];
	selectedColumns: any[];
	loadingIndicator: boolean;
	dataSource: any;
	allActions: any[];
	selectedColumn: any;
	modal: NgbModalRef;
	isEditMode: boolean;
	isSaving: boolean;
	itemName: string;
	allUploadedDocumentsList: any = [];
	aircraftListDataValues: any = [];
	ataMappedList: any = [];
	allItemMasterCapsList: any[] = [];
	pnCols: any[];
	ntaeTableColumns: any[];
	ntaeData: any = [];
	ntaeData2: any = [];
	ntaeData3: any = [];
	ntaeData4: any = [];
	filterManufacturerData: any = [];
	filterDiscriptionData: any = [];
	filterPartItemClassificationData: any = [];
	showExchange: boolean = false;
	showLoan: boolean = false;
	exchangeCurrencies: Currency[];
	loanCurrencies: Currency[];
	currentItem: ItemMasterLoanExchange;
	displayName: string;
	displayNameLoan: string;
	exchangeListPrice: any;
	loanFees: any;
	loanCorePrice: any;
	loanOutrightPrice: any;
	exchangeCorePrice: any;
	exchangeOverhaulPrice: any;
	exchangeOutrightPrice: any;
	exchangeCoreCost: any;
	pageSize: number = 10;
	ataPageSize: number = 10;
	totalRecords: number = 0;
	totalPages: number = 0;
	itemMasterData: any = {};
	ataChapterId: any;
	viewAircraftData: any = {};
	aircraftauditHistory: any = [];
	itemMasterId: number;
	isEnableItemMasterView: boolean = true;
	isViewItemMasterNHA: boolean = true;
	isViewItemMasterTLA: boolean = true;
	isViewItemMasterAlternate: boolean = true;
	isViewItemMasterEquivalency: boolean = true;
	purchaseSalesInfo: any = [];
	originalPurchaseSaleList: any = [];
	exportInfo: any = [];
	exchangeLoanInfo: any = {};
	viewItemMasterNS: any = {};
	lazyLoadEventData: Event;
	pageIndex: number = 0;
	filteredText: string;
	stockTableColumns: any[];
	lazyLoadEventDataForNonStock: any;
	pageIndexNonStock: number;
	pageSizeNonStock: any;
	nonStockTableColumns: any[];
	totalRecordsNonStock: any;
	totalPagesNonStock: number;
	nonStockPageSize: number = 10;

	searchData = {
		partNo: '',
		description: '',
		wildCardSearch: '',
		stockType: '',
		hazardousMaterial: '',
		listPrice: ''
	};
	copyAllStockInfo: any[];
	partCollection: any[];
	itemclaColl: any[];
	allPartnumbersInfo: any;
	disableSavePartName: boolean;
	selectedActionName: any;
	itemser: any;
	disableSavepartDescription: boolean;
	descriptionbyPart: any;
	sourceActions: any;
	descriptionCollection: any[];
	itemdescription: any[];
	allCountryInfo: any[];
	isOpenAdvancedSearch: boolean;
	isSpinnerVisible: Boolean = false;
	allDocumentsList: any = [];
	viewATAData: any = {};
	airCraftDeletedStatus: boolean = true;
	ataDeletedStatus: boolean = true;

	sourceViewforDocumentAudit: any = [];
	allDocumentsListOriginal: any = [];
	documentTableColumns: any[] = [
		{ field: "docName", header: "Name" },
		{ field: "docDescription", header: "Description" },
		{ field: "docMemo", header: "Memo" },

		{ field: "fileName", header: "File Name" },
		{ field: "fileSize", header: "File Size" },

		{ field: 'createdDate', header: 'Created Date' },
		{ field: 'createdBy', header: 'CreatedBy' },
		{ field: 'updatedDate', header: 'Updated Date' },
		{ field: 'updatedBy', header: 'UpdatedBy' },
	];
	sourceViewforPurchaseandSalesAudit: any = [];
	ataChapterAuditHistory: any = [];

	/** item-master-list ctor */
	constructor(private authService: AuthService, private atasubchapter1service: AtaSubChapter1Service, private route: Router, private alertService: AlertService, private router: Router, public itemMasterService: ItemMasterService, private modalService: NgbModal, private masterComapnyService: MasterComapnyService, public commonService: CommonService, private currencyService: CurrencyService, ) {
	}
	ngOnInit(): void {
		this.ptnumberlistdata();
		this.getcurrencyExchangeLoan();
		this.getItemMasterById();
	}
    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property == 'itemMasterRowData') {
				this.itemMasterRowData=changes.itemMasterRowData.currentValue;
				this.getItemMasterById();
			}
	}
}
	ngAfterViewInit() { }

	colsaircraftLD: any[] = [
		{ field: "aircraft", header: "Aircraft" },
		{ field: "model", header: "Model" },
		{ field: "dashNumber", header: "Dash Numbers" },
		//{ field: "memo", header: "Memo" }
		{ field: 'createdDate', header: 'Created Date' },
		{ field: 'createdBy', header: 'CreatedBy' },
		{ field: 'updatedDate', header: 'Updated Date' },
		{ field: 'updatedBy', header: 'UpdatedBy' },
	];

	atasub: any[] = [
		{ field: 'ataChapterName', header: 'ATA Chapter' },
		{ field: 'ataSubChapterDescription', header: 'ATA Sub-Chapter' },
		{ field: 'createdDate', header: 'Created Date' },
		{ field: 'createdBy', header: 'CreatedBy' },
		{ field: 'updatedDate', header: 'Updated Date' },
		{ field: 'updatedBy', header: 'UpdatedBy' },
	];

	
	equivalencyTableColumns: any[] = [
		{ field: "altPartNo", header: "PN" },
		{ field: "altPartDescription", header: "Description" },
		{ field: "manufacturer", header: "Manufacturer " },
		{ field: "itemClassification", header: "ITEM CLASSIFICATION " },
	];

	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}
	deleteItemAndCloseModel() {
		this.isSaving = true;
		this.isDeleteMode = true;
		this.sourceItemMaster.isdelete = false;
		this.sourceItemMaster.updatedBy = this.userName;
		this.itemMasterService.updaateEquipmentDelete(this.sourceItemMaster.itemMasterId).subscribe(
			data => {
			});
		this.saveCompleted(this.sourceItemMaster);
		this.modal.close();
	}

	openDelete(content, row) {

		this.isEditMode = false;
		this.isDeleteMode = true;
		this.sourceItemMaster = row;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}
	private nonstockList() {
		this.loadingIndicator = true;

		this.itemMasterService.getItemNonstockList().subscribe(
			results => this.onitemnonstockSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onitemnonstockSuccessful(allWorkFlows: any[]) {
		this.loadingIndicator = false;
		this.allNonstockInfo = allWorkFlows;

	}

	private StockList() {
		this.loadingIndicator = true;

		this.itemMasterService.getItemeStockList().subscribe(
			results => this.onitemStockSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onitemStockSuccessful(allWorkFlows: any[]) {
		this.loadingIndicator = false;

	}

	private EuipmentList() {
		this.loadingIndicator = true;

		this.itemMasterService.getItemEquipmentList().subscribe(
			results => this.onitemequipmntSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onitemequipmntSuccessful(allWorkFlows: any[]) {
		this.loadingIndicator = false;
		this.allEquipmentInfo = allWorkFlows;
	}

	private onDataLoadFailed(error: any) {
		this.isSpinnerVisible = false;

	}
	private loadMasterCompanies() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.masterComapnyService.getMasterCompanies().subscribe(
			results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

	}

	private onDataMasterCompaniesLoadSuccessful(allStockInfo: MasterCompany[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
	}

	dismissModel() {
		this.isDeleteMode = false;
		this.isEditMode = false;
		this.modal.close();
	}
	handleChangeforstock(rowData, e) {
		if (e.checked == false) {
			this.sourceAction.itemMasterId = rowData.itemMasterId;
			this.sourceAction.updatedBy = this.userName;
			this.Active = "In Active";
			this.sourceAction.isActive = false;
			this.itemMasterService.updateActionforActiveforstock(this.sourceAction).subscribe(
				response => this.saveCompleted(this.sourceAction),
				error => this.saveFailedHelper(error));
		}
		else {
			this.sourceAction.itemMasterId = rowData.itemMasterId;
			this.sourceAction.updatedBy = this.userName;
			this.Active = "Active";
			this.sourceAction.isActive = true;
			this.itemMasterService.updateActionforActiveforstock(this.sourceAction).subscribe(
				response => this.saveCompleted(this.sourceAction),
				error => this.saveFailedHelper(error));
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

	private saveFailedHelper(error: any) {
		this.isSaving = false;
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
	}
	columnsChanges() {
		this.refreshList();
	}
	refreshList() {
		if (this.filteredText != "" && this.filteredText != null && this.filteredText != undefined) {
		}
		else {
			this.table.reset();
		}


	}
	expandAllItemMasterDetails() {
		$('#step1').collapse('show');
		$('#step2').collapse('show');
		$('#step3').collapse('show');
		$('#step4').collapse('show');
		$('#step5').collapse('show');
		$('#step6').collapse('show');
		$('#step7').collapse('show');
		$('#step8').collapse('show');
	}
	closeAllItemMasterDetails() {
		$('#step1').collapse('hide');
		$('#step2').collapse('hide');
		$('#step3').collapse('hide');
		$('#step4').collapse('hide');
		$('#step5').collapse('hide');
		$('#step6').collapse('hide');
		$('#step7').collapse('hide');
		$('#step8').collapse('hide');
	}
	closeItemMasterDetails() {
		$('#step1').collapse('show');
		$('#step2').collapse('hide');
		$('#step3').collapse('hide');
		$('#step4').collapse('hide');
		$('#step5').collapse('hide');
		$('#step6').collapse('hide');
		$('#step7').collapse('hide');
		$('#step8').collapse('hide');
	}

	openView(row) {
		this.closeItemMasterDetails();
		this.itemMasterId = row.itemMasterId;
		this.toGetAllDocumentsList(row.itemMasterId);
		this.toGetDocumentsListNew(row.itemMasterId)
		//this.getPurchaseSalesInfo(this.itemMasterId);		
		this.getPSListOnDeleteStatus(false);
		this.partNumber = row.partNumber;
		this.description = row.partDescription;
		if (row.isAlternatePartChecked) {
			this.isAlternatePartChecked = true;
		}
		else {
			this.isAlternatePartChecked = false;
		}
		this.isSerialized = row.isSerialized;
		this.isTimeLife = row.isTimeLife;
		this.nha = row.nha;
		this.stockLevel = row.stockLevel;
		this.nationalStockNumber = row.nationalStockNumber;
		if (row.itemClassification) {
			this.itemClassificationId = row.itemClassification.description;
		}
		else { this.itemClassificationId = "" }
		if (row.manufacturer) {
			this.manufacturerId = row.manufacturer.name;
		}
		else { this.manufacturerId = "" }

		if (row.priority) {
			this.priorityId = row.priority.description;
		}
		else { this.priorityId = "" }


		if (row.currency) {
			this.currencyId = row.currency.symbol;
		}
		else { this.currencyId = "" }

		
		this.stockUnitOfMeasureId = row.stockUnitOfMeasureId;
		this.purchaseUnitOfMeasureId = row.purchaseUnitOfMeasureId;
		this.itemGroupId = row.itemGroup;
		this.isAcquiredMethodBuy = row.isAcquiredMethodBuy;
		this.expirationDate = row.expirationDate;
		this.isReceivedDateAvailable = row.isReceivedDateAvailable;
		this.isManufacturingDateAvailable = row.isManufacturingDateAvailable;
		this.isTagDateAvailable = row.isTagDateAvailable;
		this.isOpenDateAvailable = row.isOpenDateAvailable;
		this.isShippedDateAvailable = row.isShippedDateAvailable;
		this.isOtherDateAvailable = row.isOtherDateAvailable;
		this.provisionId = row.provisionId;
		this.isHazardousMaterial = row.isHazardousMaterial;
		this.selectedAircraftTypes = row.selectedAircraftTypes;
		this.isEnabeCapes = row.isEnabeCapes;
		this.pma = row.pma;
		this.der = row.der;
		this.ataMainId = row.ataMainId;
		this.isSchematic = row.isSchematic;
		this.overhaulHours = row.overhaulHours;
		this.rpHours = row.rpHours;
		this.testHours = row.testHours;
		this.turnTimeOverhaulHours = row.turnTimeOverhaulHours;
		this.turnTimeRepairHours = row.turnTimeRepairHours;
		this.rfqTracking = row.rfqTracking;
		this.manufacturingDays = row.manufacturingDays;
		this.listPrice = row.listPrice;
		this.glAccountId = row.glAccountId;
		this.exportCurrencyId = row.exportCurrencyId;
		this.consumeUnitOfMeasureId = row.consumeUnitOfMeasureId;
		this.soldUnitOfMeasureId = row.soldUnitOfMeasureId;
		this.leadTimeDays = row.leadTimeDays;
		this.leadTimeHours = row.leadTimeHours;
		this.stockLevel = row.stockLevel;
		this.reorderPoint = row.reorderPoint;
		this.reorderQuantiy = row.reorderQuantiy;
		this.minimumOrderQuantity = row.minimumOrderQuantity;
		this.isExchangeInfoAvailable = row.isExchangeInfoAvailable;
		this.exportWeight = row.exportWeight;
		this.exportValue = row.exportValue;
		this.salesMarkUpOnListPrice = row.salesMarkUpOnListPrice;
		this.createdBy = row.createdBy;
		if (row.exportClassification) {
			this.exportClassificationId = row.exportClassification.description;
		}
		else {
			this.exportClassificationId = "";
		}
		this.exportSizeLength = row.exportSizeLength;
		this.exportSizeWidth = row.exportSizeWidth;
		this.exportSizeHeight = row.exportSizeHeight;
		this.updatedBy = row.updatedBy;
		this.memo = row.memo;
		this.createddate = row.createdDate;
		this.updatedDate = row.updatedDate;
		
		this.getAllSubChapters(row.itemMasterId);
		this.getAircraftMappedDataByItemMasterId(row.itemMasterId);
		this.getNtaeData(row.itemMasterId);
		this.getExchange(row.itemMasterId);
		this.getItemMasterExportInfoById(this.itemMasterId);
		this.loadMasterCompanies();
	}

	openViewOnDbl(rowData) {
		$('#itemMasterView').modal('show');
	}

	// getPurchaseSalesInfo(id) {
	// 	this.itemMasterService.getPurcSaleDetailById(id).subscribe(res => {
	// 		this.purchaseSalesInfo = res;
	// 	});
	// }

	getItemMasterExportInfoById(id) {
		this.itemMasterService.getItemMasterExportInfoById(id).subscribe(res => {
			if (res[0] != null && res[0] != undefined) {
				this.exportInfo = res[0];
			}
		});
	}

	getExchange(itemMasterId) {
		this.itemMasterService.getExchangeLoan(itemMasterId).subscribe(res => {
			if (res[0] != null && res[0] != undefined) {
				this.exchangeLoanInfo = res[0];
			}
		});
	}

	getcurrencyExchangeLoan() {
		this.currencyService.getCurrencyList().subscribe(dat => {
			this.exchangeCurrencies = [...dat[0]];
			this.loanCurrencies = [...dat[0]];
			this.displayNameLoan = this.loanCurrencies[0].displayName;
			this.displayName = this.exchangeCurrencies[0].displayName;
		});
	}

	getNtaeData(itemMasterId) {
		this.filterManufacturerData = [];
		this.filterDiscriptionData = [];
		this.filterPartItemClassificationData = [];
		let reqData = {
			first: 0,
			rows: 10,
			sortOrder: 1,
			filters: {
				ItemMasterId: itemMasterId,
				MappingType: 3,
			},
		}
		let reqDatas = {
			first: 0,
			rows: 10,
			sortOrder: 1,
			filters: {
				ItemMasterId: itemMasterId,
				MappingType: 4,
			},
			globalFilter: null
		}
		let reqDatas1 = {
			first: 0,
			rows: 10,
			sortOrder: 1,
			filters: {
				ItemMasterId: itemMasterId,
				MappingType: 1,
			},
			globalFilter: null
		}
		let reqDatas2 = {
			first: 0,
			rows: 10,
			sortOrder: 1,
			filters: {
				ItemMasterId: itemMasterId,
				MappingType: 2,
			},
			globalFilter: null
		}

		this.itemMasterService.getnhatlaaltequpartlis(reqData).subscribe(res => {
			this.ntaeData = res;
			this.getntlafieds(this.ntaeData);
		});
		this.itemMasterService.getnhatlaaltequpartlis(reqDatas).subscribe(res => {
			this.ntaeData2 = res;
			this.getntlafieds(this.ntaeData2);
		});
		this.itemMasterService.getnhatlaaltequpartlis(reqDatas1).subscribe(res => {
			this.ntaeData3 = res;
			this.getntlafieds(this.ntaeData3);
		});

		this.itemMasterService.getequivalencypartlist(reqDatas2).subscribe(res => {
			this.ntaeData4 = res;
			for (let i = 0; i < this.ntaeData4.length; i++) {
				this.filterManufacturerData.push({
					label: this.ntaeData4[i].manufacturer,
					value: this.ntaeData4[i].manufacturerId
				});
				this.filterDiscriptionData.push({
					label: this.ntaeData4[i].altPartDescription,
					value: this.ntaeData4[i].altPartDescription
				});
				this.filterPartItemClassificationData.push({
					label: this.ntaeData4[i].itemClassification,
					value: this.ntaeData4[i].itemClassificationId
				});
			}
		});

	}

	getntlafieds(ntaeData) {
		for (let i = 0; i < ntaeData.length; i++) {
			this.filterManufacturerData.push({
				label: ntaeData[i].manufacturer,
				value: ntaeData[i].manufacturerId
			});
			this.filterDiscriptionData.push({
				label: ntaeData[i].altPartDescription,
				value: ntaeData[i].altPartDescription
			});
		}

	}
	
	// get all subchapter for dropdown
	getAllSubChapters(itemMasterId) {
		this.atasubchapter1service.getAtaSubChapter1List().subscribe(atasubchapter => {
				const responseData = atasubchapter[0];
				this.orginalAtaSubChapterValues = responseData;
				this.getATAMappedDataByItemMasterId(itemMasterId);
			});
	}

	getATAMappedDataByItemMasterId(itemMasterId) {
		// check whether edit or create and send and passes ItemMasterId
		this.itemMasterService.getMappedATADetails(itemMasterId).subscribe(res => {
			this.ataMappedList = res.map(x => {
				return {
					...x,
					ataChapterName: x.ataChapterCode + ' - ' + x.ataChapterName,
					ataSubChapterDescription: x.ataSubChapterCode + ' - ' + x.ataSubChapterDescription
				}
			});
		});
	}

	getAircraftMappedDataByItemMasterId(itemMasterId) {

		this.itemMasterService.getMappedAirCraftDetails(itemMasterId).subscribe(data => {
			const responseData = data;
		
			this.aircraftListDataValues = responseData.map(x => { //aircraftListData
				return {
					...x,
					aircraft: x.aircraftType,
					model: x.aircraftModel,
					dashNumber: x.dashNumber,
					createdBy: x.createdBy,
					updatedBy: x.updatedBy,
					createdDate: x.createdDate,
					updatedDate: x.updatedDate
					//isDeletd: x.isDeletd,
				}
			});
		});
	}

	getItemMasterById() {
		this.isSpinnerVisible = true;
		this.itemMasterService.getItemMasterDetailById(this.itemMasterRowData.itemMasterId).subscribe(res => {
			this.viewItemMaster = res[0];
			this.viewItemMaster.integrationPortal = this.viewItemMaster.integrationPortal.replace(/,/g, ', ');
			//this.viewItemMaster.oemPN = res[0].oemPNData[0].partNumber + ' - ' + res[0].oemPNData[0].partDescription;
			// this.openView(this.itemMasterRowData);
			this.openView(this.viewItemMaster);
			this.isSpinnerVisible = false;
		}, error => this.isSpinnerVisible = false);
	}
	onViewATA(rowData) {
		this.viewATAData = rowData;
		//$('#viewATA').modal('show');
	}
	
	onViewATAonDbl(rowData) {
        this.onViewATA(rowData);
        $('#viewATA').modal('show');
    }
	
	openHelpText(content) {
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}
	
	toGetAllDocumentsList(itemMasterId) {
		var moduleId = 22;
		this.commonService.GetDocumentsList(itemMasterId, moduleId).subscribe(res => {
			this.allUploadedDocumentsList = res;
		})
	}
	downloadFileUpload(rowData) {
		this.commonService.toDownLoadFile(rowData.link);
	}

	dismissItemMasterModel() {
		this.itemMasterId = undefined;
	}

	
	getPageCount(totalNoofRecords, pageSize) {
		return Math.ceil(totalNoofRecords / pageSize)
	}

	ataChapterPageIndexChange(event) {
        this.ataPageSize = event.rows;
    }

	onViewAircraft(rowData) {
		this.viewAircraftData = rowData;
	}
	onViewAircraftonDbl(rowData) {
		this.onViewAircraft(rowData);
		$('#viewAircraft').modal('show');
	}
	onCloseAircraftView(){
		$('#viewAircraft').modal('hide');
		$('#contentAuditHistDoc').modal('hide');
		$('#aircraftHistory').modal('hide');
	}

	getAircraftAuditHistory(rowData) {
		this.itemMasterService.getItemMasterAircraftAuditHistory(rowData.itemMasterAircraftMappingId).subscribe(res => {
			this.aircraftauditHistory = res;
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

	filterpartItems(event) {
		this.partCollection = [];
		this.itemclaColl = [];
		if (this.allPartnumbersInfo) {
			for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
				let partName = this.allPartnumbersInfo[i].partNumber;
				if (partName) {
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

	onClearPN() {
		this.sourceItemMaster.partNumber = undefined;
	}

	partnmId(event) {
		if (this.itemclaColl && this.itemclaColl.length > 0) {
			for (let i = 0; i < this.itemclaColl.length; i++) {
				if (event == this.itemclaColl[i][0].partName) {
					this.sourceItemMaster.partId = this.itemclaColl[i][0].partId;
					this.disableSavePartName = true;
					this.selectedActionName = event;
				}
			}
			this.itemser.getDescriptionbypart(event).subscribe(
				results => this.onpartnumberloadsuccessfull(results[0]),
				error => this.onDataLoadFailed(error)
			);
			this.disableSavepartDescription = true;
		}
	}

	private onpartnumberloadsuccessfull(allWorkFlows: any[]) {
		this.descriptionbyPart = allWorkFlows[0]
		this.sourceActions = this.descriptionbyPart;
		this.sourceItemMaster.partdescription = allWorkFlows[0].partDescription;
	}

	eventHandler(event) {
	}
	private ptnumberlistdata() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;
		this.itemMasterService.getPrtnumberslistList().subscribe(
			results => this.onptnmbersSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	filterdescription(event) {
		this.descriptionCollection = [];
		this.itemdescription = [];
		if (this.allPartnumbersInfo) {
			if (this.allPartnumbersInfo.length > 0) {
				for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
					let partDescription = this.allPartnumbersInfo[i].partDescription;
					if (partDescription) {
						this.descriptionCollection.push(partDescription);
					}
				}
			}
		}
	}
	private onptnmbersSuccessful(allWorkFlows: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allPartnumbersInfo = allWorkFlows;
	}


	private onDataLoadcountrySuccessful(allWorkFlows: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allCountryInfo = allWorkFlows;
	}

	toggleShowOpenAdvancedSearch() {
		this.isOpenAdvancedSearch = !this.isOpenAdvancedSearch;
	}

	private getisHazardousMaterial(isHazardousMaterial) {
		if (isHazardousMaterial) {
			return isHazardousMaterial === 'Yes' ? 'True' : 'False';
		}
	}


	toGetDocumentsListNew(itemMasterId) {
		var moduleId = 22;
		this.commonService.GetDocumentsListNew(itemMasterId, moduleId).subscribe(res => {
			this.allDocumentsList = res;
			this.allDocumentsListOriginal = res;

		})
	}
	pageIndexChange(event) {
		this.pageSize = event.rows;
	}
	
	dateFilterForTable(date, field) {

		if (date !== '' && moment(date).format('MMMM DD YYYY')) {
			this.allDocumentsList = this.allDocumentsListOriginal;
			const data = [...this.allDocumentsList.filter(x => {
				if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
					return x;
				} else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
					return x;
				}
			})]
			this.allDocumentsList = data;
		} else {
			this.allDocumentsList = this.allDocumentsListOriginal;
		}

	}
	openHistoryDoc(rowData) {

		this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
			res => {
				this.sourceViewforDocumentAudit = res;
			})

	}
	getColorCodeForHistoryDoc(i, field, value) {
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

	openHistoryOfPurchaseAndSales(content, rowData) {
        this.alertService.startLoadingMessage();

        this.commonService.GetPurchaseAndSalesAuditHistory(rowData.itemMasterPurchaseSaleId).subscribe(
            results => this.onHistoryOfPurchaseandSalesSuccess(results, content),
            error => this.saveFailedHelper(error));
    }
	private onHistoryOfPurchaseandSalesSuccess(auditHistory, content) {
        this.alertService.stopLoadingMessage();


        this.sourceViewforPurchaseandSalesAudit = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
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
	getAtaChapterAuditHistory(rowData) {
        this.itemMasterService.getATAMappedAudit(rowData.itemMasterATAMappingId).subscribe(res => {
            this.ataChapterAuditHistory = res;
        });
        
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
	
	closeModel(id){
		$(`#${id}`).modal('hide');
	}

	getAircraftMappedDeletdDataByItemMasterId(event) {
		this.isSpinnerVisible = true;
		this.airCraftDeletedStatus = event.target.checked;
       this.itemMasterService.getDeletdMappedAirCraftDetails(this.itemMasterId, this.airCraftDeletedStatus).subscribe(data => {
           const responseData = data;
           this.aircraftListDataValues = responseData.map(x => { 
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
       error => this.onDataLoadFailed(error))
   }

   getDeletedATAMappedDataByItemMasterId(event) {
	this.isSpinnerVisible = true;
		this.ataDeletedStatus = event.target.checked;
		this.itemMasterService.getDeletedMappedATADetails(this.itemMasterId, this.ataDeletedStatus).subscribe(res => {
			if (res) {
				this.ataMappedList = res.map(x => {
					return {
						...x,
						ataChapterName: x.ataChapterCode + ' - ' + x.ataChapterName,
						ataSubChapterDescription: x.ataSubChapterId ? x.ataSubChapterCode + ' - ' + x.ataSubChapterDescription : '',
						createdBy: x.createdBy,
						createdDate: x.createdDate,
						updatedDate: x.updatedDate,
						updatedBy: x.updatedBy
					}
				})
				this.isSpinnerVisible = false;
			}
		}, error => this.onDataLoadFailed(error))
	}

	getPSListOnDeleteStatus(value) {
		this.isSpinnerVisible = true;
		this.itemMasterService.getPurcSaleDetailById(this.itemMasterId).subscribe(res => {
			this.originalPurchaseSaleList = res;

			this.purchaseSalesInfo = [];
			if(value) {
                this.originalPurchaseSaleList.map(x => {
                    if(x.isDeleted) {
                        this.purchaseSalesInfo.push(x);
                    }
                });
            } else {
                this.originalPurchaseSaleList.map(x => {
                    if(!x.isDeleted) {
                        this.purchaseSalesInfo.push(x);
                    }
                });
            }
			this.isSpinnerVisible = false;			
		}, error=> {
            this.onDataLoadFailed(error)
        });
	}

	closeViewATAModel()
    {
        $('#viewATA').modal('hide');
    }
}