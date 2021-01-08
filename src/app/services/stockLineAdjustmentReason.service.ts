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
import { StocklineAdjustmentReasonEndpoint } from './stocklineadjustment-endpoint.service'
export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class StocklineAdjustReasonService {
    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private stocklineAdjustmentReasonEndpoint: StocklineAdjustmentReasonEndpoint) { }
    //For getting the stockline List
    getStockLineAdjustmentReasonList() {
        return forkJoin(
            this.stocklineAdjustmentReasonEndpoint.getStockLineAdjustmentReasonEndpoint<any>());
    }

    newStocklineAdjReason(action: any) {
        return this.stocklineAdjustmentReasonEndpoint.getNewStocklineAdjReasonEndpoint<any>(action);
    }

    updateStocklineAdjReason(action: any) {
        return this.stocklineAdjustmentReasonEndpoint.getUpdateStocklineAdjReasonEndpoint(action, action.adjustmentReasonId);
    }

    getStockAdjReasonAudit(Id: number) {
        return this.stocklineAdjustmentReasonEndpoint.getStockAdjReasonAudit<any[]>(Id);
    }

    deleteStockLineAdjustmentReason(iD: number) {
        
        return this.stocklineAdjustmentReasonEndpoint.getDeleteStocklineAdjustmentReasonEndpoint(iD);
        
    }
    stockLineAdjustmentCustomUpload(file) {
        return this.stocklineAdjustmentReasonEndpoint.stockLineAdjustmentCustomUpload(file);
    }

    //saveStockLineAdjustmentReason(stockLineAdjustmentReasonData: any) {
    //    return this.stocklineAdjustmentReasonEndpoint.saveStocklineAdjustmentReasonEndpoint<any>(stockLineAdjustmentReasonData);
    //}
}