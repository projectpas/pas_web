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

import { PriorityEndpointService } from './priority-endpoint.service';
import { Priority } from '../models/priority.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class PriorityService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private priorityEndpoint: PriorityEndpointService) { }

    getPriorityList() {
        return forkJoin(
            this.priorityEndpoint.getPriorityEndpoint<Priority[]>());
    }

    newPriority(priority) {
        return this.priorityEndpoint.getNewPriorityEndpoint<Priority>(priority);
    }

    getPriority(priorityId?: number) {
        return this.priorityEndpoint.getEditPriorityEndpoint<Priority>(priorityId);
    }

    updatePriority(priority) {
        return this.priorityEndpoint.getUpdatePriorityEndpoint(priority, priority.priorityId);
    }

    deletePriority(priorityId: number) {

        return this.priorityEndpoint.getDeletePriorityEndpoint(priorityId);

    }
    historyPriority(priorityId: number) {
        return this.priorityEndpoint.getHistoryPriorityEndpoint<any[]>(priorityId);
    } 
    getPriorityAudit(priorityId: number) {
        return this.priorityEndpoint.getPrioriryAuditById<any[]>(priorityId);
    }
}