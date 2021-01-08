// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';





import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

import { AuditHistory } from '../models/audithistory.model';
import { ReceivingCustomerWorkEndpoint } from './receivingcustomerWork-endpoint.service';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class ReceivingCustomerWorkService {
	bredcrumbObjChangeObject$: any;
	public static readonly roleAddedOperation: RolesChangedOperation = "add";
	public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
	public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();
    isEditMode: boolean = false;
    enableExternal: boolean = false;
    listCollection: any;

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private receivingCustomerWorkEndpoint: ReceivingCustomerWorkEndpoint) { }

	getReceiveCustomerList() {
		return forkJoin(
            this.receivingCustomerWorkEndpoint.getReasonEndpoint<any[]>());
    }

    getCustomerWorkdataById(customerId: any) {

        return this.receivingCustomerWorkEndpoint.getCustomerWorkListByid<any>(customerId);
    }
    getCustomerWorkAll(data) {
        return this.receivingCustomerWorkEndpoint.getCustomerWorkAll(data);
    }
	newReason(receivingCustomerWork: any) {
		return this.receivingCustomerWorkEndpoint.getNewReasonEndpoint<any>(receivingCustomerWork);
	}

	historyReason(receivingCustomerWorkId: number) {
		return forkJoin(this.receivingCustomerWorkEndpoint.getHistoryReasonEndpoint<AuditHistory[]>(receivingCustomerWorkId));
	}

	getReason(receivingCustomerWorkId?: number) {
		return this.receivingCustomerWorkEndpoint.getEditReasonEndpoint<any>(receivingCustomerWorkId);
	}

	updateReason(receivingCustomerWork: any) {
		return this.receivingCustomerWorkEndpoint.getUpdateReasonEndpoint(receivingCustomerWork, receivingCustomerWork.receivingCustomerWorkId);
    }
    
    updateCustomerWorkReceiving(receivingCustomerWork: any) {
		return this.receivingCustomerWorkEndpoint.updateCustomerWorkReceivingEndpoint<any>(receivingCustomerWork);
	}
	//deleteReason(receivingCustomerWorkId: number) {

	//	return this.receivingCustomerWorkEndpoint.getDeleteReasonEndpoint(receivingCustomerWorkId);

 //   }
   
    deleteReason(receivingCustomerWorkId: number, updatedBy: string) {

        return this.receivingCustomerWorkEndpoint.getDeleteReasonEndpoint(receivingCustomerWorkId, updatedBy);

    }
    newStockLineTimeLife(sourcereceving: any) {
        return this.receivingCustomerWorkEndpoint.getNewTimeAdjustmentEndpoint<any>(sourcereceving);
    }
    updateStockLineTimelife(sourceTimeLife: any) {
        return this.receivingCustomerWorkEndpoint.getUpdatestockLineTimeLifeEndpoint<any>(sourceTimeLife, sourceTimeLife.timeLifeCyclesId);
    }
    
    updateActionforActive(receivingCustomerWorkId: number,status:string,updatedBy:string) {
        return this.receivingCustomerWorkEndpoint.getUpdateActionforActive(receivingCustomerWorkId, status,updatedBy);
    }
    getAuditHistory(receivingCustomerWorkId: number) {
        return forkJoin(this.receivingCustomerWorkEndpoint.getAuditHistory(receivingCustomerWorkId));
    }
    getGlobalSearch(value, pageIndex, pageSize) {

        return this.receivingCustomerWorkEndpoint.getGlobalCustomerRecords<any>(value, pageIndex, pageSize);
    }
}

