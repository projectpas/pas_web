// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




import { WorkScopeEndpointService } from './workscope-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { WorkScope } from '../models/workscope.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class WorkScopeService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private workscopeEndpoint: WorkScopeEndpointService) { }

    getWorkScopeList() {
        return forkJoin(
            this.workscopeEndpoint.getWorkScopeEndpoint<WorkScope[]>());
    }
    newWorkScope(workscope) {
        return this.workscopeEndpoint.getNewWorkScopeEndpoint<WorkScope>(workscope);
    }

    historyWorkScope(workScopeId: number) {
        return forkJoin(this.workscopeEndpoint.getHistoryWorkScopeEndpoint<AuditHistory[]>(workScopeId));
    }

    getWorkScope(workScopeId?: number) {
        return this.workscopeEndpoint.getEditWorkScopeEndpoint<WorkScope>(workScopeId);
    }

    updateWorkScope(workscope) {
        return this.workscopeEndpoint.getUpdateWorkScopeEndpoint(workscope, workscope.workScopeId);
    }

    deleteWorkScope(workScopeId: number,updatedBy: string) {

        return this.workscopeEndpoint.
        getDeleteWorkScopeEndpoint(workScopeId,updatedBy);

    }

    getWorkScopeAuditDetails(Id: number) {
        return this.workscopeEndpoint.getWorkScopeAuditDetails<any[]>(Id);
    }

}

