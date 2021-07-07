import { Component, OnInit, AfterViewInit, AfterContentChecked, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
declare var $: any;
import { getValueFromArrayOfObjectById, listSearchFilterObjectCreation, formatNumberAsGlobalSettingsModule } from '../../../generic/autocomplete';
import { AtaSubChapter1Service } from '../../../services/atasubchapter1.service';
import { TableModule, Table } from 'primeng/table';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
// import { DEFAULT_VALUE_ACCESSOR } from '@angular/forms/src/directives/default_value_accessor';
@Component({
	selector: 'app-item-master-list',
	templateUrl: './item-master-list.component.html',
	styleUrls: ['./item-master-list.component.scss'],
	animations: [fadeInOut],
	providers: [DatePipe]
})
/** item-master-list component*/
export class ItemMasterListComponent implements OnInit, AfterViewInit, AfterContentChecked {
	ItemMasterList: string = "Item Master List";
	public isCollapsed = false;
	private table: Table;
	isSpinnerVisible: Boolean = false;
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
	viewRowData: any;
	createddate: any = "";
	updatedDate: any = "";
	deletePartDesc: any = "";

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
	rowDataToDelete: any = {};
	rowDataToDeleteStock: any = {};
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
	exchangeLoanInfo: any = {};
	viewItemMasterNS: any = {};
	lazyLoadEventData: any;
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
	exportDataTable: any;
	dateObject: any = {};
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

	allDocumentsList: any = [];

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
		{ field: 'download', header: 'Actions' },
	];
	itemMasterRowData: any = {};
	isViewOpened: boolean = false;
	lazyLoadEventDataInputForStock: any;
	status: string = 'active';
	currentstatus: string = 'active';
	currentDeletedstatus: boolean = false;
	lazyLoadEventDataInputStock: any;
	lazyLoadEventDataInputNonStock: any;
	pageNumber = 0;
	selectedOnly: boolean = false;
	nonstockselectedOnly: boolean = false;
	targetData: any;
	nonstocktargetData: any;
	allStockInfoOriginal: any[];
	auditHistory: any = [];

	/** item-master-list ctor */
	constructor(private authService: AuthService, private cdRef: ChangeDetectorRef, private atasubchapter1service: AtaSubChapter1Service, private datePipe: DatePipe, private route: Router, private alertService: AlertService, private router: Router, public itemMasterService: ItemMasterService, private modalService: NgbModal, private masterComapnyService: MasterComapnyService, public commonService: CommonService, private currencyService: CurrencyService, private _actRoute: ActivatedRoute) {
		this.itemMasterService.currentUrl = '/itemmastersmodule/itemmasterpages/app-item-master-list';
		this.itemMasterService.bredcrumbObj.next(this.itemMasterService.currentUrl);//Bread Crumb
		this.itemMasterService.listCollection = null;
		if (itemMasterService.listStock == true) {
			this.onRadioChange(0);
			this.stockTable = true;
			this.nonStockTable = false;
		}
		if (itemMasterService.listNonstock == true) {
			this.onRadioChange(1);
			this.nonStockTable = true;
			this.stockTable = false;
		}

	}
	ngAfterContentChecked(): void {
		this.cdRef.detectChanges();
	}
	ngOnInit(): void {

		this.itemMasterService.currentUrl = '/itemmastersmodule/itemmasterpages/app-item-master-list';
		this.itemMasterService.bredcrumbObj.next(this.itemMasterService.currentUrl);//Bread Crumb
		var itemType = this._actRoute.snapshot.queryParams['type'];
		if (itemType === '2') {
			this.radioButtonValue = "Non-stock";
		}
		else {
			this.radioButtonValue = "Stock";
		}
		this.ptnumberlistdata();

		this.cols = [
			{ field: 'partNumber', header: 'PN' },
			{ field: 'partDescription', header: 'PN Description',width:"200px" },
			{ field: 'manufacturerdesc', header: 'Manufacturer' },
			{ field: 'itemType', header: 'Item Type',width:"90px" },
			{ field: 'stockType', header: 'Stock Type',width:"90px" },
			{ field: 'classificationdesc', header: 'Classification' },
			{ field: 'itemGroup', header: 'Group Name' },
			{ field: 'isSerialized', header: 'Serialized',width:"90px" },
			{ field: 'isTimeLife', header: 'Time Life',width:"90px" },
			{ field: 'nationalStockNumber', header: 'NSN',width:"90px" },
			{ field: 'createdDate', header: 'Created Date' },
			{ field: 'createdBy', header: 'Created By',width:"100px" },
			{ field: 'updatedDate', header: 'Updated Date' },
			{ field: 'updatedBy', header: 'Updated By',width:"100px" },

		];
		this.cols1 = [
			{ field: 'partNumber', header: 'PN' },
			{ field: 'partDescription', header: 'Description',width:"200px" },
			{ field: 'isHazardousMaterial', header: 'Is Hazardous Material' },
			{ field: 'manufacturerdesc', header: 'Manufacturer' },
			{ field: 'unitCost', header: 'Unit Cost',width:"90px" },
			{ field: 'listPrice', header: 'List Price',width:"90px" },
			{ field: 'createdDate', header: 'Created Date' },
			{ field: 'createdBy', header: 'Created By' },
			{ field: 'updatedDate', header: 'Updated Date' },
			{ field: 'updatedBy', header: 'Updated By' },
		];
	}

	openHist(rowData) {
		this.isSpinnerVisible = true;
		this.itemMasterService.getAuditHistory(rowData.itemMasterId).subscribe(data => {
			this.auditHistory = data;
			this.isSpinnerVisible = false;
		}, err => {
			this.isSpinnerVisible = false;
		});
	}

	getColorCodeForHistoryItemMaster(i, field, value) {
		const data = this.auditHistory;
		const dataLength = data.length;
		if (i >= 0 && i <= dataLength) {
			if ((i + 1) === dataLength) {
				return true;
			} else {
				return data[i + 1][field] === value
			}
		}
	}

	openEdit(row) {
		const { itemMasterId } = row;
		this.activeIndex = 0;
		this.router.navigateByUrl(`/itemmastersmodule/itemmasterpages/app-item-master-stock/edit/${itemMasterId}`);
		localStorage.removeItem('currentTab')

	}

	toggledbldisplay(content, row) {
		this.isEditMode = true;
		this.isSaving = true;
		this.loadMasterCompanies();
		this.sourceAction = row;
		this.itemName = this.sourceAction.itemClassificationCode;
		this.loadMasterCompanies();
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	closeDeleteModal() {
		$("#downloadConfirmation").modal("hide");
		$("#downloadnonstockConfirmation").modal("hide");
	}

	openEdits(row) {
		this.itemMasterService.isEditMode = true;
		this.itemMasterService.getCapabilityData(row.itemMasterId).subscribe(data => {
			this.getSelectedCollection = data;
			this.itemMasterService.capsCollection = this.getSelectedCollection;
		});

		this.sourceItemMaster = row;

		this.itemMasterService.listNonStockCollection = this.sourceItemMaster;
		this.activeIndex = 1;

		this.router.navigateByUrl(`/itemmastersmodule/itemmasterpages/app-item-master-non-stock/edit/${row.itemMasterId}`);
	}

	dblExpandAllItemMasterListModel() {
		$('#step1').collapse('show');
		$('#step2').collapse('show');
		$('#step3').collapse('show');
		$('#step4').collapse('show');
		$('#step6').collapse('show');
		$('#step8').collapse('show');
		$('#step58').collapse('show');
	}

	dblCloseAllItemMasterListModel() {
		$('#step1').collapse('hide');
		$('#step2').collapse('hide');
		$('#step3').collapse('hide');
		$('#step4').collapse('hide');
		$('#step6').collapse('hide');
		$('#step8').collapse('hide');
		$('#step58').collapse('hide');
	}

	openEdited(row) {
		this.itemMasterService.isEditMode = true;
		this.sourceItemMaster = row;
		this.itemMasterService.listEquipmentCollection = this.sourceItemMaster;
		this.activeIndex = 2;
		this.router.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-equipment');
	}

	get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
			? this.authService.currentUser.masterCompanyId
			: null;
	}

	ngAfterViewInit() { }

	public onRadioChange(val: any) {
		this.currentDeletedstatus = false;
		this.status = 'active';
		this.currentstatus = 'active';
		this.isOpenAdvancedSearch = false;
		this.clearAdvanceSerchData();
		if (val == 0) {
			this.radioButtonValue = "Stock";
			this.stockTable = true;
			this.nonStockTable = false;
			this.equipmentTable = false;
			this.exchangeTable = false;
			this.loanTable = false;
			this.searchData.stockType = 'Stock';
		}
		else if (val == 1) {
			this.radioButtonValue = "Non-stock";
			this.stockTable = false;
			this.nonStockTable = true;
			this.equipmentTable = false;
			this.exchangeTable = false;
			this.loanTable = false;
			this.searchData.stockType = 'Non-stock';

		}
		else if (val == 2) {
			this.radioButtonValue = "Equipment";
			this.stockTable = false;
			this.nonStockTable = false;
			this.equipmentTable = true;
			this.exchangeTable = false;
			this.loanTable = false;
			this.searchData.stockType = 'Equipment';

		}
		else if (val == 3) {
			this.radioButtonValue = "Exchange";
			this.stockTable = false;
			this.nonStockTable = false;
			this.equipmentTable = false;
			this.exchangeTable = true;
			this.loanTable = false;
		}
		else if (val == 4) {
			this.radioButtonValue = "Loan";
			this.stockTable = false;
			this.nonStockTable = false;
			this.equipmentTable = false;
			this.exchangeTable = false;
			this.loanTable = true;
		}
	}

	public loadStockData(event, dt?) {
		this.isSpinnerVisible = true;
		this.lazyLoadEventData = event;
		this.lazyLoadEventDataInputStock = event;
		this.lazyLoadEventDataInputStock.filters = {
			...this.lazyLoadEventData.filters,
			status: this.currentstatus ? this.currentstatus : 'active'
		}
		event.filters.isDeleted = this.currentDeletedstatus ? true : false;
		event.filters.status = this.currentstatus ? this.currentstatus : 'active';
		this.pageIndex = parseInt(event.first) / event.rows;
		this.pageSize = event.rows;
		event.first = this.pageIndex;
		this.loadingIndicator = true;
		if (event.globalFilter == null) {
			event.globalFilter = ""
		}
		let PagingData = { ...this.lazyLoadEventData, filters: listSearchFilterObjectCreation(this.lazyLoadEventData.filters) }
		PagingData.filters.isHazardousMaterial = this.searchData.hazardousMaterial === 'Yes' ? true : (this.searchData.hazardousMaterial === "No" ? false : "")

		if (this.radioButtonValue.toLowerCase() == "non-stock") {
			this.getItemsListNonStock(PagingData)
		}
		else {
			this.getItemsListStock(PagingData)
		}
	}

	getItemsListStock(PagingData) {
		let Stock = [];
		this.isSpinnerVisible = true;
		PagingData.filters.masterCompanyId = this.currentUserMasterCompanyId;
		this.itemMasterService.getItemMasterStockListData(PagingData).subscribe(
			results => {
				this.stockTable = true;
				this.nonStockTable = false;
				this.stockTableColumns = this.cols;
				this.loadingIndicator = false;
				this.allStockInfo = results[0]['results'].map(x => {
					return {
						...x,
						isTimeLife: x.isTimeLife == "1" ? 'true' : 'false',
						isSerialized: x.isSerialized == "1" ? 'true' : 'false'
					}
				});
				this.allStockInfoOriginal = this.allStockInfo
				this.totalRecords = results[0]['totalRecordsCount']
				this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
				this.isSpinnerVisible = false;
			},
			error => { this.isSpinnerVisible = false }
		);
	}
	filterdata(value, field) {
		if (value != '') {
			this.allStockInfo = this.allStockInfoOriginal;
			const data = [...this.allStockInfo.filter(x => {
				if (x.isTimeLife == value && field === 'isTimeLife') {
					return x;
				} else if (x.isSerialized == value && field === 'isSerialized') {
					return x;
				}
			})]
			this.allStockInfo = data;
		}
		else {
			this.allStockInfo = this.allStockInfoOriginal;
		}

	}

	getItemsListNonStock(PagingData) {
		this.isSpinnerVisible = true;
		PagingData.filters.masterCompanyId = this.currentUserMasterCompanyId;
		this.itemMasterService.getItemMasterNonStockListData(PagingData).subscribe(
			results => {
				this.nonStockTable = true;
				this.stockTable = false;
				this.nonStockTableColumns = this.cols1;
				this.loadingIndicator = false;
				this.allNonstockInfo = results[0]['results'].map(x => {
					return {
						...x,
						unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
						listPrice: x.listPrice ? formatNumberAsGlobalSettingsModule(x.listPrice, 2) : '0.00',
						isHazardousMaterial: x.isHazardousMaterial == "1" ? 'true' : 'false'
					}
				});
				this.totalRecordsNonStock = results[0]['totalRecordsCount']
				this.totalPagesNonStock = Math.ceil(this.totalRecordsNonStock / this.nonStockPageSize);
				this.isSpinnerVisible = false;
			},
			error => { this.isSpinnerVisible = false }
		);
	}

	public loadNonStockData(event) {
		this.isSpinnerVisible = true;
		this.lazyLoadEventDataForNonStock = event;
		this.lazyLoadEventDataInputNonStock = event;
		this.lazyLoadEventDataInputNonStock.filters = {
			...this.lazyLoadEventDataForNonStock.filters,
			status: this.currentstatus ? this.currentstatus : 'active'
		}
		event.filters.isDeleted = this.currentDeletedstatus ? true : false;
		event.filters.status = this.currentstatus ? this.currentstatus : 'active';
		this.pageIndexNonStock = parseInt(event.first) / event.rows;
		this.nonStockPageSize = event.rows;
		event.first = this.pageIndexNonStock
		this.loadingIndicator = true;
		if (event.globalFilter == null) {
			event.globalFilter = ""
		}

		const PagingData = { ...this.lazyLoadEventDataForNonStock, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataForNonStock.filters) }
		this.getItemsListNonStock(PagingData);
	}

	private loadRolesData() {
		this.loadingIndicator = true;

		this.itemMasterService.getRolesData().subscribe(
			results => this.onRolesLoadSuccessfull(results[0]),
			error => { this.loadingIndicator = false }
		);
	}

	private onDataLoadSuccessful(allWorkFlows: any[]) {
		this.loadingIndicator = false;
		this.dataSource.data = allWorkFlows;
		this.allitemstockinfo = allWorkFlows;
	}

	private onitemmasterSuccessful(allWorkFlows, value) {
		for (let i = 0; i < allWorkFlows.length; i++) {
			if (allWorkFlows[i]["manufacturer"]) {
				allWorkFlows[i]["manufacturerdesc"] = allWorkFlows[i]["manufacturer"]["name"]
			}

			if (allWorkFlows[i]["itemClassification"]) {
				allWorkFlows[i]["classificationdesc"] = allWorkFlows[i]["itemClassification"]["description"]
			}
		}
		this.stockTable = true;

		this.stockTableColumns = this.cols;
		this.loadingIndicator = false;
		this.allStockInfo = allWorkFlows['results'];
		this.totalRecords = allWorkFlows.totalRecordsCount;
		this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

		if (value == "Stock") {
			this.stockTable = true;
			this.cols = [
				{ field: 'partNumber', header: 'PN' },
				{ field: 'partDescription', header: 'PN Description' },
				{ field: 'manufacturerdesc', header: 'Manufacturer' },
				{ field: 'classificationdesc', header: 'Classification' },
				{ field: 'itemGroup', header: 'Group Name' },
				{ field: 'nationalStockNumber', header: 'NSN' },
				{ field: 'isSerialized', header: 'S/N' },
				{ field: 'isTimeLife', header: 'Time Life' },
			];
			this.selectedColumns = this.cols;
			this.loadingIndicator = false;
			this.allStockInfo = allWorkFlows;
		}
		else if (value == "Non-stock") {
			this.cols1 = [];
			this.selectedColumns1 = [];
			this.cols1 = [
				{ field: 'partNumber', header: 'PN' },
				{ field: 'partDescription', header: 'Description' },
				{ field: 'isHazardousMaterial', header: 'Is Hazardous Material' },
				{ field: 'manufacturerdesc', header: 'Manufacturer' },
				{ field: 'unitCost', header: 'Unit Cost' },
				{ field: 'listPrice', header: 'List Price' },
			];
			this.selectedColumns1 = this.cols1;
			this.allNonstockInfo = allWorkFlows;
		}
		else if (value == "Equipment") {
			this.cols2 = [];
			this.selectedColumns2 = [];
			this.cols2 = [
				{ field: 'partNumber', header: 'Equipment Id' },
				{ field: 'partdescription', header: 'Description' },
				{ field: 'certificationRequired', header: 'Certification' },
				{ field: 'equipmentValidationDescription', header: 'Equipment Validation Type' },
				{ field: 'manufacturerdesc', header: 'Manufacturer' },

			];
			this.selectedColumns2 = this.cols2;
			this.allEquipmentInfo = allWorkFlows;
		}
	}

	private onRolesLoadSuccessfull(allWorkFlows: any[]) {
		this.allRolesInfo = allWorkFlows;
		if (this.allRolesInfo.length > 0) {
			for (let i = 0; i < this.allRolesInfo.length; i++) {
				if (this.allRolesInfo[i].entityName = 'ItemMasterMain') {
					if (this.allRolesInfo[i].permittedEditActionDescription = 'Add') {
						this.Add = true;
						this.NonstockAdd = true;
						this.EquipmentAdd = true;
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'View') {
						this.View = true;
						this.NonstockView = true;
						this.EquipmentView = true;
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'Delete') {
						this.Delete = true;
						this.NonstockDelete = true;
						this.EquipmentDelete = true;
					}

				}
				if (this.allRolesInfo[i].screenName == 'Stock') {

					if (this.allRolesInfo[i].permittedEditActionDescription = 'Add') {
						this.Add = true;
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'View') {
						this.View = true;
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'Delete') {
						this.Delete = true;
					}
				}
				else if (this.allRolesInfo[i].screenName == 'Non Stock') {
					if (this.allRolesInfo[i].permittedEditActionDescription = 'Add') {
						this.NonstockAdd = true;
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'View') {
						this.NonstockView = true;
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'Delete') {
						this.NonstockDelete = true;
					}
				}
				else if (this.allRolesInfo[i].screenName == 'Equipment') {
					if (this.allRolesInfo[i].permittedEditActionDescription = 'Add') {
						this.EquipmentAdd = true;
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'View') {
						this.EquipmentView = true;
					}
					if (this.allRolesInfo[i].permittedEditActionDescription = 'Delete') {
						this.EquipmentDelete = true;
					}
				}
			}
		}
	}

	colsaircraftLD: any[] = [
		{ field: "aircraft", header: "Aircraft" },
		{ field: "model", header: "Model" },
		{ field: "dashNumber", header: "Dash Numbers" },
		{ field: "memo", header: "Memo" }
	];

	atasub: any[] = [
		{ field: 'ataChapterName', header: 'ATA Chapter' },
		{ field: 'ataSubChapterDescription', header: 'ATA Sub-Chapter' }
	];

	pnCols1 = [
		{ field: 'partNo', header: 'PN' },
		{ field: 'pnDiscription', header: 'PN Description' },
		{ field: 'capabilityType', header: 'Cap Type' },
		{ field: 'level1', header: 'Level 01' },
		{ field: 'level2', header: 'Level 02' },
		{ field: 'level3', header: 'Level 03' },
		{ field: 'level4', header: 'Level 04' },
		{ field: 'isVerified', header: 'Verified' },
		{ field: 'verifiedBy', header: 'Verified By' },
		{ field: 'verifiedDate', header: 'Date Verified' },
		{ field: 'memo', header: 'Memo' }
	];

	alterTableColumns: any[] = [
		{ field: "altPartNo", header: "PN" },
		{ field: "altPartDescription", header: "Description" },
		{ field: "manufacturer", header: "Manufacturer " }
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
		this.isSpinnerVisible = true;
		this.isSaving = true;
		this.isDeleteMode = true;
		this.sourceItemMaster.isdelete = false;
		this.sourceItemMaster.updatedBy = this.userName;
		if (this.stockTable) {
			this.itemMasterService.updaateEquipmentDelete(this.sourceItemMaster.itemMasterId).subscribe(
				data => {
					this.geListByStatus(this.currentstatus);
					this.isSpinnerVisible = false;
					this.alertService.showMessage("Success", `Item Was Deleted Successfully `, MessageSeverity.success)
					this.saveCompleted(this.sourceItemMaster);
				});
		}
		if (this.nonStockTable) {
			this.itemMasterService.updateDeleteStatusNonStock(this.sourceItemMaster.itemMasterId).subscribe(
				data => {
					this.geListByStatus(this.currentstatus);
					this.isSpinnerVisible = false;
					this.alertService.showMessage("Success", `Item Was Deleted Successfully `, MessageSeverity.success)
					this.saveCompleted(this.sourceItemMaster);
				});
		}
		this.modal.close();
	}

	openDelete(content, row) {
		this.isEditMode = false;
		this.isDeleteMode = true;
		this.sourceItemMaster = row;
		this.deletePartDesc = row.partNumber + ' - ' + row.partDescription;
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	private nonstockList() {
		this.loadingIndicator = true;
		this.itemMasterService.getItemNonstockList().subscribe(
			results => this.onitemnonstockSuccessful(results[0]),
			error => { this.loadingIndicator = false }
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
			error => { this.loadingIndicator = false }
		);
	}

	private onitemStockSuccessful(allWorkFlows: any[]) {
		this.loadingIndicator = false;
	}

	private EuipmentList() {
		this.loadingIndicator = true;
		this.itemMasterService.getItemEquipmentList().subscribe(
			results => this.onitemequipmntSuccessful(results[0]),
			error => { this.loadingIndicator = false }
		);
	}

	private onitemequipmntSuccessful(allWorkFlows: any[]) {
		this.loadingIndicator = false;
		this.allEquipmentInfo = allWorkFlows;
	}

	// private onDataLoadFailed(error: any) {
	// 	this.isSpinnerVisible = false;
	// 	this.alertService.stopLoadingMessage();
	// 	this.alertService.showStickyMessage(error, null, MessageSeverity.error);
	// }

	private loadMasterCompanies() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.masterComapnyService.getMasterCompanies().subscribe(
			results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
			error => { this.loadingIndicator = false }
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
			rowData.updatedBy = this.userName;
			this.sourceAction.updatedBy = this.userName;
			this.Active = "In Active";
			this.sourceAction.isActive = false;
			this.isSpinnerVisible = true;
			if (this.radioButtonValue == "Stock") {
				this.itemMasterService.updateActionforActiveforstock(rowData).subscribe(
					response => {
						this.lazyLoadEventDataInputStock.filters.isDeleted = this.currentDeletedstatus
						this.lazyLoadEventDataInputStock.filters = { ...this.lazyLoadEventDataInputStock.filters, status: this.currentstatus };
						this.lazyLoadEventDataInputStock.first = 0;
						this.pageNumber = 0;
						let PagingData = {
							...this.lazyLoadEventDataInputStock,
							filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInputStock.filters)
						}
						PagingData.filters.isHazardousMaterial = this.searchData.hazardousMaterial === 'Yes' ? true : (this.searchData.hazardousMaterial === "No" ? false : "")
						if (this.searchData.partNo != "" && this.searchData.partNo != undefined && this.searchData.partNo != null) {
							PagingData.filters.partNumber = this.searchData.partNo;
						}
						if (this.searchData.description != "" && this.searchData.description != undefined && this.searchData.description != null) {
							PagingData.filters.partDescription = this.searchData.description;
						}
						PagingData.filters.status = this.currentstatus;
						this.getItemsListStock(PagingData);
						this.saveCompleted(this.sourceAction),
							this.isSpinnerVisible = false;
						this.alertService.showMessage("Success", `Successfully Updated Status `, MessageSeverity.success)
					},
					error => { this.isSpinnerVisible = false })
			} else {
				this.itemMasterService.updateActionforNonstock(rowData).subscribe(
					response => {
						this.lazyLoadEventDataInputStock.filters.isDeleted = this.currentDeletedstatus
						this.lazyLoadEventDataInputStock.filters = { ...this.lazyLoadEventDataInputStock.filters, status: this.currentstatus };
						this.lazyLoadEventDataInputStock.first = 0;
						this.pageNumber = 0;
						let PagingData = {
							...this.lazyLoadEventDataInputStock,
							filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInputStock.filters)
						}
						PagingData.filters.isHazardousMaterial = this.searchData.hazardousMaterial === 'Yes' ? true : (this.searchData.hazardousMaterial === "No" ? false : "")
						if (this.searchData.partNo != "" && this.searchData.partNo != undefined && this.searchData.partNo != null) {
							PagingData.filters.partNumber = this.searchData.partNo;
						}
						if (this.searchData.description != "" && this.searchData.description != undefined && this.searchData.description != null) {
							PagingData.filters.partDescription = this.searchData.description;
						}
						PagingData.filters.status = this.currentstatus;
						this.getItemsListNonStock(PagingData);
						this.saveCompleted(this.sourceAction),
							this.isSpinnerVisible = false;
						this.alertService.showMessage("Success", `Successfully Updated Status `, MessageSeverity.success)
					},
					error => { this.isSpinnerVisible = false })
			}
		}
		else {
			var employpeeleaveTypeId = [];
			this.sourceAction = rowData;
			employpeeleaveTypeId.push(this.sourceAction.employeeLeaveTypeId);
			this.sourceAction.employeeLeaveTypeId = employpeeleaveTypeId;
			this.sourceAction.itemMasterId = rowData.itemMasterId;
			this.sourceAction.updatedBy = this.userName;
			this.Active = "Active";
			this.sourceAction.isActive = true;
			this.isSpinnerVisible = true;

			if (this.radioButtonValue == "Stock") {
				this.itemMasterService.updateActionforActiveforstock(rowData).subscribe(
					response => {

						this.lazyLoadEventDataInputStock.filters.isDeleted = this.currentDeletedstatus
						this.lazyLoadEventDataInputStock.filters = { ...this.lazyLoadEventDataInputStock.filters, status: this.currentstatus };
						this.lazyLoadEventDataInputStock.first = 0;
						this.pageNumber = 0;
						let PagingData = {
							...this.lazyLoadEventDataInputStock,
							filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInputStock.filters)
						}
						PagingData.filters.isHazardousMaterial = this.searchData.hazardousMaterial === 'Yes' ? true : (this.searchData.hazardousMaterial === "No" ? false : "")
						if (this.searchData.partNo != "" && this.searchData.partNo != undefined && this.searchData.partNo != null) {
							PagingData.filters.partNumber = this.searchData.partNo;
						}
						if (this.searchData.description != "" && this.searchData.description != undefined && this.searchData.description != null) {
							PagingData.filters.partDescription = this.searchData.description;
						}
						PagingData.filters.status = this.currentstatus;
						this.getItemsListStock(PagingData);

						this.saveCompleted(this.sourceAction),
							this.isSpinnerVisible = false;
						this.alertService.showMessage("Success", `Successfully Updated Status `, MessageSeverity.success)
					},
					error => { this.isSpinnerVisible = false })
			} else {
				this.itemMasterService.updateActionforNonstock(rowData).subscribe(
					response => {
						this.lazyLoadEventDataInputStock.filters.isDeleted = this.currentDeletedstatus
						this.lazyLoadEventDataInputStock.filters = { ...this.lazyLoadEventDataInputStock.filters, status: this.currentstatus };
						this.lazyLoadEventDataInputStock.first = 0;
						this.pageNumber = 0;
						let PagingData = {
							...this.lazyLoadEventDataInputStock,
							filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInputStock.filters)
						}
						PagingData.filters.isHazardousMaterial = this.searchData.hazardousMaterial === 'Yes' ? true : (this.searchData.hazardousMaterial === "No" ? false : "")
						if (this.searchData.partNo != "" && this.searchData.partNo != undefined && this.searchData.partNo != null) {
							PagingData.filters.partNumber = this.searchData.partNo;
						}
						if (this.searchData.description != "" && this.searchData.description != undefined && this.searchData.description != null) {
							PagingData.filters.partDescription = this.searchData.description;
						}
						PagingData.filters.status = this.currentstatus;
						this.getItemsListNonStock(PagingData);
						this.saveCompleted(this.sourceAction),
							this.isSpinnerVisible = false;
						this.alertService.showMessage("Success", `Successfully Updated Status `, MessageSeverity.success)
					},
					error => { this.isSpinnerVisible = false })
			}
		}
	}

	private saveCompleted(user?: any) {
		this.isSaving = false;
		if (this.isDeleteMode == true) {
			this.isDeleteMode = false;
		}
	}

	// errorMessageHandler(log) {
	// 	this.isSpinnerVisible = false;
	// 	this.alertService.showMessage(
	// 		'Error',
	// 		log.error,
	// 		MessageSeverity.error
	// 	);
	// }

	// private saveFailedHelper(error: any) {
	// 	this.isSaving = false;
	// 	this.isSpinnerVisible = false;
	// 	this.alertService.stopLoadingMessage();
	// 	this.alertService.showStickyMessage(error, null, MessageSeverity.error);
	// }

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

	openView(row) {
		this.isViewOpened = true;
		this.itemMasterRowData = row;
		this.closeItemMasterDetails();
		this.itemMasterId = row.itemMasterId;
		this.toGetAllDocumentsList(row.itemMasterId);
		this.toGetDocumentsListNew(row.itemMasterId)
		this.getItemMasterById(row.itemMasterId);
		this.getPurchaseSalesInfo(this.itemMasterId);
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

		this.getAllSubChapters();
		this.getAircraftMappedDataByItemMasterId(row.itemMasterId);
		this.getATAMappedDataByItemMasterId(row.itemMasterId);
		this.getNtaeData(row.itemMasterId);
		this.getExchange(row.itemMasterId);

		this.loadMasterCompanies();
	}

	openViewOnDbl(rowData) {
		this.openView(rowData);
		$('#itemMasterView').modal('show');
	}

	getPurchaseSalesInfo(id) {
		this.itemMasterService.getPurcSaleDetailById(id).subscribe(res => {
			this.purchaseSalesInfo = res;
		});
	}

	restoreStockItem(rowData) {
		this.rowDataToDeleteStock = rowData;
		this.rowDataToDelete = rowData;
		$("#itemRestore").modal("show");
	}

	restoreNonStockItem(rowData) {
		this.rowDataToDelete = rowData;
		this.rowDataToDeleteStock = rowData;
		$("#nonStockRestore").modal("show");
	}
	closeItemRestore() {
		$("#itemRestore").modal("hide");
	}
	closeNonStockRestore() {
		$("#nonStockRestore").modal("hide");
	}



	restore() {
		const { itemMasterId } = this.rowDataToDeleteStock;
		this.commonService.updatedeletedrecords11('ItemMaster', 'itemMasterId', itemMasterId).subscribe(res => {
			this.getDeleteListByStatus(true)
			this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
		})
	}

	restoreNonStock() {
		const { itemMasterId } = this.rowDataToDelete;
		this.commonService.updatedeletedrecords11('ItemMasterNonStock', 'ItemMasterNonStockId', itemMasterId).subscribe(res => {
			this.getDeleteListByStatus(true)
			this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
		})
	}

	getExchange(itemMasterId) {
		this.itemMasterService.getExchangeLoan(itemMasterId).subscribe(res => {
			if (res[0] != null && res[0] != undefined) {
				this.exchangeLoanInfo = res[0];
			}
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

	resetViewData() {
		this.viewRowData = undefined;
	}

	viewSelectedRow(rowData) {
		this.viewRowData = rowData;
	}

	// get all subchapter for dropdown
	getAllSubChapters() {
		this.atasubchapter1service
			.getAtaSubChapter1List()
			.subscribe(atasubchapter => {
				this.orginalAtaSubChapterValues = atasubchapter[0];
			});
	}

	getATAMappedDataByItemMasterId(itemMasterId) {
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
					memo: x.memo,
				}
			});
		});
	}

	getItemMasterById(itemMasterId) {
		this.itemMasterService.getItemMasterDetailById(itemMasterId).subscribe(res => {
			this.viewItemMaster = res[0];
		});
	}

	openViewforNonstock(content, row) {
		this.isSpinnerVisible = true;
		this.itemMasterService.getItemMasterNonStockDataById(row.itemMasterId).subscribe(res => {
			this.viewItemMasterNS = {
				...res,
				unitCost: res.unitCost ? formatNumberAsGlobalSettingsModule(res.unitCost, 2) : '',
				listPrice: res.listPrice ? formatNumberAsGlobalSettingsModule(res.listPrice, 2) : '',
				discountPurchasePercent: res.discountPurchasePercent ? formatNumberAsGlobalSettingsModule(res.discountPurchasePercent, 2) : '',
			};
			this.isSpinnerVisible = false;
		}, err => {
			this.isSpinnerVisible = false;

		})

		this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
	}

	openHelpText(content) {
		this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
	}

	public navigateTogeneralInfostock() {
		this.activeIndex = 0;
		this.itemMasterService.indexObj.next(this.activeIndex);
		this.itemMasterService.isEditMode = false;
		this.itemMasterService.enableExternal = false;
		this.route.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-stock');
		localStorage.removeItem('currentTab');
	}

	public navigateTogeneralInfononstock() {
		this.activeIndex = 0;
		this.itemMasterService.indexObj.next(this.activeIndex);
		this.itemMasterService.isEditMode = false;
		this.itemMasterService.enableExternal = false;
		this.route.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-non-stock')
	}

	public navigateTogeneralInfoequipment() {
		this.activeIndex = 0;
		this.itemMasterService.indexObj.next(this.activeIndex);
		this.itemMasterService.isEditMode = false;
		this.itemMasterService.enableExternal = false;
		this.route.navigateByUrl('/itemmastersmodule/itemmasterpages/app-item-master-equipment')
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
		this.isViewOpened = false;
		$('#itemMasterView').modal('hide');
		this.itemMasterId = undefined;
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

	getPageCount(totalNoofRecords, pageSize) {
		return Math.ceil(totalNoofRecords / pageSize)
	}

	onViewAircraft(rowData) {
		this.viewAircraftData = rowData;
	}

	onViewAircraftonDbl(rowData) {
		this.onViewAircraft(rowData);
		$('#viewAircraft').modal('show');
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

	advancedSearchData(searchData) {
		this.loadingIndicator = true;
		const itemMasterSearch = {
			partNumber: searchData.partNo,
			partDescription: searchData.description,
			wildCardSearch: searchData.wildCardSearch,
			listPrice: searchData.listPrice,
			isDeleted: this.currentDeletedstatus,
			status: this.currentstatus,
			isHazardousMaterial: searchData.hazardousMaterial === 'Yes' ? true : (searchData.hazardousMaterial === "No" ? false : ""),
			masterCompanyId: this.currentUserMasterCompanyId
		}

		const filterdData = {
			first: 0,
			rows: 10,
			sortField: undefined,
			sortOrder: 1,
			filters: itemMasterSearch,
			globalFilter: "",
			multiSortMeta: undefined
		}
		if (searchData.stockType === 'Stock') {

			this.loadStockDataList(filterdData);

		} else {
			this.loadNonStockDataList(filterdData);
		}
		this.loadingIndicator = false;
	}

	clearAdvanceSerchData() {
		this.searchData.partNo = '',
			this.searchData.description = '',
			this.searchData.hazardousMaterial = '',
			this.searchData.listPrice = ''
	}

	clearSerchData() {
		this.loadingIndicator = true;
		const filterdData = {
			first: 0,
			rows: 10,
			sortField: undefined,
			sortOrder: 1,
			filters: "",
			globalFilter: "",
			multiSortMeta: undefined
		}
		if (this.searchData.stockType === 'Stock') {
			this.loadStockData(filterdData);

		} else {
			this.loadNonStockData(filterdData);
		}
		this.searchData.partNo = '',
			this.searchData.description = '',
			this.searchData.hazardousMaterial = '',
			this.searchData.listPrice = ''

		this.loadingIndicator = false;
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
				error => { this.loadingIndicator = false }
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
		this.commonService.smartDropDownList('ItemMaster', 'ItemMasterId', 'partnumber', '', '', 0, this.authService.currentUser.masterCompanyId).subscribe(
			results => this.onptnmbersSuccessful(results),
			error => { this.loadingIndicator = false }
		)
	}

	private onptnmbersSuccessful(allWorkFlows: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allPartnumbersInfo = allWorkFlows.map(x => {
			return {
				...x,
				partNumber: x.label,
				partId: x.value,
			}
		});
	}

	private onDataLoadcountrySuccessful(allWorkFlows: any[]) {
		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		this.allCountryInfo = allWorkFlows;
	}

	toggleShowOpenAdvancedSearch(dt) {
		this.isOpenAdvancedSearch = !this.isOpenAdvancedSearch;
		if (dt.filters.partNumber && this.isOpenAdvancedSearch) {
			dt.filters.partNumber.value = '';
		}
		if (dt.filters.partDescription && this.isOpenAdvancedSearch) {
			dt.filters.partDescription.value = '';
		}
	}

	private loadStockDataList(event) {
		this.lazyLoadEventData = event;
		this.pageIndex = parseInt(event.first) / event.rows;
		this.pageSize = event.rows;
		event.first = this.pageIndex;
		event.filters.status = this.currentstatus;
		if (event.globalFilter == null) {
			event.globalFilter = ""
		}

		if (this.searchData.partNo != "" && this.searchData.partNo != undefined && this.searchData.partNo != null) {
			event.filters.partNumber = this.searchData.partNo;
		}
		if (this.searchData.description != "" && this.searchData.description != undefined && this.searchData.description != null) {
			event.filters.partDescription = this.searchData.description;
		}

		const PagingData = { ...event, filters: listSearchFilterObjectCreation(event.filters) }
		this.loadingIndicator = true;
		this.itemMasterService.getItemMasterStockListData(PagingData).subscribe(
			results => {
				this.stockTable = true;

				this.stockTableColumns = this.cols;
				this.loadingIndicator = false;

				this.allStockInfo = results[0]['results'].map(x => {
					return {
						...x,
						isTimeLife: x.isTimeLife == "1" ? 'true' : 'false',
						isSerialized: x.isSerialized == "1" ? 'true' : 'false'
					}
				});

				this.totalRecords = results[0]['totalRecordsCount']
				this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
			},
			error => { this.loadingIndicator = false }
		);
	}

	private getisHazardousMaterial(isHazardousMaterial) {
		if (isHazardousMaterial) {
			return isHazardousMaterial === 'Yes' ? 'True' : 'False';
		}
	}

	private loadNonStockDataList(event) {
		this.lazyLoadEventDataForNonStock = event;
		this.pageIndexNonStock = parseInt(event.first) / event.rows;
		this.pageSizeNonStock = event.rows;
		event.first = this.pageIndexNonStock
		event.filters.status = this.currentstatus;
		this.loadingIndicator = true;
		if (event.globalFilter == null) {
			event.globalFilter = ""
		}

		const PagingData = { ...event, filters: listSearchFilterObjectCreation(event.filters) }

		this.itemMasterService.getItemMasterNonStockListData(PagingData).subscribe(
			results => {
				this.nonStockTable = true;
				this.stockTable = false;
				this.nonStockTableColumns = this.cols1;
				this.loadingIndicator = false;

				this.allNonstockInfo = results[0]['results'].map(x => {
					return {
						...x,
						unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
						listPrice: x.listPrice ? formatNumberAsGlobalSettingsModule(x.listPrice, 2) : '0.00',
						isHazardousMaterial: x.isHazardousMaterial == "1" ? 'true' : 'false'
					}
				});

				this.totalRecordsNonStock = results[0]['totalRecordsCount']
				this.totalPagesNonStock = Math.ceil(this.totalRecordsNonStock / this.nonStockPageSize);
			},
			error => { this.loadingIndicator = false }
		);

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

	lazyLoadEventDataInput: any;

	geListByStatus(status) {
		this.currentstatus = status;
		const itemMasterSearch = {
			partNumber: this.searchData.partNo,
			partDescription: this.searchData.description,
			status: this.currentstatus,
			isDeleted: this.currentDeletedstatus,
			isHazardousMaterial: this.searchData.hazardousMaterial === 'Yes' ? true : (this.searchData.hazardousMaterial === "No" ? false : ""),
			listPrice: this.searchData.listPrice,
			masterCompanyId: this.currentUserMasterCompanyId
		}

		const filterdData = {
			first: 0,
			rows: 10,
			sortField: undefined,
			sortOrder: 1,
			filters: itemMasterSearch,
			globalFilter: "",
			multiSortMeta: undefined
		}

		if (this.searchData.stockType === 'Stock') {
			this.loadStockDataList(filterdData);

		} else {
			this.loadNonStockDataList(filterdData);
		}
		this.loadingIndicator = false;
	}

	currentDeletedstat = false;
	getDeleteListByStatus(value) {
		this.currentDeletedstatus = value;
		this.lazyLoadEventDataInputStock.filters.isDeleted = value
		this.lazyLoadEventDataInputStock.filters = { ...this.lazyLoadEventDataInputStock.filters, status: this.currentstatus };
		this.lazyLoadEventDataInputStock.first = 0;
		this.pageNumber = 0;
		let PagingData = {
			...this.lazyLoadEventDataInputStock,
			filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInputStock.filters)
		}
		PagingData.filters.isHazardousMaterial = this.searchData.hazardousMaterial === 'Yes' ? true : (this.searchData.hazardousMaterial === "No" ? false : "")
		if (this.searchData.partNo != "" && this.searchData.partNo != undefined && this.searchData.partNo != null) {
			PagingData.filters.partNumber = this.searchData.partNo;
		}
		if (this.searchData.description != "" && this.searchData.description != undefined && this.searchData.description != null) {
			PagingData.filters.partDescription = this.searchData.description;
		}
		PagingData.filters.status = this.currentstatus;

		if (this.radioButtonValue == "Stock") {
			this.getItemsListStock(PagingData);
		} else {
			PagingData.filters.listPrice = this.searchData.listPrice;
			PagingData.filters.wildCardSearch = this.searchData.wildCardSearch;
			this.getItemsListNonStock(PagingData)
		}
	}

	exportCSV(dt) {
		this.isSpinnerVisible = true;
		if (this.radioButtonValue == "Stock") {
			this.getAllStockDataforDownload(dt);
		} else {
			this.getAllNonStockDataforDownload(dt)
		}
	}

	getAllStockDataforDownload(dt) {
		this.isSpinnerVisible = true;
		const isdelete = this.currentDeletedstatus ? true : false;
		let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "masterCompanyId": this.currentUserMasterCompanyId, "status": this.currentstatus, "isDeleted": isdelete }, "globalFilter": "" }
		let filters = Object.keys(dt.filters);
		filters.forEach(x => {
			PagingData.filters[x] = dt.filters[x].value;
		})
		filters = Object.keys(this.searchData);
		filters.forEach(x => {
			if (this.searchData[x]) {
				if (x == 'partNo') {
					PagingData.filters['partNumber'] = this.searchData[x];
				}
				else {
					PagingData.filters[x] = this.searchData[x];
				}
			}
		})
		PagingData.filters['stockType'] = "";
		//this.itemMasterService.advancedSearchStockListData(PagingData).subscribe(
		this.itemMasterService.getItemMasterStockListData(PagingData).subscribe(
			results => {
				this.loadingIndicator = false;
				dt._value = results[0]['results'].map(x => {
					return {
						...x,
						itemType: 'stock',
						isTimeLife: x.isTimeLife == "1" ? 'true' : 'false',
						isSerialized: x.isSerialized == "1" ? 'true' : 'false',
						createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
						updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
					}
				});
				dt.exportCSV();
				dt.value = this.allStockInfo;
				this.isSpinnerVisible = false;
			},
			error => { this.loadingIndicator = false }
		);
	}

	getAllNonStockDataforDownload(dt) {
		this.isSpinnerVisible = true;
		//Need to Set global filters
		let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "masterCompanyId": this.currentUserMasterCompanyId, "status": this.currentstatus, "isDeleted": false }, "globalFilter": "" }
		let filters = Object.keys(dt.filters);
		filters.forEach(x => {
			PagingData.filters[x] = dt.filters[x].value;
		})
		//this.itemMasterService.advancedSearchNonStockListData(PagingData).subscribe(
		this.itemMasterService.getItemMasterNonStockListData(PagingData).subscribe(
			results => {
				this.loadingIndicator = false;
				dt._value = results[0]['results'].map(x => {
					return {
						...x,
						createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
						updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',

					}
				});
				dt._value.itemType = 'Non-Stock';
				dt.exportCSV();
				dt.value = this.allNonstockInfo;
				this.isSpinnerVisible = false;
			},
			error => { this.loadingIndicator = false }
		);
	}


	edit(rowData) { }

	getAuditHistoryById(rowData) {

	}

	changeStatus(rowData) { }

	dateFilterForItemMasterList(date, field, el) {
		if (date === '') { el.classList.add("hidePlaceHolder"); }
		else el.classList.remove("hidePlaceHolder");
		const minyear = '1900';
		const dateyear = moment(date).format('YYYY');;
		this.dateObject = {}
		date = moment(date).format('MM/DD/YYYY');
		moment(date).format('MM/DD/YY');
		if (date != "" && moment(date, 'MM/DD/YYYY', true).isValid()) {
			if (dateyear > minyear) {
				if (field == 'createdDate') {
					this.dateObject = { 'createdDate': date }
				} else if (field == 'updatedDate') {
					this.dateObject = { 'updatedDate': date }
				}
				this.lazyLoadEventDataInputStock.filters = {
					...this.lazyLoadEventDataInputStock.filters,
					...this.dateObject
				}
				this.getItemsListStock(this.lazyLoadEventDataInputStock);
			}
		} else {
			this.lazyLoadEventDataInputStock.filters = { ...this.lazyLoadEventDataInputStock.filters, ...this.dateObject };
			if (this.lazyLoadEventDataInputStock.filters && this.lazyLoadEventDataInputStock.filters.createdDate) {
				delete this.lazyLoadEventDataInputStock.filters.createdDate;
			}
			if (this.lazyLoadEventDataInputStock.filters && this.lazyLoadEventDataInputStock.filters.updatedDate) {
				delete this.lazyLoadEventDataInputStock.filters.updatedDate;
			}
			this.lazyLoadEventDataInputStock.filters = { ...this.lazyLoadEventDataInputStock.filters, ...this.dateObject };
			this.getItemsListStock(this.lazyLoadEventDataInputStock);
		}
	}

	dateFilterForItemNonstockList(date, field, el) {
		if (date === '') { el.classList.add("hidePlaceHolder"); }
		else el.classList.remove("hidePlaceHolder");
		const minyear = '1900';
		const dateyear = moment(date).format('YYYY');;
		this.dateObject = {}
		date = moment(date).format('MM/DD/YYYY');
		moment(date).format('MM/DD/YY');
		if (date != "" && moment(date, 'MM/DD/YYYY', true).isValid()) {
			if (dateyear > minyear) {
				if (field == 'createdDate') {
					this.dateObject = { 'createdDate': date }
				} else if (field == 'updatedDate') {
					this.dateObject = { 'updatedDate': date }
				}
				this.lazyLoadEventDataForNonStock.filters = {
					...this.lazyLoadEventDataForNonStock.filters,
					...this.dateObject
				}
				this.getItemsListNonStock(this.lazyLoadEventDataForNonStock)
			}
		} else {
			this.lazyLoadEventDataForNonStock.filters = { ...this.lazyLoadEventDataForNonStock.filters, ...this.dateObject };
			if (this.lazyLoadEventDataForNonStock.filters && this.lazyLoadEventDataForNonStock.filters.createdDate) {
				delete this.lazyLoadEventDataForNonStock.filters.createdDate;
			}
			if (this.lazyLoadEventDataForNonStock.filters && this.lazyLoadEventDataForNonStock.filters.updatedDate) {
				delete this.lazyLoadEventDataForNonStock.filters.updatedDate;
			}
			this.lazyLoadEventDataForNonStock.filters = { ...this.lazyLoadEventDataForNonStock.filters, ...this.dateObject };
			this.getItemsListNonStock(this.lazyLoadEventDataForNonStock)
		}
	}
}