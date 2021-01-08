// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




import { ChargeEndpoint } from './charge-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Charge } from '../models/charge.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class ChargeService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private chargeEndpoint: ChargeEndpoint) { }

    getChargeList() {
        return forkJoin(
            this.chargeEndpoint.getChargeEndpoint<Charge[]>());
    }
    newCharge(charge: Charge) {
        return this.chargeEndpoint.getNewGatecodeEndpoint<Charge>(charge);
	}

	

	getPOData() {
		return forkJoin(
			this.chargeEndpoint.getPOEndpoint<Charge[]>());
	}

	

    getCharge(chargeId?: any) {
        return this.chargeEndpoint.getEditChargeEndpoint<Charge>(chargeId);
    }

    updateCharge(action: Charge) {
        return this.chargeEndpoint.getUpdateChargeEndpoint(action, action.chargeId);
    }

    deleteCharge(chargeId: any,updatedBy: string) {

        return this.chargeEndpoint.getDeleteChargeEndpoint
        (chargeId,updatedBy);

    }
    historyCharge(chargeId: number) {
        return forkJoin(this.chargeEndpoint.getHistoryChargeEndpoint<AuditHistory[]>(chargeId));
    }
    
    getChargeAudit(chargeId: number) {
        return this.chargeEndpoint.getChargeAuditById<any>(chargeId);
    }

    getServerPages(serverSidePagesData: any) {
        return forkJoin(
            this.chargeEndpoint.getChargeRecords<Charge[]>(serverSidePagesData));
    }

}