import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { StocklineService } from '../../../services/stockline.service';
import { Site } from '../../../models/site.model';
import { CommonService } from '../../../services/common.service';
import { Subject } from 'rxjs'
declare var $ : any;
import { takeUntil } from 'rxjs/operators';
import { formatNumberAsGlobalSettingsModule, getValueFromObjectByKey, getValueFromArrayOfObjectById } from '../../../generic/autocomplete';
import { DatePipe } from '@angular/common';
import { timePattern } from '../../../validations/validation-pattern';
import { TimeLifeDraftData } from '../../../components/receiving/po-ro/receivng-po/PurchaseOrder.model';

@Component({
	selector: 'app-stock-adjustment',
	templateUrl: './stock-adjustment.component.html',
	styleUrls: ['./stock-adjustment.component.scss'],
	providers: [DatePipe]
})
/** stock-adjustment component*/
export class StockAdjustmentComponent implements OnInit {

	sourceStockLineSetup: any = {};
	private onDestroy$: Subject<void> = new Subject<void>();
	stockLineId: number;
	legalEntityList: any;	
	businessUnitList: any;
	timePattern = timePattern();
	departmentList: any;
	existingMgmentStuc: any = {
		level1: '',
		level2: '',
		level3: '',
		level4: ''
	};
	managementStructure = {
        companyId: 0,
        buId: 0,
        divisionId: 0,
        departmentId: 0,
	}
	managementStructureOnLoad = {
        companyId: 0,
        buId: 0,
        divisionId: 0,
        departmentId: 0,
	}
	defaultDate: Date = new Date('Fri Sep 1 2009 00:00:00');
	companyAllow: boolean = false;
	businessAllow: boolean = false;
	divisionAllow: boolean = false;
	deptAllow: boolean = false;
	showCompany: boolean = false;
	showBusiness: boolean = false;
	showDivision: boolean = false;
	showDepartment: boolean = false;
	allWareHouses: any;
    allLocations: any;
	allShelfs: any;
	allBins: any;
	allSites: Site[];
	siteAllow: boolean = false;
	warehouseAllow: boolean = false;
	locationAllow: boolean = false;
	shelfAllow: boolean = false;
	binAllow: boolean = false;
	showSite: boolean = false;
	stockMemoInfo:string;
	stockMemoLabel:string;
	showWarehouse: boolean = false;
	showLocation: boolean = false;
	showShelf: boolean = false;
	showBin: boolean = false;
	memoPopupContent: any;
	textAreaInfo: any;
	addrawNo: any;
	itemTypesList: any = [];
	stocklineAdjustmentData: any = [];
	allPartnumbersList: any = [];
	arrayItemMasterlist:any[] = [];
	partNumbersCollection: any = [];
	allCurrencyInfo: any = [];
	allAdjReasonInfo: any = [];
	categoryAllow: boolean = false;
	partNumberAllow: boolean = false;
	serialNumAllow: boolean = false;
	quantityOnHandAllow: boolean = false;
	unitCostAllow: boolean = false;
	unitSalesPriceAllow: boolean = false;
	lotCostAllow: boolean = false;
	timeLifeAllow: boolean = false;
	sourceTimeLife: any = {};
	currentItem:any={};
	timeLifeCyclesId: number;
	legalEntityId: number;
	defaultCurrencyId: number;
	tempStockData: any = [];
	isSpinnerVisible: boolean = true;
	disableLevel1: boolean = false;
	disableLevel2: boolean = false;
	disableLevel3: boolean = false;
	disableLevel4: boolean = false;
	disableSite: boolean = false;
	disableWarehouse: boolean = false;
	disableLocation: boolean = false;
	disableShelf: boolean = false;
	disableBin: boolean = false;
	disableCategory: boolean = false;
	disableQtyOnHandAdj: boolean = false;
	disableUnitCostAdj: boolean = false;
	disableSalesPriceAdj: boolean = false;
	disablelotCostAdj: boolean = false;
	headerInfo: any = {};
	maincompanylist: any[] = [];
	bulist: any[] = [];
	departmentListOriginal: any[] = [];
	divisionListOriginal: any[] = [];
	divisionList: any[] = [];

	constructor(private _actRoute: ActivatedRoute, private stockLineService: StocklineService, private commonService: CommonService, private authService: AuthService, private router: Router, private alertService: AlertService, private datePipe: DatePipe) {
		this.stockLineService.currentUrl = '/stocklinemodule/stocklinepages/app-stock-adjustment';
		this.stockLineService.bredcrumbObj.next(this.stockLineService.currentUrl);
	}

	ngOnInit() {
		this.getDefaultCurrency();						
		this.getCurrencyData();
		this.getAdjReasonData();
		this.getStocklineAdjustmentDataType();

		this.stockLineId = this._actRoute.snapshot.params['id'];
		if(this.stockLineId) {
			this.getStockLineAdjDetailsById(this.stockLineId);
		}
	}

