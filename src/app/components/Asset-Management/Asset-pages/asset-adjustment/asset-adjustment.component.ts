import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../../../services/asset/Assetservice';
import { AuthService } from '../../../../services/auth.service';
//import { AlertService } from '../../../../services/alert.service';
import { GlAccount } from '../../../../models/GlAccount.model';
import { GlAccountService } from '../../../../services/glAccount/glAccount.service';
import { VendorService } from '../../../../services/vendor.service';
import { Vendor } from '../../../../models/vendor.model';
import { AlertService, DialogType, MessageSeverity } from '../../../../services/alert.service';
//import { Router } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, NgForm } from '@angular/forms';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { CommonService } from '../../../../services/common.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AssetLocationService } from '../../../../services/asset-location/asset-location.service';
import { getValueFromArrayOfObjectById, getValueFromObjectByKey, formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';

@Component({
    selector: 'app-asset-adjustment',
    templateUrl: './asset-adjustment.component.html',
    styleUrls: ['./asset-adjustment.component.scss']
})
/** asset-maintenance-warranty component*/
export class AssetAdjustmentComponent implements OnInit {

    assetInventoryId: number;
    private onDestroy$: Subject<void> = new Subject<void>();
    assetAdjustmentSetup: any = {};
    assetAdjustmentData: any = [];
    allAdjReasonInfo: any = [];
    allAssetList: any = [];
    assetListFilter: any = [];
    allLocationList: any = [];
    tempAssetData: any = [];
    isSpinnerVisible: boolean = true;
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
    companyAllow: boolean = false;
	businessAllow: boolean = false;
	divisionAllow: boolean = false;
	deptAllow: boolean = false;
	showCompany: boolean = false;
	showBusiness: boolean = false;
	showDivision: boolean = false;
    showDepartment: boolean = false;
    disableLevel1: boolean = false;
	disableLevel2: boolean = false;
	disableLevel3: boolean = false;
	disableLevel4: boolean = false;
    disableMgmtStrucAdj: boolean = false;
    usefulLifeAllow: boolean = false;
    disableUsefulLifeAdj: boolean = false;
    assetIdAllow: boolean = false;
    disableAssetIdAdj: boolean = false;
    locationAllow: boolean = false;
    disableLocationAdj: boolean = false;
    disableLocation: boolean = false;

    constructor(private commonService: CommonService, private _actRoute: ActivatedRoute, private assetService: AssetService, private assetLocationService: AssetLocationService, private authService: AuthService, private alertService: AlertService, private router: Router) {}
    
    ngOnInit() {
        this.getAssetAdjustmentDataType();
        this.getAdjReasonData();

        this.assetInventoryId = this._actRoute.snapshot.params['id'];
		if(this.assetInventoryId) {
			this.getAssetAdjDetailsById(this.assetInventoryId);
		}
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
    
    getAssetList() {
        this.commonService.smartDropDownList('Asset', 'AssetRecordId', 'AssetId','','',0,this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.allAssetList = res;
        })
    }

    getLocationList() {
        this.assetLocationService.getAssetLocationsList().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.allLocationList = res;
        })
    }

    getAdjReasonData() {
		this.commonService.smartDropDownList('StocklineAdjustmentReason', 'AdjustmentReasonId', 'Description','','',0,this.authService.currentUser.masterCompanyId).subscribe(response => {
			this.allAdjReasonInfo = response;
		});
	}	

    getAssetAdjustmentDataType() {
		this.commonService.smartDropDownList('AssetInventoryAdjustmentDataType', 'AssetInventoryAdjustmentDataTypeId', 'Description','','',0,this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.assetAdjustmentData = res.map(x => {
				return {
					adjustmentDataTypeId: x.value,
					assetInventoryAdjustmentDataType: x.label
				}
			});
			this.assetAdjustmentData = this.assetAdjustmentData.sort((a,b) => (a.adjustmentDataTypeId > b.adjustmentDataTypeId) ? 1 : ((b.adjustmentDataTypeId > a.adjustmentDataTypeId) ? -1 : 0));
			
			this.assetAdjustmentData.map(x => {
                x.adjustmentReasonId = 0;
                this.isSpinnerVisible = false;
				// if(x.adjustmentDataTypeId == 2 || x.adjustmentDataTypeId == 3 || x.adjustmentDataTypeId == 4 || x.adjustmentDataTypeId == 5 || x.adjustmentDataTypeId == 6 || x.adjustmentDataTypeId == 7) {
				// 	x.afterValue = 0;
				// }
				// if(x.adjustmentDataTypeId == 10 || x.adjustmentDataTypeId == 11 || x.adjustmentDataTypeId == 12 || x.adjustmentDataTypeId == 13) {
				// 	x.adjustmentReasonId = 0;
				// }
			});
        })
    }
    
    getAssetAdjDetailsById(id) {
        this.assetService.getAdjustmentByAssetInventoryId(id).subscribe(res => {
			console.log(res);
			this.assetAdjustmentSetup = {
                ...res,
                unitCost: res.unitCost ? formatNumberAsGlobalSettingsModule(res.unitCost, 2) : ''
            };
			this.assetAdjustmentData.map(x => {
				if(x.adjustmentDataTypeId == 1) {
					x.beforeValue = this.assetAdjustmentSetup.managementStructureId;					
				}
				if(x.adjustmentDataTypeId == 3) {
					x.beforeValue = this.assetAdjustmentSetup.assetLife ? this.assetAdjustmentSetup.assetLife : null;
				}
				if(x.adjustmentDataTypeId == 4) {
					x.beforeValue = this.assetAdjustmentSetup.assetRecordId ? this.assetAdjustmentSetup.assetRecordId : null;
				}
				if(x.adjustmentDataTypeId == 5) {
					x.beforeValue = this.assetAdjustmentSetup.asset_Location ? this.assetAdjustmentSetup.asset_Location : null;
                }
			});
			this.getManagementStructureCodes(this.assetAdjustmentSetup.managementStructureId);
		});
    }

    getManagementStructureCodes(id) {
        this.commonService.getManagementStructureNamesAndCodes(id).subscribe(res => {
			if (res.Level1Code) {
				this.existingMgmentStuc.level1 = res.Level1Code;
            } else {
                this.existingMgmentStuc.level1 = '';
            }
            if (res.Level2Code) {
				this.existingMgmentStuc.level2 = res.Level2Code;
            } else {
                this.existingMgmentStuc.level2 = '';
            }
            if (res.Level3Code) {
				this.existingMgmentStuc.level3 = res.Level3Code;
            } else {
                this.existingMgmentStuc.level3 = '';
            }
            if (res.Level4Code) {
				this.existingMgmentStuc.level4 = res.Level4Code;
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
            this.disableMgmtStrucAdj = true;
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
            this.disableMgmtStrucAdj = false;
		}
		this.managementStructure.companyId = 0;
		this.managementStructure.buId = 0;
		this.managementStructure.divisionId = 0;
		this.managementStructure.departmentId = 0;
		this.businessUnitList = [];
		this.divisionList = [];
        this.departmentList = [];
        item.adjustmentReasonId = 0;
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
            this.disableMgmtStrucAdj = true;
		} else {
            item.checkedItem = false;
            this.disableMgmtStrucAdj = false;
        }
        item.adjustmentReasonId = 0;
	}

	isDivisionEnable(item) {
		if(this.divisionAllow) {
			this.showDivision = true;
			this.showDepartment = true;
			this.deptAllow = true;
			item.checkedItem = true;
			this.disableLevel3 = true;
			// this.disableLevel4 = true;
		} else {
			this.showDivision = false;
			this.showDepartment = false;
			this.deptAllow = false;
			item.checkedItem = false;
			this.disableLevel3 = false;
			// this.disableLevel4 = false;
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
            this.disableMgmtStrucAdj = true;
		} else {
            item.checkedItem = false;
            this.disableMgmtStrucAdj = false;
        }
        item.adjustmentReasonId = 0;
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
            this.disableMgmtStrucAdj = true;
		} else {
            item.checkedItem = false;
            this.disableMgmtStrucAdj = false;
        }
        item.adjustmentReasonId = 0;
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
    onChangeMgmtStrucAdjReason(value) {
        if (value != "0" && value != 0) {            
			this.disableMgmtStrucAdj = false;
		} else {
			this.disableMgmtStrucAdj = true;
		}
    }

    onChangeUsefulLife(item) {
        item.afterValue = '';	
		if(this.usefulLifeAllow) {
            item.checkedItem = true;
            this.disableUsefulLifeAdj = true;
		} else {
            item.checkedItem = false;
            this.disableUsefulLifeAdj = false;
		}
    }

    onChangeUsefulLifeAdjReason(value) {
		if (value != "0" && value != 0) {            
			this.disableUsefulLifeAdj = false;
		} else {
			this.disableUsefulLifeAdj = true;
		}
    }

    filterAssetList(event) {
		this.assetListFilter = this.allAssetList;
		if (event.query !== undefined && event.query !== null) {
			const assetFilter = [...this.allAssetList.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.assetListFilter = assetFilter;
		}
	}

    onChangeAssetId(item) {
		item.afterValue = '';	
		if(this.assetIdAllow) {
            this.getAssetList();
            item.checkedItem = true;
            this.disableAssetIdAdj = true;
		} else {
            item.checkedItem = false;
            this.disableAssetIdAdj = false;
		}
    }
    
    onChangeAssetIdAdjReason(value) {
		if (value != "0" && value != 0) {            
			this.disableAssetIdAdj = false;
		} else {
			this.disableAssetIdAdj = true;
		}
    }
    
    onChangeLocation(item) {
        item.afterValue = 0;	
		if(this.locationAllow) {
            this.getLocationList();
            item.checkedItem = true;
            this.disableLocationAdj = true;
            this.disableLocation = true;
		} else {
            item.checkedItem = false;
            this.disableLocationAdj = false;
            this.disableLocation = false;
		}
    }

    onChangeLocationSelect(value) {
		if (value != "0" && value != 0) {            
			this.disableLocation = false;
		} else {
			this.disableLocation = true;
		}
	}

    onChangeLocationAdjReason(value) {
		if (value != "0" && value != 0) {            
			this.disableLocationAdj = false;
		} else {
			this.disableLocationAdj = true;
		}
    }
    
    onSaveAssetAdj() {
        console.log(this.assetAdjustmentData);
		this.tempAssetData = [];
		this.assetAdjustmentData.map(x => {
			if(x.adjustmentDataTypeId == 4) {
				x.afterValue = x.afterValue ? getValueFromObjectByKey('value', x.afterValue) : null;
			}
			if(x.adjustmentDataTypeId) {
				x.adjustmentReason = x.adjustmentReasonId ? getValueFromArrayOfObjectById('label', 'value', x.adjustmentReasonId, this.allAdjReasonInfo) : '';
			}
			if(x.checkedItem) {
				const data = {
					...x,
					assetInventoryId: this.assetInventoryId,
					masterCompanyId: this.currentUserMasterCompanyId,
					createdBy: this.userName
				}
			this.tempAssetData.push(data);
			}
		});
		this.assetService.assetAdjustmentPost(this.tempAssetData).subscribe(res => {
			console.log(res);
			this.alertService.showMessage(
				'Success',
				`Saved Asset Adjustment Sucessfully `,
				MessageSeverity.success)
			this.router.navigateByUrl('/assetmodule/assetpages/app-asset-inventory-listing');
		});
    }
}
   

//     currentAsset: any = {};
//     localCollection: any[];
//     activeIndex: number;
//     showLable: boolean;
//     local: any;
//     loadingIndicator: boolean;
//     AssetId: any;
//     static assetService;
//     cols:any[]=[];
//     data:any[]=[];
//     maincompanylist: any[] = [];
//     bulist: any[];
//     allManagemtninfo: any[] = [];
//     departmentList: any[] = [];
//     divisionlist: any[] = [];
//     managementStructureData: any = [];
//     updateMode: boolean = false;
//     allAssetInfo: any[] = [];
//     allAssets: any[] = [];
//     disableSave: boolean;
//     onSelectedId: any;
//     formData = new FormData();

//     constructor(private router: ActivatedRoute,private assetService: AssetService, private vendorService: VendorService, private route: Router,
//         private authService: AuthService, private alertService: AlertService, private legalEntityServices: LegalEntityService) {
//         this.AssetId = this.router.snapshot.params['id'];
//         this.activeIndex = 3;
//         if (this.assetService.listCollection == undefined) {
//             this.GetAssetData(this.AssetId);
//         }
//         if (this.assetService.listCollection) {
//             this.local = this.assetService.listCollection;
//             this.currentAsset = this.local;
//         }
//     }
//     ngOnInit(): void {
//         this.loadData();
//         this.AssetId = this.router.snapshot.params['id'];
//         if (this.assetService.listCollection == undefined) {
//             this.GetAssetData(this.AssetId);
//         }
//         this.getAssetsList();
//         this.loadManagementdata();

//     }
   
//     private loadData() {



//         this.cols = [
//             { field: 'fieldName', header: 'Field Name',width:'100px' },
//             { field: 'existingValue', header: 'Existing Value',width:'100px' },
//             { field: 'changeValueTo', header: 'Change Value To',width:'100px' },
//             { field: 'adjustmentReason', header: 'Adjustment Reason',width:'100px' },
//             { field: 'documents', header: 'Documents',width:'100px' },
           
//         ];

//         this.data = [
//             { field: 'company',selected:false, fieldName: 'company',existingValue:'0',changeValueTo:'',adjustmentReason:'',documents:'' },
//             { field: 'bu',selected:false, fieldName: 'BU',existingValue:'0',changeValueTo:'',adjustmentReason:'',documents:'' },
//             { field: 'dept',selected:false, fieldName: 'Dept',existingValue:'0',changeValueTo:'',adjustmentReason:'',documents:'' },
//             { field: 'div',selected:false, fieldName: 'Div',existingValue:'0',changeValueTo:'',adjustmentReason:'',documents:'' },
//             { field: 'revaluation',selected:false, fieldName: 'Revaluation',existingValue:'0',changeValueTo:'',adjustmentReason:'',documents:'' },
//             { field: 'usefulLife',selected:false, fieldName: 'Useful Life',existingValue:'0',changeValueTo:'',adjustmentReason:'',documents:'' },
//             { field: 'assetId',selected:false, fieldName: 'Asset ID',existingValue:'',changeValueTo:'',adjustmentReason:'',documents:'' },
//             { field: 'location',selected:false, fieldName: 'Location',existingValue:'',changeValueTo:'',adjustmentReason:'',documents:'' },
//             { field: 'depreciationExpense',selected:false, fieldName: 'DepreciationExpense',existingValue:'0',changeValueTo:'',adjustmentReason:'',documents:'' },
//             { field: 'accumulatedDepreciation',selected:false, fieldName: 'Accumulated Depreciation',existingValue:'0',changeValueTo:'',adjustmentReason:'',documents:'' },
            
//         ];

       
//     }
//     private getAssetsList() {
//         this.alertService.startLoadingMessage();
//         this.loadingIndicator = true;

//         this.assetService.getAssetList().subscribe(
//             results => this.onAssetListLoaded(results[0]),
//             error => this.onDataLoadFailed(error)
//         );
//     }

//     private onAssetListLoaded(assetList: any[]) {
//         this.alertService.stopLoadingMessage();
//         this.loadingIndicator = false;
//         this.allAssetInfo = assetList;
//     }
//     assetIdHandler(event) {
//         if (event) {
//             if (event.target.value != "") {

//                 let value = event.target.value.toLowerCase();
//                 if (this.onSelectedId) {
//                     if (value == this.onSelectedId.toLowerCase()) {
//                         this.disableSave = true;
//                     }
//                     else {
//                         this.disableSave = false;
//                     }
//                 }
//             }

//         }
//     }

//     filterAssetId(event) {

//         this.localCollection = [];
//         if (this.allAssetInfo) {
//             for (let i = 0; i < this.allAssetInfo.length; i++) {
//                 let assetId = this.allAssetInfo[i].assetId;
//                 if (assetId) {
//                     if (assetId.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
//                         this.allAssets.push([{
//                             "assetRecordId": this.allAssetInfo[i].assetRecordId,
//                             "assetId": this.allAssetInfo[i].assetId
//                         }]),
//                             this.localCollection.push(assetId)

//                     }
//                 }
//             }
//         }
//     }
//     onAssetIdselection(event) {
//         if (this.allAssets) {

//             for (let i = 0; i < this.allAssets.length; i++) {
//                 if (event == this.allAssets[i][0].assetId) {
//                     this.currentAsset.assetId = this.allAssets[i].assetId;
//                     this.disableSave = true;

//                     this.onSelectedId = event;
//                 }
//             }
//         }
//     }
//     private GetAssetData(assetid) {
//         this.alertService.startLoadingMessage();
//         this.loadingIndicator = true;
//         this.assetService.getByAssetId(assetid).subscribe(
//             results => this.onassetdataSuccessful(results[0]),
//             error => this.onDataLoadFailed(error)
//         );
//     }

//     private onassetdataSuccessful(getAssetData: any[]) {
//         this.alertService.stopLoadingMessage();
//         this.loadingIndicator = false;
//         this.assetService.isEditMode = true;
//         this.activeIndex = 3;
//         this.assetService.indexObj.next(this.activeIndex);
//         this.assetService.listCollection = getAssetData;
//         if (this.assetService.listCollection != null) {
//             this.showLable = true;
//             this.currentAsset = this.assetService.listCollection;
//         }
       
//         if (this.assetService.listCollection) {
//             this.local = this.assetService.listCollection;
//             this.currentAsset = this.local;
//         }
        

//     }
//     private loadManagementdata() {
//         this.alertService.startLoadingMessage();
//         this.loadingIndicator = true;

//         this.legalEntityServices.getManagemententity().subscribe(
//             results => this.onManagemtntdataLoad(results[0]),
//             error => this.onDataLoadFailed(error)
//         );
//     }
//     checkMSParents(msId) {
//         this.managementStructureData.push(msId);
//         for (let a = 0; a < this.allManagemtninfo.length; a++) {
//             if (this.allManagemtninfo[a].managementStructureId == msId) {
//                 if (this.allManagemtninfo[a].parentId) {
//                     this.checkMSParents(this.allManagemtninfo[a].parentId);
//                     break;
//                 }
//             }
//         }

//     }

//     setManagementStrucureData(obj) {
//         this.managementStructureData = [];
//         this.checkMSParents(obj.managementStructureId);
//         if (this.managementStructureData.length == 4) {
//             this.currentAsset.companyId = this.managementStructureData[3];
//             this.currentAsset.buisinessUnitId = this.managementStructureData[2];
//             this.currentAsset.departmentId = this.managementStructureData[1];
//             this.currentAsset.divisionId = this.managementStructureData[0];
//             this.getBUList(this.currentAsset.companyId);
//             this.getDepartmentlist(this.currentAsset.buisinessUnitId);
//             this.getDivisionlist(this.currentAsset.departmentId);
//         }
//         if (this.managementStructureData.length == 3) {
//             this.currentAsset.companyId = this.managementStructureData[2];
//             this.currentAsset.buisinessUnitId = this.managementStructureData[1];
//             this.currentAsset.departmentId = this.managementStructureData[0];
//             this.getBUList(this.currentAsset.companyId);
//             this.getDepartmentlist(this.currentAsset.buisinessUnitId);
//         }
//         if (this.managementStructureData.length == 2) {
//             this.currentAsset.companyId = this.managementStructureData[1];
//             this.currentAsset.buisinessUnitId = this.managementStructureData[0];
//             this.getBUList(this.currentAsset.companyId);
//         }
//         if (this.managementStructureData.length == 1) {
//             this.currentAsset.companyId = this.managementStructureData[0];
//         }

//     }

//     getBUList(companyId) {
//         if (this.updateMode == false) {
//             this.currentAsset.buisinessUnitId = "";
//             this.currentAsset.departmentId = "";
//             this.currentAsset.divisionId = "";
//             this.currentAsset.managementStructureId = companyId;
//             this.departmentList = [];
//             this.divisionlist = [];
//             this.bulist = [];
//             for (let i = 0; i < this.allManagemtninfo.length; i++) {
//                 if (this.allManagemtninfo[i].parentId == companyId) {
//                     this.bulist.push(this.allManagemtninfo[i])
//                 }
//             }

//         }
//         else {
//             this.departmentList = [];
//             this.divisionlist = [];
//             this.bulist = [];
//             for (let i = 0; i < this.allManagemtninfo.length; i++) {
//                 if (this.allManagemtninfo[i].parentId == companyId) {
//                     this.bulist.push(this.allManagemtninfo[i])
//                 }
//             }
//         }
//     }

//     getDepartmentlist(businessUnitId) {
//         if (this.updateMode == false) {
//             this.currentAsset.departmentId = "";
//             this.currentAsset.divisionId = "";
//             this.currentAsset.managementStructureId = businessUnitId;
//             this.departmentList = [];
//             this.divisionlist = [];
//             for (let i = 0; i < this.allManagemtninfo.length; i++) {
//                 if (this.allManagemtninfo[i].parentId == businessUnitId) {
//                     this.departmentList.push(this.allManagemtninfo[i]);
//                 }
//             }

//         }
//         else {
//             this.departmentList = [];
//             this.divisionlist = [];
//             for (let i = 0; i < this.allManagemtninfo.length; i++) {
//                 if (this.allManagemtninfo[i].parentId == businessUnitId) {
//                     this.departmentList.push(this.allManagemtninfo[i]);
//                 }
//             }
//         }
//     }

//     getDivisionlist(departmentId) {
//         if (this.updateMode == false) {
//             this.currentAsset.divisionId = "";
//             this.currentAsset.managementStructureId = departmentId;
//             this.divisionlist = [];
//             for (let i = 0; i < this.allManagemtninfo.length; i++) {
//                 if (this.allManagemtninfo[i].parentId == departmentId) {
//                     this.divisionlist.push(this.allManagemtninfo[i]);
//                 }
//             }
//         }
//         else {
//             this.divisionlist = [];
//             for (let i = 0; i < this.allManagemtninfo.length; i++) {
//                 if (this.allManagemtninfo[i].parentId == departmentId) {
//                     this.divisionlist.push(this.allManagemtninfo[i]);
//                 }
//             }
//         }
//     }

//     divisionChange(divisionId) {
//         this.currentAsset.managementStructureId = divisionId;
//     }

//     private onManagemtntdataLoad(getAtaMainList: any[]) {
//         this.alertService.stopLoadingMessage();
//         this.loadingIndicator = false;
//         this.allManagemtninfo = getAtaMainList;

//         for (let i = 0; i < this.allManagemtninfo.length; i++) {

//             if (this.allManagemtninfo[i].parentId == null) {
//                 this.maincompanylist.push(this.allManagemtninfo[i]);
//             }
//         }

//         this.setManagementStrucureData(this.currentAsset);

//     }

//     get userName(): string {
//         return this.authService.currentUser ? this.authService.currentUser.userName : "";
//     }
//     private onDataLoadFailed(error: any) {
//         this.alertService.stopLoadingMessage();
//         this.loadingIndicator = false;
//     }

//     fileUpload(event) {
// 		if (event.files.length === 0)
// 			return;

// 		for (let file of event.files)
// 			this.formData.append(file.name, file);
//     }
//     removeFile(file: File,uploader) {
//         const index = uploader.files.indexOf(file);
//         uploader.remove(index);
//        console.log(file);
//        // this.formData.delete(file.name);
//     }
//     saveAssetAdjustment() {
//       console.log(this.data);
//     }
//     backClick() {
    
//         this.route.navigateByUrl('assetmodule/assetpages/app-asset-listing');
//     }


// }