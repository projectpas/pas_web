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
    allEmployeeList: any = [] ;
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

    constructor(private commonService: CommonService, private authService: AuthService, private percentService: PercentService, private laborOHService: LaborAndOverheadCostService, private _actRoute: ActivatedRoute, private router: Router, private alertService: AlertService, private localStorage: LocalStoreManager) {
        this.directLaborData.laborRateId = '1';
        this.directLaborData.laborHoursId = '1';
        this.directLaborData.burdenRateId = '1';
    }

    ngOnInit() {
        this.currencyData();
        this.percentData();
        this.getLegalEntity();
        this.getGlobalSettings();
        this.laborOHSettingsId = this._actRoute.snapshot.params['id'];
		if(this.laborOHSettingsId) {
			this.isEditMode = true;
			this.getLaborOHDetailsById(this.laborOHSettingsId);
		} else {
			this.getManagementStructureDetailsForCurrentUser(this.currentUserManagementStructureId);
		}
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
    
    getManagementStructureDetailsForCurrentUser(id) {
		this.commonService.getManagementStructureDetails(id).subscribe(res => {
			if (res.Level1) {
				this.managementStructure.companyId = res.Level1;
				this.selectedLegalEntity(res.Level1);
			} else
				this.managementStructure.companyId = 0;

			if (res.Level2) {
				this.managementStructure.buId = res.Level2;
				this.selectedBusinessUnit(res.Level2);
			} else
				this.managementStructure.buId = 0;

			if (res.Level3) {
				this.managementStructure.divisionId = res.Level3;
				this.selectedDivision(res.Level3);
			} else
				this.managementStructure.divisionId = 0;

			if (res.Level4) {
				this.managementStructure.departmentId = res.Level4;
				this.selectedDepartment(res.Level4);
			} else
				this.managementStructure.departmentId = 0;

		})
	}

    currencyData() {
		this.commonService.smartDropDownList('Currency', 'CurrencyId', 'Code').subscribe(res => {
			this.allEmployeeList = res;
		})
    }

    percentData() {
		this.percentService.getPercentages().subscribe(res => {
			const data = res[0];
			this.allPercentList = data;
		})
    }

    getLegalEntity() {
        this.commonService.getLegalEntityList().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.legalEntityList = res;
        })
    }

    getLaborOHDetailsById(id) {
        this.laborOHService.getLaborOHSettingsById(id).subscribe(res => {
            console.log(res);
            this.directLaborData = {
                ...res,
                laborRateId: res.laborRateId.toString(),
                laborHoursId: res.laborHoursId.toString(),
                burdenRateId: res.burdenRateId.toString(),
                averageRate: this.onChangeCost(res.averageRate),
                flatAmount: this.onChangeBurdenCost(res.flatAmount)
            };
            this.getManagementStructureOnEdit(res.managementStructureId);
        })
    }
    
    getManagementStructureOnEdit(managementStructureId) {
        this.commonService.getManagementStructureDetails(managementStructureId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.selectedLegalEntity(res.Level1);
            this.selectedBusinessUnit(res.Level2);
            this.selectedDivision(res.Level3);
            this.selectedDepartment(res.Level4);
            this.managementStructure = {
                companyId: res.Level1 !== undefined ? res.Level1 : 0,
                buId: res.Level2 !== undefined ? res.Level2 : 0,
                divisionId: res.Level3 !== undefined ? res.Level3 : 0,
                departmentId: res.Level4 !== undefined ? res.Level4 : 0,
			}
        })
    }
    
    selectedLegalEntity(legalEntityId) {
		this.businessUnitList = [];
		this.divisionList = [];
		this.departmentList = [];
		this.managementStructure.buId = 0;
		this.managementStructure.divisionId = 0;
		this.managementStructure.departmentId = 0;

        if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
            this.directLaborData.managementStructureId = legalEntityId;
            this.commonService.getBusinessUnitListByLegalEntityId(legalEntityId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.businessUnitList = res;
			});
		}	
	}

    selectedBusinessUnit(businessUnitId) {
		this.divisionList = [];
		this.departmentList = [];
		this.managementStructure.divisionId = 0;
		this.managementStructure.departmentId = 0;

        if (businessUnitId != 0 && businessUnitId != null && businessUnitId != undefined) {
            this.directLaborData.managementStructureId = businessUnitId;
            this.commonService.getDivisionListByBU(businessUnitId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.divisionList = res;
            })
        }
    }
    selectedDivision(divisionUnitId) {
		this.departmentList = [];
		this.managementStructure.departmentId = 0;

        if (divisionUnitId != 0 && divisionUnitId != null && divisionUnitId != undefined) {
            this.directLaborData.managementStructureId = divisionUnitId;
            this.commonService.getDepartmentListByDivisionId(divisionUnitId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.departmentList = res;
            })
        }
    }
    selectedDepartment(departmentId) {
        if (departmentId != 0 && departmentId != null && departmentId != undefined) {
            this.directLaborData.managementStructureId = departmentId;
        }
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
    
    onSaveDirectLabor() {
        const data = {
            ...this.directLaborData,
            createdBy: this.userName,
            updatedBy: this.userName,
            masterCompanyId: 1
        };
        if(!this.isEditMode) {
            this.laborOHService.createLaborOHSettings(data).subscribe(res => {
                console.log(res);
                this.router.navigateByUrl('/workordersmodule/workorderspages/app-direct-labour');
                this.alertService.showMessage(
                    'Success',
                    `Saved Direct Labor Sucessfully`,
                    MessageSeverity.success)
            })
        } else {
            this.laborOHService.updateLaborOHSettings(data).subscribe(res => {
                console.log(res);
                this.router.navigateByUrl('/workordersmodule/workorderspages/app-direct-labour');
                this.alertService.showMessage(
                    'Success',
                    `Updated Direct Labor Sucessfully`,
                    MessageSeverity.success)
            })
        }
    }
}