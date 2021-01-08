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

import { ActionEndpoint } from './action-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { TaskAttributeEndpointService } from './taskattribute-endpoint';
import { TaskAttribute } from '../models/taskattribute.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class TaskAttributeService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private actionEndpoint: TaskAttributeEndpointService) { }

    getWorkFlows() {
        return Observable.forkJoin(
            this.actionEndpoint.getActionattributeEndpoint<TaskAttribute[]>());
    }
    newAction(action) {
        return this.actionEndpoint.getNewGatecodeEndpoint<TaskAttribute>(action);
    }

    getAction(actionId?: number) {
        return this.actionEndpoint.getEditActionEndpoint<TaskAttribute>(actionId);
    }

    updateAction(action) {
        return this.actionEndpoint.getUpdateActionEndpoint(action, action.actionAttributeId);
    }

    deleteAcion(taskAttributeId: number, updatedBy: string) {

        return this.actionEndpoint.getDeleteActionEndpoint(taskAttributeId, updatedBy);

    }
    historyAcion(actionId: number) {
        return Observable.forkJoin(this.actionEndpoint.getHistoryActionEndpoint<AuditHistory[]>(actionId));
    }

    getTaskAttributeAuditeDetails(taskAttributeId: number) {
        return this.actionEndpoint.getTaskAttributeAuditeDetails<any[]>(taskAttributeId);
    }

}