	getDefaultCurrency() {
        this.legalEntityId = 19;
        this.commonService.getDefaultCurrency(this.legalEntityId,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.defaultCurrencyId = res.currencyId;
        })
	}
	
	get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}
	
	get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
	}

	getLegalEntity() {
        this.commonService.getLegalEntityList().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.legalEntityList = res;
        })
	}

	loadSiteData() {
		this.commonService.smartDropDownList('Site', 'SiteId', 'Name',this.authService.currentUser.masterCompanyId,'','', 0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.allSites = res;
        })
	}

	getItemTypes() {
		this.commonService.smartDropDownList('ItemType', 'ItemTypeId', 'Description',this.authService.currentUser.masterCompanyId,'','', 0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.itemTypesList = res;
        })
	}
	onAddStockMemo(currentItem){
	this.currentItem=currentItem;
		this.stockMemoInfo='';
	}
	onSaveStockMemo(){
				this.currentItem.adjustmentMemo=this.stockMemoInfo;
			}

	onClickMemo(value,row_no, obj) {
            this.memoPopupContent = obj;
            this.addrawNo = row_no;
    }

	onClickMemoOld() {
        this.memoPopupContent = this.stocklineAdjustmentData.adjustmentMemo;
	}   

    onClickPopupSave() {
        this.stocklineAdjustmentData.adjustmentMemo = this.memoPopupContent;
        this.memoPopupContent = '';
        $('#memo-popup-Doc').modal("hide");
	}
	
    closeMemoModel() {
        $('#memo-popup-Doc').modal("hide");
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

	private saveFailedHelper(error: any) {
		this.isSpinnerVisible = false;
	}
	
	loadPartNumData(strText = '') {
		if(this.arrayItemMasterlist.length == 0) {			
            this.arrayItemMasterlist.push(0); }
		this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'partnumber', strText, true, 20, this.arrayItemMasterlist.join(),this.authService.currentUser.masterCompanyId).subscribe(response => {
			this.allPartnumbersList = response;
			this.partNumbersCollection = this.allPartnumbersList;
		}, error => this.saveFailedHelper(error));
	}
 
	getCurrencyData() {
		this.commonService.smartDropDownList('Currency', 'CurrencyId', 'Code',this.authService.currentUser.masterCompanyId,'','', 0).subscribe(response => {
			this.allCurrencyInfo = response;
		});
	}

	get employeeId() {
		return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
	}

	getAdjReasonData() {
		this.commonService.smartDropDownList('StocklineAdjustmentReason', 'AdjustmentReasonId', 'Description',this.authService.currentUser.masterCompanyId,'','', 0).subscribe(response => {
			this.allAdjReasonInfo = response;
		});
	}	

	getStocklineAdjustmentDataType() {
		this.commonService.smartDropDownList('StocklineAdjustmentDataType', 'StocklineAdjustmentDataTypeId', 'Description',this.authService.currentUser.masterCompanyId,'','', 0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.stocklineAdjustmentData = res.map(x => {
				return {
					adjustmentDataTypeId: x.value,
					stocklineAdjustmentDataType: x.label
				}
			});
			this.stocklineAdjustmentData = this.stocklineAdjustmentData.sort((a,b) => (a.adjustmentDataTypeId > b.adjustmentDataTypeId) ? 1 : ((b.adjustmentDataTypeId > a.adjustmentDataTypeId) ? -1 : 0));
			
			this.stocklineAdjustmentData.map(x => {
				if(x.adjustmentDataTypeId == 2 || x.adjustmentDataTypeId == 3 || x.adjustmentDataTypeId == 4 || x.adjustmentDataTypeId == 5 || x.adjustmentDataTypeId == 6 || x.adjustmentDataTypeId == 7) {
					x.afterValue = 0;
				}
				if(x.adjustmentDataTypeId == 10 || x.adjustmentDataTypeId == 11 || x.adjustmentDataTypeId == 12 || x.adjustmentDataTypeId == 13) {
					x.adjustmentReasonId = 0;
				}
				if(x.adjustmentDataTypeId == 11 || x.adjustmentDataTypeId == 12 || x.adjustmentDataTypeId == 13) {
					x.currencyId = this.defaultCurrencyId;
				}
				this.isSpinnerVisible = false;
			});
        })
	}

	getStockLineAdjDetailsById(id) {
		this.stockLineService.getStockLineAdjustmentList(id).subscribe(res => {
			this.sourceStockLineSetup = res;
			this.sourceStockLineSetup.isTimeLife = this.sourceStockLineSetup.isTimeLife ? this.sourceStockLineSetup.isTimeLife : false;
			this.stocklineAdjustmentData.map(x => {
				if(x.adjustmentDataTypeId == 1) {
					x.beforeValue = this.sourceStockLineSetup.managementStructureId;					
				}
				if(x.adjustmentDataTypeId == 2) {
					x.beforeValue = this.sourceStockLineSetup.siteId ? this.sourceStockLineSetup.siteId : null;
				}
				if(x.adjustmentDataTypeId == 3) {
					x.beforeValue = this.sourceStockLineSetup.warehouseId ? this.sourceStockLineSetup.warehouseId : null;
				}
				if(x.adjustmentDataTypeId == 4) {
					x.beforeValue = this.sourceStockLineSetup.locationId ? this.sourceStockLineSetup.locationId : null;
				}
				if(x.adjustmentDataTypeId == 5) {
					x.beforeValue = this.sourceStockLineSetup.shelfId ? this.sourceStockLineSetup.shelfId : null;
				}
				if(x.adjustmentDataTypeId == 6) {
					x.beforeValue = this.sourceStockLineSetup.binId ? this.sourceStockLineSetup.binId : null;
				}
				if(x.adjustmentDataTypeId == 7) {
					x.beforeValue = this.sourceStockLineSetup.itemCategory ? this.sourceStockLineSetup.itemCategory : null;
				}
				if(x.adjustmentDataTypeId == 8) {
					x.beforeValue = this.sourceStockLineSetup.itemMasterId ? this.sourceStockLineSetup.itemMasterId : null;
				}
				if(x.adjustmentDataTypeId == 9) {
					x.beforeValue = this.sourceStockLineSetup.serialNumber ? this.sourceStockLineSetup.serialNumber : null;
				}
				if(x.adjustmentDataTypeId == 10) {
					x.beforeValue = this.sourceStockLineSetup.quantityOnHand ? this.sourceStockLineSetup.quantityOnHand : 0;
					this.sourceStockLineSetup.quantityOnHand = this.sourceStockLineSetup.quantityOnHand ? formatNumberAsGlobalSettingsModule(this.sourceStockLineSetup.quantityOnHand, 0) : '0';
				}
				if(x.adjustmentDataTypeId == 11) {
					// x.beforeValue = this.sourceStockLineSetup.coreUnitCost ? this.sourceStockLineSetup.coreUnitCost : 0;
					// this.sourceStockLineSetup.coreUnitCost = this.sourceStockLineSetup.coreUnitCost ? formatNumberAsGlobalSettingsModule(this.sourceStockLineSetup.coreUnitCost, 2) : '0.00';

					x.beforeValue = this.sourceStockLineSetup.unitCost ? this.sourceStockLineSetup.unitCost : 0;
					this.sourceStockLineSetup.unitCost = this.sourceStockLineSetup.unitCost ? formatNumberAsGlobalSettingsModule(this.sourceStockLineSetup.unitCost, 2) : '0.00';
				}
				if(x.adjustmentDataTypeId == 12) {
					x.beforeValue = this.sourceStockLineSetup.unitSalesPrice ? this.sourceStockLineSetup.unitSalesPrice : 0;
					this.sourceStockLineSetup.unitSalesPrice = this.sourceStockLineSetup.unitSalesPrice ? formatNumberAsGlobalSettingsModule(this.sourceStockLineSetup.unitSalesPrice, 2) : '0.00';
				}
				if(x.adjustmentDataTypeId == 13) {
					x.beforeValue = this.sourceStockLineSetup.lotCost ? this.sourceStockLineSetup.lotCost : 0;
					this.sourceStockLineSetup.lotCost = this.sourceStockLineSetup.lotCost ? formatNumberAsGlobalSettingsModule(this.sourceStockLineSetup.lotCost, 2) : '0.00';
				}
			});
			this.getManagementStructureCodes(this.sourceStockLineSetup.managementStructureId);
			if (this.sourceStockLineSetup.timelIfeData != undefined && this.sourceStockLineSetup.timelIfeData != null   ) {
				this.timeLifeCyclesId = this.sourceStockLineSetup.timelIfeData.timeLifeCyclesId;
				//this.sourceTimeLife = this.sourceStockLineSetup.timelIfeData;
				this.sourceTimeLife = this.getTimeLifeDetails(res.timelIfeData);
			}
		});
	}

	getManagementStructureCodes(id,empployid=0,editMSID=0) {
		empployid = empployid == 0 ? this.employeeId : empployid ;
		this.commonService.getManagmentStrctureData(id,empployid,editMSID,this.authService.currentUser.masterCompanyId).subscribe(response => {
			if(response) {
				const result = response;
				if(result[0] && result[0].level == 'Level1') {
					for(let i = 0; i < result[0].lstManagmentStrcture.length; i++){
						if(result[0].lstManagmentStrcture[i].value == result[0].managementStructureId) {
							this.existingMgmentStuc.level1 = result[0].lstManagmentStrcture[i].label;
						}
					}
					this.maincompanylist =  result[0].lstManagmentStrcture;	
					this.headerInfo.companyId = result[0].managementStructureId;
					this.headerInfo.managementStructureId = result[0].managementStructureId;				
					this.headerInfo.buId = 0;
					this.headerInfo.divisionId = 0;
					this.headerInfo.departmentId = 0;	
					this.bulist = [];
					this.divisionListOriginal = [];
					this.departmentListOriginal = [];
				} else {
					this.existingMgmentStuc.level1 = '';
					this.headerInfo.companyId = 0;
					this.headerInfo.buId = 0;
					this.headerInfo.divisionId = 0;
					this.headerInfo.departmentId = 0;	
					this.maincompanylist = [];
					this.bulist = [];
					this.divisionListOriginal = [];
					this.departmentListOriginal = [];
				}
				
				if(result[1] && result[1].level == 'Level2') {	
					for(let i = 0; i < result[1].lstManagmentStrcture.length; i++){
						if(result[1].lstManagmentStrcture[i].value == result[1].managementStructureId) {
							this.existingMgmentStuc.level2 = result[1].lstManagmentStrcture[i].label;
						}
					}
					this.bulist = result[1].lstManagmentStrcture;
					this.headerInfo.buId = result[1].managementStructureId;
					this.headerInfo.managementStructureId = result[1].managementStructureId;
					this.headerInfo.divisionId = 0;
					this.headerInfo.departmentId = 0;
					this.divisionListOriginal = [];
					this.departmentListOriginal = [];
				} else {
					if(result[1] && result[1].level == 'NEXT') {
						this.bulist = result[1].lstManagmentStrcture;
					}
					this.existingMgmentStuc.level2 = '';
					this.headerInfo.buId = 0;
					this.headerInfo.divisionId = 0;
					this.headerInfo.departmentId = 0;					
					this.divisionListOriginal = [];
					this.departmentListOriginal = []; 
				}

				if(result[2] && result[2].level == 'Level3') {		
					for(let i = 0; i < result[2].lstManagmentStrcture.length; i++){
						if(result[2].lstManagmentStrcture[i].value == result[2].managementStructureId) {
							this.existingMgmentStuc.level3 = result[2].lstManagmentStrcture[i].label;
						}
					}
					this.divisionListOriginal =  result[2].lstManagmentStrcture;		
					this.headerInfo.divisionId = result[2].managementStructureId;		
					this.headerInfo.managementStructureId = result[2].managementStructureId;			
					this.headerInfo.departmentId = 0;						
					this.departmentListOriginal = [];			
				} else {
					if(result[2] && result[2].level == 'NEXT') {
						this.divisionListOriginal = result[2].lstManagmentStrcture;						
					}
					this.existingMgmentStuc.level3 = '';
					this.headerInfo.divisionId = 0; 
					this.headerInfo.departmentId = 0;	
					this.departmentListOriginal = [];}

				if(result[3] && result[3].level == 'Level4') {		
					for(let i = 0; i < result[3].lstManagmentStrcture.length; i++){
						if(result[3].lstManagmentStrcture[i].value == result[3].managementStructureId) {
							this.existingMgmentStuc.level4 = result[3].lstManagmentStrcture[i].label;
						}
					}
					this.departmentListOriginal = result[3].lstManagmentStrcture;;			
					this.headerInfo.departmentId = result[3].managementStructureId;	
					this.headerInfo.managementStructureId = result[3].managementStructureId;				
				} else {
					this.existingMgmentStuc.level4 = '';
					this.headerInfo.departmentId = 0; 
					if(result[3] && result[3].level == 'NEXT') {
						this.departmentListOriginal = result[3].lstManagmentStrcture;						
					}
				}	

				this.managementStructureOnLoad = {
					companyId: result[1].managementStructureId !== undefined ? result[1].managementStructureId : 0,
					buId: result[2].managementStructureId !== undefined ? result[2].managementStructureId : 0,
					divisionId: result[3].managementStructureId !== undefined ? result[3].managementStructureId : 0,
					departmentId: result[4].managementStructureId !== undefined ? result[4].managementStructureId : 0,
				}
				this.isSpinnerVisible = false;
			}
			else
			{
				this.isSpinnerVisible = false;
			}			
		},err => {
			this.isSpinnerVisible = false;
			const errorLog = err;			
		});
	}

	isCompanyEnable(item) {				
		if(this.companyAllow) {
			this.legalEntityList = this.maincompanylist ;
			this.showCompany = true;
			this.showBusiness = true;
			this.showDivision = true;
			this.showDepartment = true;
			this.businessAllow = true;
			this.divisionAllow = true;
			this.deptAllow = true;
			item.checkedItem = true;
			this.disableLevel1 = true;
		} else {
			this.showCompany = false;
			this.showBusiness = false;
			this.showDivision = false;
			this.showDepartment = false;
			this.businessAllow = false;
			this.divisionAllow = false;
			this.deptAllow = false;
			item.checkedItem = false;
			this.disableLevel1 = false;
		}
		this.managementStructure.companyId = 0;
		this.managementStructure.buId = 0;
		this.managementStructure.divisionId = 0;
		this.managementStructure.departmentId = 0;
		this.businessUnitList = [];
		this.divisionList = [];
		this.departmentList = [];
	}

	isBusinessEnable(item) {
		if(this.businessAllow) {
			this.showBusiness = true;
			this.showDivision = true;
			this.showDepartment = true;
			this.divisionAllow = true;
			this.deptAllow = true;
			item.checkedItem = true;
			this.disableLevel2 = true;
		} else {
			this.showBusiness = false;
			this.showDivision = false;
			this.showDepartment = false;
			this.divisionAllow = false;
			this.deptAllow = false;
			item.checkedItem = false;
			this.disableLevel2 = false;
		}
		this.managementStructure.buId = 0;
		this.managementStructure.divisionId = 0;
		this.managementStructure.departmentId = 0;
		this.divisionList = [];
		this.departmentList = [];
		this.businessUnitList = this.bulist;
		
		if(this.companyAllow || this.businessAllow || this.divisionAllow || this.deptAllow) {
			item.checkedItem = true;
		} else {
			item.checkedItem = false;
		}
	}

	isDivisionEnable(item) {
		if(this.divisionAllow) {
			this.showDivision = true;
			this.showDepartment = true;
			this.deptAllow = true;
			item.checkedItem = true;
			this.disableLevel3 = true;
		} else {
			this.showDivision = false;
			this.showDepartment = false;
			this.deptAllow = false;
			item.checkedItem = false;
			this.disableLevel3 = false;
		}
		this.managementStructure.divisionId = 0;
		this.managementStructure.departmentId = 0;
		this.departmentList = [];

		this.divisionList = this.divisionListOriginal;

		if(this.companyAllow || this.businessAllow || this.divisionAllow || this.deptAllow) {
			item.checkedItem = true;
		} else {
			item.checkedItem = false;
		}
	}

	isDeptEnable(item) {
		if(this.deptAllow) {
			this.showDepartment = true;
			item.checkedItem = true;
			this.disableLevel4 = true;
		} else {
			this.showDepartment = false;
			item.checkedItem = false;
			this.disableLevel4 = false;
		}
		this.managementStructure.departmentId = 0;
		this.departmentList =  this.departmentListOriginal;

		if(this.companyAllow || this.businessAllow || this.divisionAllow || this.deptAllow) {
			item.checkedItem = true;
		} else {
			item.checkedItem = false;
		}
	}

	isSiteEnable(item) {		
		if(this.siteAllow) {
			this.loadSiteData();
			this.showSite = true;
			this.showWarehouse = true;
			this.showLocation = true;
			this.showShelf = true;
			this.showBin = true;
			this.warehouseAllow = true;
			this.locationAllow = true;
			this.shelfAllow = true;
			this.binAllow = true;
			item.checkedItem = true;
			this.disableSite = true;
		} else {
			this.showSite = false;
			this.showWarehouse = false;
			this.showLocation = false;
			this.showShelf = false;
			this.showBin = false;
			this.warehouseAllow = false;
			this.locationAllow = false;
			this.shelfAllow = false;
			this.binAllow = false;
			item.checkedItem = false;
			this.disableSite = false;
		}
		item.afterValue = 0;
		this.stocklineAdjustmentData.map(x => {
			if(x.adjustmentDataTypeId == 3 || x.adjustmentDataTypeId == 4 || x.adjustmentDataTypeId == 5 || x.adjustmentDataTypeId == 6) {
				x.afterValue = 0;
				if(this.siteAllow) {
					x.checkedItem = true;
				} else {
					x.checkedItem = false;
				}
			}
		});
		this.allWareHouses = [];
		this.allLocations = [];
		this.allShelfs = [];
		this.allBins = [];
	}

	iswarehouseEnable(item) {
		if(this.warehouseAllow) {
			this.showWarehouse = true;
			this.showLocation = true;
			this.showShelf = true;
			this.showBin = true;
			this.locationAllow = true;
			this.shelfAllow = true;
			this.binAllow = true;
			item.checkedItem = true;
			this.disableWarehouse = true;
		} else {
			this.showWarehouse = false;
			this.showLocation = false;
			this.showShelf = false;
			this.showBin = false;
			this.locationAllow = false;
			this.shelfAllow = false;
			this.binAllow = false;
			item.checkedItem = false;
			this.disableWarehouse = false;
		}
		item.afterValue = 0;
		this.stocklineAdjustmentData.map(x => {
			if(x.adjustmentDataTypeId == 4 || x.adjustmentDataTypeId == 5 || x.adjustmentDataTypeId == 6) {
				x.afterValue = 0;
				if(this.warehouseAllow) {
					x.checkedItem = true;
				} else {
					x.checkedItem = false;
				}
			}
		});
		this.allLocations = [];
		this.allShelfs = [];
		this.allBins = [];
		if(this.sourceStockLineSetup.siteId != 0) {
			this.commonService.smartDropDownList('Warehouse', 'WarehouseId', 'Name',this.authService.currentUser.masterCompanyId, 'SiteId', this.sourceStockLineSetup.siteId, 0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.allWareHouses = res;
			})
		}
	}

	isLocationEnable(item) {
		if(this.locationAllow) {
			this.showLocation = true;
			this.showShelf = true;
			this.showBin = true;
			this.shelfAllow = true;
			this.binAllow = true;
			item.checkedItem = true;
			this.disableLocation = true;
		} else {
			this.showLocation = false;
			this.showShelf = false;
			this.showBin = false;
			this.shelfAllow = false;
			this.binAllow = false;
			item.checkedItem = false;
			this.disableLocation = false;
		}
		item.afterValue = 0;
		this.stocklineAdjustmentData.map(x => {
			if(x.adjustmentDataTypeId == 5 || x.adjustmentDataTypeId == 6) {
				x.afterValue = 0;
				if(this.locationAllow) {
					x.checkedItem = true;
				} else {
					x.checkedItem = false;
				}
			}
		});
		this.allShelfs = [];
		this.allBins = [];
		if(this.sourceStockLineSetup.warehouseId != 0) {
			this.commonService.smartDropDownList('Location', 'LocationId', 'Name',this.authService.currentUser.masterCompanyId, 'WarehouseId', this.sourceStockLineSetup.warehouseId, 0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.allLocations = res;
			})
		}
	}

	isShelfEnable(item) {
		if(this.shelfAllow) {
			this.showShelf = true;
			this.showBin = true;
			this.binAllow = true;
			item.checkedItem = true;
			this.disableShelf = true;
		} else {
			this.showShelf = false;
			this.showBin = false;
			this.binAllow = false;
			item.checkedItem = false;
			this.disableShelf = false;
		}
		item.afterValue = 0;
		this.stocklineAdjustmentData.map(x => {
			if(x.adjustmentDataTypeId == 6) {
				x.afterValue = 0;
				if(this.shelfAllow) {
					x.checkedItem = true;
				} else {
					x.checkedItem = false;
				}
			}
		});

		this.allBins = [];
		if(this.sourceStockLineSetup.locationId != 0) {
			this.commonService.smartDropDownList('Shelf', 'ShelfId', 'Name',this.authService.currentUser.masterCompanyId, 'LocationId', this.sourceStockLineSetup.locationId, 0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.allShelfs = res;
			})
		}
	}

	isBinEnable(item) {
		if(this.binAllow) {
			this.showBin = true;
			item.checkedItem = true;
			this.disableBin = true;
		} else {
			this.showBin = false;
			item.checkedItem = false;
			this.disableBin = false;
		}
		item.binId = 0;
		if(this.sourceStockLineSetup.shelfId != 0) {
			this.commonService.smartDropDownList('Bin', 'BinId', 'Name',this.authService.currentUser.masterCompanyId, 'ShelfId', this.sourceStockLineSetup.shelfId, 0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.allBins = res;
			})
		}
	}	

	selectedLegalEntity(legalEntityId, item) {
		this.businessUnitList = [];
		this.divisionList = [];
		this.departmentList = [];
		this.managementStructure.buId = 0;
		this.managementStructure.divisionId = 0;
		this.managementStructure.departmentId = 0;

        if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
			item.afterValue = legalEntityId;
            this.commonService.getBusinessUnitListByLegalEntityId(legalEntityId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.businessUnitList = res;
			});
		}
		if (legalEntityId != "0" && legalEntityId != 0) {            
			this.disableLevel1 = false;
		} else {
			this.disableLevel1 = true;
		}
	}

	selectedBusinessUnit(businessUnitId, item) {
		this.divisionList = [];
		this.departmentList = [];
		this.managementStructure.divisionId = 0;
		this.managementStructure.departmentId = 0;

        if (businessUnitId != 0 && businessUnitId != null && businessUnitId != undefined) {
			item.afterValue = businessUnitId;
            this.commonService.getDivisionListByBU(businessUnitId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.divisionList = res;
            })
		}
		if (businessUnitId != "0" && businessUnitId != 0) {            
			this.disableLevel2 = false;
		} else {
			this.disableLevel2 = true;
		}
    }
    selectedDivision(divisionUnitId, item) {
		this.departmentList = [];
		this.managementStructure.departmentId = 0;

        if (divisionUnitId != 0 && divisionUnitId != null && divisionUnitId != undefined) {
			item.afterValue = divisionUnitId;
            this.commonService.getDepartmentListByDivisionId(divisionUnitId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.departmentList = res;
            })
		}
		if (divisionUnitId != "0" && divisionUnitId != 0) {            
			this.disableLevel3 = false;
		} else {
			this.disableLevel3 = true;
		}
    }
    selectedDepartment(departmentId, item) {
        if (departmentId != 0 && departmentId != null && departmentId != undefined) {
			item.afterValue = departmentId;
		}
		if (departmentId != "0" && departmentId != 0) {            
			this.disableLevel4 = false;
		} else {
			this.disableLevel4 = true;
		}
	}

	getWareHouseList(siteId) {
		this.allWareHouses = [];
		this.allLocations = [];
		this.allShelfs = [];
		this.allBins = [];
		this.stocklineAdjustmentData.map(x => {
			if(x.adjustmentDataTypeId == 3 || x.adjustmentDataTypeId == 4 || x.adjustmentDataTypeId == 5 || x.adjustmentDataTypeId == 6) {
				x.afterValue = 0;
			}
		});
		
		if(siteId != 0) {
			this.commonService.smartDropDownList('Warehouse', 'WarehouseId', 'Name',this.authService.currentUser.masterCompanyId, 'SiteId', siteId,  0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.allWareHouses = res;
			})
		}

		if (siteId != "0" && siteId != 0) {            
			this.disableSite = false;
		} else {
			this.disableSite = true;
		}
	}

	getLocationList(warehouseId) {
		this.allLocations = [];
		this.allShelfs = [];
		this.allBins = [];
		this.stocklineAdjustmentData.map(x => {
			if(x.adjustmentDataTypeId == 4 || x.adjustmentDataTypeId == 5 || x.adjustmentDataTypeId == 6) {
				x.afterValue = 0;
			}
		});

		if(warehouseId != 0) {
			this.commonService.smartDropDownList('Location', 'LocationId', 'Name',this.authService.currentUser.masterCompanyId, 'WarehouseId', warehouseId,  0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.allLocations = res;
			})
		}

		if (warehouseId != "0" && warehouseId != 0) {            
			this.disableWarehouse = false;
		} else {
			this.disableWarehouse = true;
		}
	}

	getShelfList(locationId) {
		this.allShelfs = [];
		this.allBins = [];
		this.stocklineAdjustmentData.map(x => {
			if(x.adjustmentDataTypeId == 5 || x.adjustmentDataTypeId == 6) {
				x.afterValue = 0;
			}
		});
		
		if(locationId != 0) {
			this.commonService.smartDropDownList('Shelf', 'ShelfId', 'Name' ,this.authService.currentUser.masterCompanyId, 'LocationId', locationId, 0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.allShelfs = res;
			})
		}

		if (locationId != "0" && locationId != 0) {            
			this.disableLocation = false;
		} else {
			this.disableLocation = true;
		}
	}

	getBinList(shelfId) {
		this.allBins = [];
		this.stocklineAdjustmentData.map(x => {
			if(x.adjustmentDataTypeId == 6) {
				x.afterValue = 0;
			}
		});

		if(shelfId != 0) {
			this.commonService.smartDropDownList('Bin', 'BinId', 'Name',this.authService.currentUser.masterCompanyId, 'ShelfId', shelfId,  0).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.allBins = res;
			})
		}

		if (shelfId != "0" && shelfId != 0) {            
			this.disableShelf = false;
		} else {
			this.disableShelf = true;
		}
	}

	onChangeBin(binId) {
		if (binId != "0" && binId != 0) {            
			this.disableBin = false;
		} else {
			this.disableBin = true;
		}
	}

	onChangeCategory(item) {
		item.afterValue = 0;
		if(this.categoryAllow) {
			this.getItemTypes();
			item.checkedItem = true;
			this.disableCategory = true;
			this.partNumberAllow = true;
			this.stocklineAdjustmentData.map(x => {
				if(x.adjustmentDataTypeId == 8) {
					this.onChangePartNum(x);
				}
			});
		} else {
			item.checkedItem = false;
			this.disableCategory = false;
			this.partNumberAllow = false;
			this.stocklineAdjustmentData.map(x => {
				if(x.adjustmentDataTypeId == 8) {
					this.onChangePartNum(x);
				}
			});
		}
	}

	onChangeCategorySelect(value) {
		if (value != "0" && value != 0) {            
			this.disableCategory = false;
		} else {
			this.disableCategory = true;
		}
	}

	onChangeQtyOnHandAdjReason(value) {
		if (value != "0" && value != 0) {            
			this.disableQtyOnHandAdj = false;
		} else {
			this.disableQtyOnHandAdj = true;
		}
	}

	onChangeUnitCostAdjReason(value) {
		if (value != "0" && value != 0) {            
			this.disableUnitCostAdj = false;
		} else {
			this.disableUnitCostAdj = true;
		}
	}

	onChangeSalesPriceAdjReason(value) {
		if (value != "0" && value != 0) {            
			this.disableSalesPriceAdj = false;
		} else {
			this.disableSalesPriceAdj = true;
		}
	}

	onChangelotCostAdjReason(value) {
		if (value != "0" && value != 0) {            
			this.disablelotCostAdj = false;
		} else {
			this.disablelotCostAdj = true;
		}
	}

	filterPartNumbers(event) {
		this.partNumbersCollection = this.allPartnumbersList;
		if (event.query !== undefined && event.query !== null) {
			this.loadPartNumData(event.query);
		}
	}

	onChangePartNum(item) {
		item.afterValue = undefined;	
		if(this.partNumberAllow) {
			this.loadPartNumData();
			item.checkedItem = true;
		} else {
			item.checkedItem = false;
		}
	}

	onChangeSerialNum(item) {
		item.afterValue = '';	
		if(this.serialNumAllow) {
			item.checkedItem = true;
		} else {
			item.checkedItem = false;
		}
	}

	onChangePrices(item) {
		item.afterValue = '';	
		item.adjustmentValue = '';	
	}

	onChangeQtyOnHand(item) {
		if(this.quantityOnHandAllow) {
			item.checkedItem = true;
			this.disableQtyOnHandAdj = true;
		} else {
			item.checkedItem = false;
			this.disableQtyOnHandAdj = false;
		}
	}

	onChangeUnitCost(item) {
		if(this.unitCostAllow) {
			item.checkedItem = true;
			this.disableUnitCostAdj = true;
		} else {
			item.checkedItem = false;
			this.disableUnitCostAdj = false;
		}
	}

	onChangeSalesPrice(item) {
		if(this.unitSalesPriceAllow) {
			item.checkedItem = true;
			this.disableSalesPriceAdj = true;
		} else {
			item.checkedItem = false;
			this.disableSalesPriceAdj = false;
		}
	}

	onChangelotCost(item) {
		if(this.lotCostAllow) {
			item.checkedItem = true;
			this.disablelotCostAdj = true;
		} else {
			item.checkedItem = false;
			this.disablelotCostAdj = false;
		}
	}

	onCheckTimeLife(item) {
		if(this.timeLifeAllow) {
			item.checkedItem = true;
		} else {
			item.checkedItem = false;
		}
	}

	onChangeQtyOnHandAdj(item) {		
		item.adjustmentValue = item.adjustmentValue ? formatNumberAsGlobalSettingsModule(item.adjustmentValue, 0) : '0';
		const beforeValue = this.sourceStockLineSetup.quantityOnHand ? parseFloat(this.sourceStockLineSetup.quantityOnHand.toString().replace(/\,/g,'')) : 0;
		let adjValue = item.adjustmentValue ? parseFloat(item.adjustmentValue.toString().replace(/\,/g,'')) : 0;		
		const afterValue = beforeValue + adjValue;
		if(afterValue < 0) {
			item.adjustmentValue = 0;
			item.afterValue = 0;
			this.alertService.showMessage(
				'Error',
				`New value can't be in negative`,
				MessageSeverity.error)
		} else {
			item.afterValue = formatNumberAsGlobalSettingsModule(afterValue, 0);
		}
	}

	onChangeUnitCostAdj(item) {
		item.adjustmentValue = item.adjustmentValue ? formatNumberAsGlobalSettingsModule(item.adjustmentValue, 2) : '0.00';
		const beforeValue = this.sourceStockLineSetup.unitCost ? parseFloat(this.sourceStockLineSetup.unitCost.toString().replace(/\,/g,'')) : 0;
		const adjValue = item.adjustmentValue ? parseFloat(item.adjustmentValue.toString().replace(/\,/g,'')) : 0;
		const afterValue = beforeValue + adjValue;
		if(afterValue < 0) {
			item.adjustmentValue = '0.00';
			item.afterValue = '0.00';
			this.alertService.showMessage(
				'Error',
				`New value can't be in negative`,
				MessageSeverity.error)
		} else {
			item.afterValue = formatNumberAsGlobalSettingsModule(afterValue, 2);
		}
	}

	onChangeUnitSalesPriceAdj(item) {
		item.afterValue = item.afterValue ? formatNumberAsGlobalSettingsModule(item.afterValue, 2) : '0.00';
	}

	onChangeLotCostAdj(item) {
		item.adjustmentValue = item.adjustmentValue ? formatNumberAsGlobalSettingsModule(item.adjustmentValue, 2) : '0.00';
		const beforeValue = this.sourceStockLineSetup.lotCost ? parseFloat(this.sourceStockLineSetup.lotCost.toString().replace(/\,/g,'')) : 0;
		const adjValue = item.adjustmentValue ? parseFloat(item.adjustmentValue.toString().replace(/\,/g,'')) : 0;
		const afterValue = beforeValue + adjValue;
		if(afterValue < 0) {
			item.adjustmentValue = '0.00';
			item.afterValue = '0.00';
			this.alertService.showMessage(
				'Error',
				`New value can't be in negative`,
				MessageSeverity.error)
		} else {
			item.afterValue = formatNumberAsGlobalSettingsModule(afterValue, 2);
		}
	}


	onSaveStockLineAdj() {		
		const timeLife = this.getTimeLife(this.sourceTimeLife);
		this.tempStockData = [];
		this.stocklineAdjustmentData.map(x => {
			if(x.adjustmentDataTypeId == 8) {
				x.afterValue = x.afterValue ? getValueFromObjectByKey('value', x.afterValue) : null;
			}
			if(x.adjustmentDataTypeId == 10 || x.adjustmentDataTypeId == 11 || x.adjustmentDataTypeId == 12 || x.adjustmentDataTypeId == 13) {
				x.afterValue = x.afterValue ? parseFloat(x.afterValue.toString().replace(/\,/g,'')) : 0;
				x.adjustmentReason = x.adjustmentReasonId ? getValueFromArrayOfObjectById('label', 'value', x.adjustmentReasonId, this.allAdjReasonInfo) : '';
			}
			if(x.adjustmentDataTypeId == 14) {
				x.afterValue = this.timeLifeCyclesId ? this.timeLifeCyclesId : null;
				x.beforeValue = this.timeLifeCyclesId ? this.timeLifeCyclesId : null;
				x.timeLifes = {...timeLife, timeLifeCyclesId: this.timeLifeCyclesId, updatedDate: new Date()}
			}
			if(x.checkedItem) {
				const data = {
					...x,
					stockLineId: this.stockLineId,
					masterCompanyId: this.currentUserMasterCompanyId,
					createdBy: this.userName
				}
				this.tempStockData.push(data);
			}
		});
		this.stockLineService.newStockLineAdjustment(this.tempStockData).subscribe(res => {
			this.alertService.showMessage(
				'Success',
				`Saved Stockline Adjustment Sucessfully `,
				MessageSeverity.success)
			this.router.navigateByUrl('/stocklinemodule/stocklinepages/app-stock-line-list');
		});
	}

	getTimeLifeDetails(x) {		
		let timeLife: TimeLifeDraftData = new TimeLifeDraftData();                      
		timeLife.timeLifeCyclesId = x.timeLifeCyclesId;
        timeLife.cyclesRemainingHrs = x.cyclesRemaining ? x.cyclesRemaining.split(':')[0] : null;
		timeLife.cyclesRemainingMin = x.cyclesRemaining ? x.cyclesRemaining.split(':')[1] : null;				
        timeLife.cyclesSinceInspectionHrs = x.cyclesSinceInspection ? x.cyclesSinceInspection.split(':')[0] : null;
		timeLife.cyclesSinceInspectionMin = x.cyclesSinceInspection ? x.cyclesSinceInspection.split(':')[1] : null;				
        timeLife.cyclesSinceNewHrs = x.cyclesSinceNew ? x.cyclesSinceNew.split(':')[0] : null;
		timeLife.cyclesSinceNewMin = x.cyclesSinceNew ? x.cyclesSinceNew.split(':')[1] : null;				
        timeLife.cyclesSinceOVHHrs = x.cyclesSinceOVH ? x.cyclesSinceOVH.split(':')[0] : null;
		timeLife.cyclesSinceOVHMin = x.cyclesSinceOVH ? x.cyclesSinceOVH.split(':')[1] : null;				
        timeLife.cyclesSinceRepairHrs = x.cyclesSinceRepair ? x.cyclesSinceRepair.split(':')[0] : null;
		timeLife.cyclesSinceRepairMin = x.cyclesSinceRepair ? x.cyclesSinceRepair.split(':')[1] : null;			
        timeLife.timeRemainingHrs = x.timeRemaining ? x.timeRemaining.split(':')[0] : null;
		timeLife.timeRemainingMin = x.timeRemaining ? x.timeRemaining.split(':')[1] : null;
        timeLife.timeSinceInspectionHrs = x.timeSinceInspection ? x.timeSinceInspection.split(':')[0] : null;
		timeLife.timeSinceInspectionMin = x.timeSinceInspection ? x.timeSinceInspection.split(':')[1] : null;				
        timeLife.timeSinceNewHrs = x.timeSinceNew ? x.timeSinceNew.split(':')[0] : null;
		timeLife.timeSinceNewMin = x.timeSinceNew ? x.timeSinceNew.split(':')[1] : null;				
        timeLife.timeSinceOVHHrs = x.timeSinceOVH ? x.timeSinceOVH.split(':')[0] : null;
		timeLife.timeSinceOVHMin = x.timeSinceOVH ? x.timeSinceOVH.split(':')[1] : null;				
        timeLife.timeSinceRepairHrs = x.timeSinceRepair ? x.timeSinceRepair.split(':')[0] : null;
		timeLife.timeSinceRepairMin = x.timeSinceRepair ? x.timeSinceRepair.split(':')[1] : null;	
        timeLife.lastSinceInspectionHrs = x.lastSinceInspection ? x.lastSinceInspection.split(':')[0] : null;
		timeLife.lastSinceInspectionMin = x.lastSinceInspection ? x.lastSinceInspection.split(':')[1] : null;				
        timeLife.lastSinceNewHrs = x.lastSinceNew ? x.lastSinceNew.split(':')[0] : null;
		timeLife.lastSinceNewMin = x.lastSinceNew ? x.lastSinceNew.split(':')[1] : null;				
        timeLife.lastSinceOVHHrs = x.lastSinceOVH ? x.lastSinceOVH.split(':')[0] : null;
        timeLife.lastSinceOVHMin = x.lastSinceOVH ? x.lastSinceOVH.split(':')[1] : null;           
        return timeLife;
	}

	getTimeLife(x) {
		let timeLife: TimeLifeDraftData = new TimeLifeDraftData(); 
		timeLife.timeLifeCyclesId = this.timeLifeCyclesId > 0 ? this.timeLifeCyclesId : null;   
		timeLife.cyclesRemaining = ((x.cyclesRemainingHrs ? x.cyclesRemainingHrs : '00') + ':' + (x.cyclesRemainingMin ? x.cyclesRemainingMin : '00'));
		timeLife.timeRemaining = ((x.timeRemainingHrs ? x.timeRemainingHrs : '00') + ':' + (x.timeRemainingMin ? x.timeRemainingMin : '00'));
		timeLife.cyclesSinceNew = ((x.cyclesSinceNewHrs ? x.cyclesSinceNewHrs : '00') + ':' + (x.cyclesSinceNewMin ? x.cyclesSinceNewMin : '00'));
		timeLife.timeSinceNew = ((x.timeSinceNewHrs ? x.timeSinceNewHrs : '00') + ':' + (x.timeSinceNewMin ? x.timeSinceNewMin : '00'));
		timeLife.lastSinceNew = ((x.lastSinceNewHrs ? x.lastSinceNewHrs : '00') + ':' + (x.lastSinceNewMin ? x.lastSinceNewMin : '00'));
		timeLife.cyclesSinceOVH = ((x.cyclesSinceOVHHrs ? x.cyclesSinceOVHHrs : '00') + ':' + (x.cyclesSinceOVHMin ? x.cyclesSinceOVHMin : '00'));
		timeLife.timeSinceOVH = ((x.timeSinceOVHHrs ? x.timeSinceOVHHrs : '00') + ':' + (x.timeSinceOVHMin ? x.timeSinceOVHMin : '00'));
		timeLife.lastSinceOVH = ((x.lastSinceOVHHrs ? x.lastSinceOVHHrs : '00') + ':' + (x.lastSinceOVHMin ? x.lastSinceOVHMin : '00'));
		timeLife.cyclesSinceInspection = ((x.cyclesSinceInspectionHrs ? x.cyclesSinceInspectionHrs : '00') + ':' + (x.cyclesSinceInspectionMin ? x.cyclesSinceInspectionMin : '00'));
		timeLife.timeSinceInspection = ((x.timeSinceInspectionHrs ? x.timeSinceInspectionHrs : '00') + ':' + (x.timeSinceInspectionMin ? x.timeSinceInspectionMin : '00'));
		timeLife.lastSinceInspection = ((x.lastSinceInspectionHrs ? x.lastSinceInspectionHrs : '00') + ':' + (x.lastSinceInspectionMin ? x.lastSinceInspectionMin : '00'));
		timeLife.cyclesSinceRepair = ((x.cyclesSinceRepairHrs ? x.cyclesSinceRepairHrs : '00') + ':' + (x.cyclesSinceRepairMin ? x.cyclesSinceRepairMin : '00'));
		timeLife.timeSinceRepair = ((x.timeSinceRepairHrs ? x.timeSinceRepairHrs : '00') + ':' + (x.timeSinceRepairMin ? x.timeSinceRepairMin : '00'));				
        return timeLife;
	}

	onChangeTimeLifeMin(name,value) {  	
        if (value > 59) {           
			this.alertService.showMessage('Error','Minutes can\'t be greater than 59', MessageSeverity.error);
			this.timeLifeMinNames(name);
        }       
	}
	
	timeLifeMinNames(name){
		if(name == 'cyclesRemainingMin'){
			this.sourceTimeLife.cyclesRemainingMin = '00';
		}
		else if (name == 'timeRemainingMin'){
			this.sourceTimeLife.timeRemainingMin = '00';
		}
		else if (name == 'lastSinceNewMin'){
			this.sourceTimeLife.lastSinceNewMin = '00';
		}
		else if (name == 'cyclesSinceNewMin'){
			this.sourceTimeLife.cyclesSinceNewMin = '00';
		}
		else if (name == 'timeSinceNewMin'){
			this.sourceTimeLife.timeSinceNewMin = '00';
		}
		else if (name == 'lastSinceOVHMin'){
			this.sourceTimeLife.lastSinceOVHMin = '00';
		}
		else if (name == 'cyclesSinceOVHMin'){
			this.sourceTimeLife.cyclesSinceOVHMin = '00';
		}
		else if (name == 'timeSinceOVHMin'){
			this.sourceTimeLife.timeSinceOVHMin = '00';
		}
		else if (name == 'lastSinceInspectionMin'){
			this.sourceTimeLife.lastSinceInspectionMin = '00';
		}
		else if (name == 'cyclesSinceInspectionMin'){
			this.sourceTimeLife.cyclesSinceInspectionMin = '00';
		}
		else if (name == 'timeSinceInspectionMin'){
			this.sourceTimeLife.timeSinceInspectionMin = '00';
		}
		else if (name == 'cyclesSinceRepairMin'){
			this.sourceTimeLife.cyclesSinceRepairMin = '00';
		}
		else if (name == 'timeSinceRepairMin'){
			this.sourceTimeLife.timeSinceRepairMin = '00';
		}
	}
}

