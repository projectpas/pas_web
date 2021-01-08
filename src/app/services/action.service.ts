// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject, forkJoin} from 'rxjs';




import { ActionEndpoint } from './action-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Action } from '../models/action.model';
import { AuditHistory } from '../models/audithistory.model';
export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class ActionService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";
	
    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private actionEndpoint: ActionEndpoint) { }

    getWorkFlows() {
        return forkJoin(
            this.actionEndpoint.getActionEndpoint<Action[]>());
    }

    historyAcion(actionId: number) {
        return forkJoin(this.actionEndpoint.getHistoryActionEndpoint<any>(actionId));
    }

    newAction(action) {
        return this.actionEndpoint.getNewActionEndpoint<Action>(action);
    }

    getAction(actionId?: number) {
        return this.actionEndpoint.getEditActionEndpoint<Action>(actionId);
    }

    updateAction(action) {     
            return this.actionEndpoint.getUpdateActionEndpoint(action, action.taskId);
    }

    deleteAcion(actionId: number) {

        return this.actionEndpoint.getDeleteActionEndpoint(actionId);

    }

    getTaskAuditDetails(actionId: number) {
        return this.actionEndpoint.getTaskAuditDetails<any[]>(actionId);
    }
  
}