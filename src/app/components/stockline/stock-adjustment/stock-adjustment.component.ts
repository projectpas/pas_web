import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { StocklineService } from '../../../services/stockline.service';
import { Site } from '../../../models/site.model';
import { CommonService } from '../../../services/common.service';
import { Subject } from 'rxjs'
import * as $ from 'jquery'
import { takeUntil } from 'rxjs/operators';
import { formatNumberAsGlobalSettingsModule, getValueFromObjectByKey, getValueFromArrayOfObjectById } from '../../../generic/autocomplete';
import { DatePipe } from '@angular/common';
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
    divisionList: any;
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
        this.commonService.getDefaultCurrency(this.legalEntityId).subscribe(res => {
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
		this.commonService.smartDropDownList('Site', 'SiteId', 'Name').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.allSites = res;
        })
	}

	getItemTypes() {
		this.commonService.smartDropDownList('ItemType', 'ItemTypeId', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.itemTypesList = res;
        })
	}

	// onAddTextAreaInfo(value) {
	// 	if(value == 'memo') {			
	// 		this.textAreaLabel = 'Memo';
	// 		this.textAreaInfo = this.stockLineForm.memo;
	// 	}
	// }

	onClickMemo(value,row_no, obj) {
		//if(value == 'memo') {
			//this.textAreaLabel = 'Memo';
            this.memoPopupContent = obj;
            this.addrawNo = row_no;
		//}
    }

	onClickMemoOld() {
        this.memoPopupContent = this.stocklineAdjustmentData.adjustmentMemo;
        // this.enableSave();
        //this.memoPopupValue = value;
	}   

	// onSaveTextAreaInfo() {
	// 	if(this.textAreaLabel == 'Memo') {
    //         this.fieldArray[this.addrawNo].memo = this.textAreaInfo;
    //     }
    //     $('#capes-memo').modal('hide');
    // }

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
		this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'partnumber', strText, true, 20, this.arrayItemMasterlist.join()).subscribe(response => {
			this.allPartnumbersList = response;
			this.partNumbersCollection = this.allPartnumbersList;
		}, error => this.saveFailedHelper(error));
	}
 
	getCurrencyData() {
		this.commonService.smartDropDownList('Currency', 'CurrencyId', 'Code').subscribe(response => {
			this.allCurrencyInfo = response;
		});
	}

	getAdjReasonData() {
		this.commonService.smartDropDownList('StocklineAdjustmentReason', 'AdjustmentReasonId', 'Description').subscribe(response => {
			this.allAdjReasonInfo = response;
		});
	}	

	getStocklineAdjustmentDataType() {
		this.commonService.smartDropDownList('StocklineAdjustmentDataType', 'StocklineAdjustmentDataTypeId', 'Description').pipe(takeUntil(this.onDestroy$)).subscribe(res => {
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
					x.beforeValue = this.sourceStockLineSetup.coreUnitCost ? this.sourceStockLineSetup.coreUnitCost : 0;
					this.sourceStockLineSetup.coreUnitCost = this.sourceStockLineSetup.coreUnitCost ? formatNumberAsGlobalSettingsModule(this.sourceStockLineSetup.coreUnitCost, 2) : '0.00';
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
				this.sourceTimeLife = this.sourceStockLineSetup.timelIfeData;
			}
		});
	}

	getManagementStructureCodes(id) {
        this.commonService.getManagementStructureNameandCodes(id).subscribe(res => {
			if (res.Level1) {
				this.existingMgmentStuc.level1 = res.Level1;
            } else {
                this.existingMgmentStuc.level1 = '';
            }
            if (res.Level2) {
				this.existingMgmentStuc.level2 = res.Level2;
            } else {
                this.existingMgmentStuc.level2 = '';
            }
            if (res.Level3) {
				this.existingMgmentStuc.level3 = res.Level3;
            } else {
                this.existingMgmentStuc.level3 = '';
            }
            if (res.Level4) {
				this.existingMgmentStuc.level4 = res.Level4;
			} else {
                this.existingMgmentStuc.level4 = '';
			}
			
			this.managementStructureOnLoad = {
                companyId: res.Level1 !== undefined ? res.Level1 : 0,
                buId: res.Level2 !== undefined ? res.Level2 : 0,
                divisionId: res.Level3 !== undefined ? res.Level3 : 0,
                departmentId: res.Level4 !== undefined ? res.Level4 : 0,
			}
		})
	}

	// getTimeLife(timeLifeId) {
	// 	this.sourceTimeLife = {};
    //     this.stockLineService.getStockLineTimeLifeList(timeLifeId).subscribe(res => {
	// 		this.sourceTimeLife = res[0];
    //     });
    // }

	isCompanyEnable(item) {		
		if(this.companyAllow) {
			this.getLegalEntity();
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
		if(this.managementStructureOnLoad.companyId) {
			this.commonService.getBusinessUnitListByLegalEntityId(this.managementStructureOnLoad.companyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.businessUnitList = res;
			});
		}
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
		if(this.managementStructureOnLoad.buId) {
			this.commonService.getDivisionListByBU(this.managementStructureOnLoad.buId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.divisionList = res;
            })
		}
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
		if(this.managementStructureOnLoad.divisionId) {
			this.commonService.getDepartmentListByDivisionId(this.managementStructureOnLoad.divisionId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
				this.departmentList = res;
			})
		}
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
			this.commonService.smartDropDownList('Warehouse', 'WarehouseId', 'Name', 'SiteId', this.sourceStockLineSetup.siteId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
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
			this.commonService.smartDropDownList('Location', 'LocationId', 'Name', 'WarehouseId', this.sourceStockLineSetup.warehouseId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
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
			this.commonService.smartDropDownList('Shelf', 'ShelfId', 'Name', 'LocationId', this.sourceStockLineSetup.locationId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
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
			this.commonService.smartDropDownList('Bin', 'BinId', 'Name', 'ShelfId', this.sourceStockLineSetup.shelfId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
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
			this.commonService.smartDropDownList('Warehouse', 'WarehouseId', 'Name', 'SiteId', siteId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
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
			this.commonService.smartDropDownList('Location', 'LocationId', 'Name', 'WarehouseId', warehouseId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
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
			this.commonService.smartDropDownList('Shelf', 'ShelfId', 'Name', 'LocationId', locationId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
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
			this.commonService.smartDropDownList('Bin', 'BinId', 'Name', 'ShelfId', shelfId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
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
		const beforeValue = this.sourceStockLineSetup.coreUnitCost ? parseFloat(this.sourceStockLineSetup.coreUnitCost.toString().replace(/\,/g,'')) : 0;
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
		const timeLife = {
			timeLifeCyclesId : this.timeLifeCyclesId > 0 ? this.timeLifeCyclesId : null,
			cyclesRemaining: typeof(this.sourceTimeLife.cyclesRemaining) == 'string' ? this.sourceTimeLife.cyclesRemaining : this.sourceTimeLife.cyclesRemaining ? this.datePipe.transform(this.sourceTimeLife.cyclesRemaining, "HH:mm") : null,
			timeRemaining: typeof(this.sourceTimeLife.timeRemaining) == 'string' ? this.sourceTimeLife.timeRemaining : this.sourceTimeLife.timeRemaining ? this.datePipe.transform(this.sourceTimeLife.timeRemaining, "HH:mm") : null,
			cyclesSinceNew: typeof(this.sourceTimeLife.cyclesSinceNew) == 'string' ? this.sourceTimeLife.cyclesSinceNew : this.sourceTimeLife.cyclesSinceNew ? this.datePipe.transform(this.sourceTimeLife.cyclesSinceNew, "HH:mm") : null,
			timeSinceNew: typeof(this.sourceTimeLife.timeSinceNew) == 'string' ? this.sourceTimeLife.timeSinceNew : this.sourceTimeLife.timeSinceNew ? this.datePipe.transform(this.sourceTimeLife.timeSinceNew, "HH:mm") : null,
			lastSinceNew: typeof(this.sourceTimeLife.lastSinceNew) == 'string' ? this.sourceTimeLife.lastSinceNew : this.sourceTimeLife.lastSinceNew ? this.datePipe.transform(this.sourceTimeLife.lastSinceNew, "HH:mm") : null,
			cyclesSinceOVH: typeof(this.sourceTimeLife.cyclesSinceOVH) == 'string' ? this.sourceTimeLife.cyclesSinceOVH : this.sourceTimeLife.cyclesSinceOVH ? this.datePipe.transform(this.sourceTimeLife.cyclesSinceOVH, "HH:mm") : null,
			timeSinceOVH: typeof(this.sourceTimeLife.timeSinceOVH) == 'string' ? this.sourceTimeLife.timeSinceOVH : this.sourceTimeLife.timeSinceOVH ? this.datePipe.transform(this.sourceTimeLife.timeSinceOVH, "HH:mm") : null,
			lastSinceOVH: typeof(this.sourceTimeLife.lastSinceOVH) == 'string' ? this.sourceTimeLife.lastSinceOVH : this.sourceTimeLife.lastSinceOVH ? this.datePipe.transform(this.sourceTimeLife.lastSinceOVH, "HH:mm") : null,
			cyclesSinceInspection: typeof(this.sourceTimeLife.cyclesSinceInspection) == 'string' ? this.sourceTimeLife.cyclesSinceInspection : this.sourceTimeLife.cyclesSinceInspection ? this.datePipe.transform(this.sourceTimeLife.cyclesSinceInspection, "HH:mm") : null,
			timeSinceInspection: typeof(this.sourceTimeLife.timeSinceInspection) == 'string' ? this.sourceTimeLife.timeSinceInspection : this.sourceTimeLife.timeSinceInspection ? this.datePipe.transform(this.sourceTimeLife.timeSinceInspection, "HH:mm") : null,
			lastSinceInspection: typeof(this.sourceTimeLife.lastSinceInspection) == 'string' ? this.sourceTimeLife.lastSinceInspection : this.sourceTimeLife.lastSinceInspection ? this.datePipe.transform(this.sourceTimeLife.lastSinceInspection, "HH:mm") : null,
			cyclesSinceRepair: typeof(this.sourceTimeLife.cyclesSinceRepair) == 'string' ? this.sourceTimeLife.cyclesSinceRepair : this.sourceTimeLife.cyclesSinceRepair ? this.datePipe.transform(this.sourceTimeLife.cyclesSinceRepair, "HH:mm") : null,
			timeSinceRepair: typeof(this.sourceTimeLife.timeSinceRepair) == 'string' ? this.sourceTimeLife.timeSinceRepair : this.sourceTimeLife.timeSinceRepair ? this.datePipe.transform(this.sourceTimeLife.timeSinceRepair, "HH:mm") : null,
		}
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
}

