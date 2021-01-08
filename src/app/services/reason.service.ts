// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




import { ReasonEndpoint } from './reason-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Reason } from '../models/reason.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class ReasonService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private reasonEndpoint: ReasonEndpoint) { }

    getReasonList() {
        return forkJoin(
            this.reasonEndpoint.getReasonEndpoint<Reason[]>());
    }
    newReason(reason) {
        return this.reasonEndpoint.getNewReasonEndpoint<Reason>(reason);
    }

    historyReason(reasonId: number) {
        return forkJoin(this.reasonEndpoint.getHistoryReasonEndpoint<AuditHistory[]>(reasonId));
    }

    getReason(reasonId?: number) {
        return this.reasonEndpoint.getEditReasonEndpoint<Reason>(reasonId);
    }

    updateReason(reason) {
        return this.reasonEndpoint.getUpdateReasonEndpoint(reason, reason.reasonId);
    }

    deleteReason(reasonId: number) {

        return this.reasonEndpoint.getDeleteReasonEndpoint(reasonId);

    }
    getReasonAudit(reasonId: number) {
        return this.reasonEndpoint.getReasonAuditById<any>(reasonId);
    }

    getServerPages(serverSidePagesData: any) {
        return forkJoin(
            this.reasonEndpoint.getReasonRecords<Reason[]>(serverSidePagesData));
    }

    getAllReasonsList() {
        return forkJoin(
            this.reasonEndpoint.getAllReasonsEndpoint<any>());
    }
    reasonFileUpload(file) {
        return this.reasonEndpoint.reasonCustomUpload(file);
    }
}

