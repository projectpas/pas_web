import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { CommonService } from '../../../../services/common.service';
import { AuthService } from '../../../../services/auth.service';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { PercentService } from '../../../../services/percent.service';
import { LaborAndOverheadCostService } from '../../../../services/laborandoverheadcost.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { DBkeys } from '../../../../services/db-Keys';

@Component({
    selector: 'app-direct-labour-add',
    templateUrl: './direct-labour-add.component.html',
    styleUrls: ['./direct-labour-add.component.scss'],
    animations: [fadeInOut]
}) 
/** WorkOrderAdd component*/ 
export class DirectLabourAddComponent implements OnInit {
    directLaborData: any = {};   
    allCurrencyData: any = [] ;
    allPercentList: any = [] ;
    legalEntityList: any = [] ;
    businessUnitList: any = [];
    divisionList: any = [];
	departmentList: any = [];
    isEditMode: boolean = false;
    laborOHSettingsId: number;
    private onDestroy$: Subject<void> = new Subject<void>();
    managementStructure = {
        companyId: 0,
        buId: 0,
        divisionId: 0,
        departmentId: 0,
    }
    global_lang: any;
    globalSettings: any = {};
    arraycurrencyIdlist:any=[];
    disableUpdateButton: any = false;
    isSpinnerVisible: boolean = false;
    constructor(private commonService: CommonService, private authService: AuthService, private percentService: PercentService, private laborOHService: LaborAndOverheadCostService, private _actRoute: ActivatedRoute, private router: Router, private alertService: AlertService, private localStorage: LocalStoreManager) {
        this.directLaborData.laborRateId = '1';
        this.directLaborData.laborHoursId = '1';
        this.directLaborData.burdenRateId = '1';
    }

    ngOnInit() {
        // this.getLegalEntity();
        this.directLaborData.laborHoursMedthodId=1;
        this.getGlobalSettings();
        this.laborOHSettingsId = this._actRoute.snapshot.params['id'];
		if(this.laborOHSettingsId) {
			this.isEditMode = true;
			this.getLaborOHDetailsById(this.laborOHSettingsId);
		} else {
			// this.getManagementStructureDetailsForCurrentUser(this.currentUserManagementStructureId);
            this.currencyData();
            this.percentData();
            this.getManagementStructureDetails(this.authService.currentUser
                ? this.authService.currentUser.managementStructureId
                : null, this.authService.currentUser ? this.authService.currentUser.employeeId : 0);
        }
    }

    getActive() {
        this.disableUpdateButton = false;
    }

    getLaborOHDetailsById(id) {
        this.isSpinnerVisible= true;
        this.laborOHService.getLaborOHSettingsById(id).subscribe(res => {
      
         
            this.directLaborData = {
                ...res,
                laborRateId: res.laborRateId.toString(),
                laborHoursId: res.laborHoursId.toString(),
                burdenRateId: res.burdenRateId.toString(),
                averageRate: this.onChangeCost(res.averageRate),
                quoteAverageRate: this.onChangeCostWoq(res.quoteAverageRate),
                
                // flatAmount: this.onChangeBurdenCost(res.flatAmount)
            }; 
            console.log("this.directLaborData",this.directLaborData)
            this.currencyData();
            this.percentData();
setTimeout(() => {

    this.isSpinnerVisible= false;
    if(this.directLaborData.burdenRateId==1){
        this.allPercentList.forEach(element => {
            if(this.directLaborData.flatAmount==element.label){
                this.directLaborData.flatAmount=element.value;
            }
        });
    }
 
}, 1000);

            // this.getManagementStructureOnEdit(res.managementStructureId);
            this.getManagementStructureDetails(this.directLaborData
                ? this.directLaborData.managementStructureId
                : null, this.authService.currentUser ? this.authService.currentUser.employeeId : 0);
        },err=>{
            this.isSpinnerVisible= false;
        })
    }
    currencyData() {
        this.arraycurrencyIdlist=[];
        let currencyId = this.directLaborData.currencyId ? this.directLaborData.currencyId : '0';
        if (this.arraycurrencyIdlist.length == 0 && currencyId == 0) {
            this.arraycurrencyIdlist.push(0);
        }
        else {
            this.arraycurrencyIdlist.push(currencyId);
        }
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', '', true, 0, this.arraycurrencyIdlist.join(), this.currentUserMasterCompanyId)
            .subscribe(currencydata => {
                this.allCurrencyData = currencydata.map(x => {
                    return {
                        ...x,
                        currencyId: x.value,
                        code: x.label
                    }
                });
            }, error => {
                // this.isSpinnerVisible = false;
            });
    }
    percentData(): void {
        this.arraycurrencyIdlist=[];
        let flatAmount = this.directLaborData.flatAmount ? this.directLaborData.flatAmount : '0';
        if (this.arraycurrencyIdlist.length == 0 && flatAmount == 0) {
            this.arraycurrencyIdlist.push(0);
        }
        else {
            this.arraycurrencyIdlist.push(flatAmount);
        }
        this.commonService.autoSuggestionSmartDropDownList('[Percent]', 'PercentId', 'PercentValue', '', true, 0, this.arraycurrencyIdlist.join(),this.currentUserMasterCompanyId)
            .subscribe(res => {
              const data = res.map(x => {
                    return {
                        ...x,
                        percentId: x.value,
                        percentValue: x.label
                    }
                });

               this.allPercentList = data.sort((n1,n2) => n1.label - n2.label);
            });
            
            
    }

