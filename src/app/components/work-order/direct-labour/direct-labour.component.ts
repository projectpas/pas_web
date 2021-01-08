import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { Router } from '@angular/router';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { LaborAndOverheadCostService } from '../../../services/laborandoverheadcost.service';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-direct-labour',
    templateUrl: './direct-labour.component.html',
	styleUrls: ['./direct-labour.component.scss'],
	animations: [fadeInOut]
})
/** warehouse component*/
export class DirectLabourComponent implements OnInit {
	directLaborList: any[] = [];
	pageSize: number = 10;
	cols = [
		{ field: 'levelCode1', header: 'Level 01' },
		{ field: 'levelCode2', header: 'Level 02' },
		{ field: 'levelCode3', header: 'Level 03' },
		{ field: 'levelCode4', header: 'Level 04' },
		{ field: 'laborRateIdText', header: 'What Labor Rate To Use On Work Orders Text' },
		{ field: 'averageRate', header: 'What Labor Rate To Use On Work Orders?' },
		{ field: 'laborHoursIdText', header: 'How To Apply Hours To Work Orders?' },
		{ field: 'burdenRateIdText', header: 'Overhead Burden Rate Text' },
		{ field: 'flatAmount', header: 'Overhead Burden Rate' }
	];
	selectedColumns = this.cols;
	selectedColumn: any;
	rowDataToDelete: any = {};
	auditHistory: any = [];
	directLaborData: any = {};
	headerManagementStructure: any = {};

	constructor(private laborOHService: LaborAndOverheadCostService, private _route: Router, private alertService: AlertService, private authService: AuthService, private commonService: CommonService) {}

	ngOnInit() {
		this.loadData();
	}

	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";		
	}

	loadData() {
		this.laborOHService.getLaborOHSettings().subscribe(res => {
			console.log(res);
			this.directLaborList = res.map(x => {
                return {
                    ...x,
                    averageRate: x.averageRate ? x.averageRate : '-'
                }
            });
		});
	}

	getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
	}

	viewSelectedRow(rowData) { 
		this.laborOHService.getLaborOHSettingsById(rowData.laborOHSettingsId).subscribe(res => {
            console.log(res);
            this.directLaborData = {
                ...res,
                laborRateId: res.laborRateId.toString(),
                laborHoursId: res.laborHoursId.toString(),
                burdenRateId: res.burdenRateId.toString(),
            };
            this.getManagementStructureCodes(res.managementStructureId);
        });		
	}
	
	getManagementStructureCodes(id) {
        this.commonService.getManagementStructureCodes(id).subscribe(res => {
			if (res.Level1) {
				this.headerManagementStructure.level1 = res.Level1;
            } else {
                this.headerManagementStructure.level1 = '-';
            }
            if (res.Level2) {
				this.headerManagementStructure.level2 = res.Level2;
            } else {
                this.headerManagementStructure.level2 = '-';
            }
            if (res.Level3) {
				this.headerManagementStructure.level3 = res.Level3;
            } else {
                this.headerManagementStructure.level3 = '-';
            }
            if (res.Level4) {
				this.headerManagementStructure.level4 = res.Level4;
			} else {
                this.headerManagementStructure.level4 = '-';
            }
		})
    }

    viewSelectedRowdbl(rowData) {
        this.viewSelectedRow(rowData);
        $('#viewLabor').modal('show');
    }
	
	onEdit(row) {
		const { laborOHSettingsId } = row;
        this._route.navigateByUrl(`/workordersmodule/workorderspages/app-direct-labour-add/edit/${laborOHSettingsId}`);
	}
	
	changeStatus(rowData) {        
        this.laborOHService.getLaborOHSettingsStatus(rowData.laborOHSettingsId, rowData.isActive, this.userName).subscribe(res => {
			this.loadData();
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        })
	}
	
	delete(rowData) {
        this.rowDataToDelete = rowData;
	}
	
    deleteDirectLabor() {
        const { laborOHSettingsId } = this.rowDataToDelete;
        this.laborOHService.deleteLaborOHSettings(laborOHSettingsId, this.userName).subscribe(res => {
            this.loadData();
            this.alertService.showMessage("Success", `Successfully Deleted Record`, MessageSeverity.success);
        })
	}
	
	getAuditHistoryById(rowData) {
        this.laborOHService.getLaborOHSettingsAuditById(rowData.laborOHSettingsId).subscribe(res => {
            console.log(res);            
            this.auditHistory = res;
        })
	}
	
    getColorCodeForHistory(i, field, value) {
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
}