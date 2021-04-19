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

import { ConditionEndpoint } from './condition-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Condition } from '../models/condition.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class ConditionService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private conditionEndpoint: ConditionEndpoint) { }

    getConditionList(masterCompanyId: number = 1) {
        return Observable.forkJoin(
            this.conditionEndpoint.getConditionEndpoint<Condition[]>(masterCompanyId));
    }
    getAllConditionList() {
        return Observable.forkJoin(
            this.conditionEndpoint.getAllConditionEndpoint<any>());
    }
    newAddCondition(action) {
        return this.conditionEndpoint.getNewConditionEndpoint<Condition>(action);
    }
    updateCondition(action) {
        return this.conditionEndpoint.getUpdateConditionEndpoint(action, action.conditionId);
    }
    deleteCondition(actionId: number) {

        return this.conditionEndpoint.getDeleteConditionEndpoint(actionId);

    }
    historyCondition(actionId: number) {
        return Observable.forkJoin(this.conditionEndpoint.getHistoryConditionEndpoint<AuditHistory[]>(actionId));
    }
    
    getConditionAudit(conditionId: number) {
        return this.conditionEndpoint.getConditionAuditById<any[]>(conditionId);
    }

    ConditionCustomUpload(file) {
        return this.conditionEndpoint.ConditionCustomUpload(file);
    }

}