    get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";		
	}
	get currentUserManagementStructureId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.managementStructureId
		  : null;
    }

    getGlobalSettings() {
        this.globalSettings = this.localStorage.getDataObject<any>(DBkeys.GLOBAL_SETTINGS) || {};
        this.global_lang = this.globalSettings.cultureName;
    }
    
    onChangeBurdenRate() {
        this.directLaborData.flatAmount = null;
    }

    onChangeCost(val) {
        // if (this.directLaborData.averageRate) {
        //     this.directLaborData.averageRate = Number(this.directLaborData.averageRate.replace(/[^0-9.-]+/g, ""));
        //     this.directLaborData.averageRate = new Intl.NumberFormat(this.global_lang, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.directLaborData.averageRate)
        // }
        if (val) {
            if (isNaN(val) == true) {
                val = Number(val.replace(/[^0-9.-]+/g, ""));
            }
            this.directLaborData.averageRate = new Intl.NumberFormat(this.global_lang, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)
            return this.directLaborData.averageRate;
        }
    }
    onChangeCostWoq(val){
        if (val) {
            if (isNaN(val) == true) {
                val = Number(val.replace(/[^0-9.-]+/g, ""));
            }
            this.directLaborData.quoteAverageRate = new Intl.NumberFormat(this.global_lang, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)
            return this.directLaborData.quoteAverageRate;
        }
    }
    onChangeFlatCost(val) {
       if (val) {
            if (isNaN(val) == true) {
                val = Number(val.replace(/[^0-9.-]+/g, ""));
            }
            this.directLaborData.flatAmount = new Intl.NumberFormat(this.global_lang, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)
            return this.directLaborData.flatAmount;
        }
    }
    onChangeBurdenCost(val) {
        if (val) {
            if (isNaN(val) == true) {
                val = Number(val.replace(/[^0-9.-]+/g, ""));
            }
            this.directLaborData.flatAmount = new Intl.NumberFormat(this.global_lang, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)
            return this.directLaborData.flatAmount;
        }
    }

    onChangeLaborRate() {
        this.directLaborData.averageRate = null;
    }
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
    }
    onSaveDirectLabor() {
        const data = {
            ...this.directLaborData,
            createdBy: this.userName,
            updatedBy: this.userName,
            masterCompanyId: this.currentUserMasterCompanyId
        };
        // if(data.burdenRateId==1){
   
        //     this.allPercentList.forEach(element => {
        //         if(data.flatAmount==element.value){
        //             data.flatAmount=element.label;
        //         }
        //     });
        // }
        if(!this.isEditMode) {
            this.isSpinnerVisible=true;
            this.laborOHService.createLaborOHSettings(data).subscribe(res => {
                this.isSpinnerVisible=false;
                this.router.navigateByUrl('/workordersmodule/workorderspages/app-direct-labour');
                this.alertService.showMessage(
                    'Success',
                    `Saved Direct Labor Sucessfully`,
                    MessageSeverity.success)
            },err=>{
                this.isSpinnerVisible=false;
            })
        } else {
                this.isSpinnerVisible=true;
            this.laborOHService.updateLaborOHSettings(data).subscribe(res => {
                this.isSpinnerVisible=false;
                this.router.navigateByUrl('/workordersmodule/workorderspages/app-direct-labour');
                this.alertService.showMessage(
                    'Success',
                    `Updated Direct Labor Sucessfully`,
                    MessageSeverity.success)
            },err=>{
                this.isSpinnerVisible=false;
            })
        }
    }


 
    getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
        empployid = empployid == 0 ? this.employeeId : empployid;
        editMSID = this.isEditMode ? editMSID = id : 0;
        this.commonService.getManagmentStrctureData(id, empployid, editMSID,this.authService.currentUser.masterCompanyId).subscribe(response => {
            if (response) {
                const result = response;
                if (result[0] && result[0].level == 'Level1') {
                    this.legalEntityList = result[0].lstManagmentStrcture;
                    this.managementStructure.companyId = result[0].managementStructureId;
                    this.directLaborData.managementStructureId = result[0].managementStructureId;
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.businessUnitList = [];
                    this.divisionList = [];
                    this.departmentList = [];
                } else {
                    this.managementStructure.companyId = 0;
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.legalEntityList = [];
                    this.businessUnitList = [];
                    this.divisionList = [];
                    this.departmentList = [];
                }
                if (result[1] && result[1].level == 'Level2') {
                    this.businessUnitList = result[1].lstManagmentStrcture;
                    this.managementStructure.buId = result[1].managementStructureId;
                    this.directLaborData.managementStructureId = result[1].managementStructureId;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.divisionList = [];
                    this.departmentList = [];
                } else {
                    if (result[1] && result[1].level == 'NEXT') {
                        this.businessUnitList = result[1].lstManagmentStrcture;
                    }
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.divisionList = [];
                    this.departmentList = [];
                }

                if (result[2] && result[2].level == 'Level3') {
                    this.divisionList = result[2].lstManagmentStrcture;
                    this.managementStructure.divisionId = result[2].managementStructureId;
                    this.directLaborData.managementStructureId = result[2].managementStructureId;
                    this.managementStructure.departmentId = 0;
                    this.departmentList = [];
                } else {
                    if (result[2] && result[2].level == 'NEXT') {
                        this.divisionList = result[2].lstManagmentStrcture;
                    }
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.departmentList = [];
                }

                if (result[3] && result[3].level == 'Level4') {
                    this.departmentList = result[3].lstManagmentStrcture;;
                    this.managementStructure.departmentId = result[3].managementStructureId;
                    this.directLaborData.managementStructureId = result[3].managementStructureId;
                } else {
                    this.managementStructure.departmentId = 0;
                    if (result[3] && result[3].level == 'NEXT') {
                        this.departmentList = result[3].lstManagmentStrcture;
                    }
                }
            }
        });
    }



    selectedLegalEntity(legalEntityId,from) {
        if (legalEntityId) {
            this.managementStructure.companyId = legalEntityId;
            this.directLaborData.managementStructureId = legalEntityId;
            this.commonService.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId,0,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.businessUnitList = res;
                this.managementStructure.buId = 0;
                this.managementStructure.divisionId = 0;
                this.managementStructure.departmentId = 0;
            })
            // this.disableMagmtStruct = false;/
        } else {
            // this.disableMagmtStruct = true;
        }
    }


    get employeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }
    selectedBusinessUnit(businessUnitId,from) {
        if (businessUnitId) {
            this.managementStructure.buId = businessUnitId;
            this.directLaborData.managementStructureId = businessUnitId;
            this.commonService.getManagementStructurelevelWithEmployee(businessUnitId, this.employeeId,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.divisionList = res;
                this.managementStructure.divisionId = 0;
                this.managementStructure.departmentId = 0;
            })
        }
    }
    selectedDivision(divisionId,from) {
        if (divisionId) {
            this.managementStructure.divisionId = divisionId;
            this.directLaborData.managementStructureId = divisionId;
            this.commonService.getManagementStructurelevelWithEmployee(divisionId, this.employeeId,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.departmentList = res;
                this.managementStructure.departmentId = 0;
            })
        }
    }

    selectedDepartment(departmentId,from) {
        if (departmentId) {
            this.managementStructure.departmentId = departmentId;
            this.directLaborData.managementStructureId = departmentId;
        }
    }



















    // getManagementStructureDetailsForCurrentUser(id) {
	// 	this.commonService.getManagementStructureDetails(id).subscribe(res => {
	// 		if (res.Level1) {
	// 			this.managementStructure.companyId = res.Level1;
	// 			this.selectedLegalEntity(res.Level1);
	// 		} else
	// 			this.managementStructure.companyId = 0;

	// 		if (res.Level2) {
	// 			this.managementStructure.buId = res.Level2;
	// 			this.selectedBusinessUnit(res.Level2);
	// 		} else
	// 			this.managementStructure.buId = 0;

	// 		if (res.Level3) {
	// 			this.managementStructure.divisionId = res.Level3;
	// 			this.selectedDivision(res.Level3);
	// 		} else
	// 			this.managementStructure.divisionId = 0;

	// 		if (res.Level4) {
	// 			this.managementStructure.departmentId = res.Level4;
	// 			this.selectedDepartment(res.Level4);
	// 		} else
	// 			this.managementStructure.departmentId = 0;

	// 	})
	// }


    // getLegalEntity() {
    //     this.commonService.getLegalEntityList().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
    //         this.legalEntityList = res;
    //     })
    // }


    // getManagementStructureOnEdit(managementStructureId) {
    //     this.commonService.getManagementStructureDetails(managementStructureId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
    //         this.selectedLegalEntity(res.Level1);
    //         this.selectedBusinessUnit(res.Level2);
    //         this.selectedDivision(res.Level3);
    //         this.selectedDepartment(res.Level4);
    //         this.managementStructure = {
    //             companyId: res.Level1 !== undefined ? res.Level1 : 0,
    //             buId: res.Level2 !== undefined ? res.Level2 : 0,
    //             divisionId: res.Level3 !== undefined ? res.Level3 : 0,
    //             departmentId: res.Level4 !== undefined ? res.Level4 : 0,
	// 		}
    //     })
    // }
    
    // selectedLegalEntity1(legalEntityId) {
	// 	this.businessUnitList = [];
	// 	this.divisionList = [];
	// 	this.departmentList = [];
	// 	this.managementStructure.buId = 0;
	// 	this.managementStructure.divisionId = 0;
	// 	this.managementStructure.departmentId = 0;

    //     if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
    //         this.directLaborData.managementStructureId = legalEntityId;
    //         this.commonService.getBusinessUnitListByLegalEntityId(legalEntityId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
    //             this.businessUnitList = res;
	// 		});
	// 	}	
	// }

    // selectedBusinessUnit1(businessUnitId) {
	// 	this.divisionList = [];
	// 	this.departmentList = [];
	// 	this.managementStructure.divisionId = 0;
	// 	this.managementStructure.departmentId = 0;

    //     if (businessUnitId != 0 && businessUnitId != null && businessUnitId != undefined) {
    //         this.directLaborData.managementStructureId = businessUnitId;
    //         this.commonService.getDivisionListByBU(businessUnitId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
    //             this.divisionList = res;
    //         })
    //     }
    // }
    // selectedDivision1(divisionUnitId) {
	// 	this.departmentList = [];
	// 	this.managementStructure.departmentId = 0;

    //     if (divisionUnitId != 0 && divisionUnitId != null && divisionUnitId != undefined) {
    //         this.directLaborData.managementStructureId = divisionUnitId;
    //         this.commonService.getDepartmentListByDivisionId(divisionUnitId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
    //             this.departmentList = res;
    //         })
    //     }
    // }
    // selectedDepartment1(departmentId) {
    //     if (departmentId != 0 && departmentId != null && departmentId != undefined) {
    //         this.directLaborData.managementStructureId = departmentId;
    //     }
    // }


}