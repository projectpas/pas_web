// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { WorkPerformedEndpointService } from './workperformed-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { WorkPerformed } from '../models/workperformed.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class WorkPerformedService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private workperformedEndpoint:  WorkPerformedEndpointService) { }

    getWorkPerformedList() {
        return Observable.forkJoin(
            this.workperformedEndpoint.getWorkPerformedEndpoint<WorkPerformed[]>());
    }
    newWorkPerformed(workperformed) {
        return this.workperformedEndpoint.getNewWorkPerformedEndpoint<WorkPerformed>(workperformed);
    }

    historyWorkPerformed(workPerformedId: number) {
        return Observable.forkJoin(this.workperformedEndpoint.getHistoryWorkPerformedEndpoint<AuditHistory[]>(workPerformedId));
    }

    getWorkPerformed(workPerformedId?: number) {
        return this.workperformedEndpoint.getEditWorkPerformedEndpoint<WorkPerformed>(workPerformedId);
    }

    updateWorkPerformed(workperformed) {
        return this.workperformedEndpoint.getUpdateWorkPerformedEndpoint(workperformed, workperformed.workPerformedId);
    }

    deleteWorkPerformed(workPerformedId: number) {

        return this.workperformedEndpoint.getDeleteWorkPerformedEndpoint(workPerformedId);
    }
    
    getWorkPerformedAudit(workPerformedId: number) {
        return this.workperformedEndpoint.getWorkPerformedAuditById<any>(workPerformedId);
    }

}

