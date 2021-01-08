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

import { FindingEndpoint } from './finding-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Finding } from '../models/finding.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class FindingService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private findingEndpoint: FindingEndpoint) { }

    getFindingList() {
        return Observable.forkJoin(
            this.findingEndpoint.getFindingEndpoint<Finding[]>());
    }
    newAction(action: Finding) {
        return this.findingEndpoint.getNewGatecodeEndpoint<Finding>(action);
    }

    getAction(actionId?: any) {
        return this.findingEndpoint.getEditActionEndpoint<Finding>(actionId);
    }

    updateAction(action: Finding) {
        return this.findingEndpoint.getUpdateActionEndpoint(action, action.findingId);
    }

    deleteAcion(actionId: any) {

        return this.findingEndpoint.getDeleteActionEndpoint(actionId);

    }
    historyAcion(actionId: number) {
        return Observable.forkJoin(this.findingEndpoint.getHistoryActionEndpoint<AuditHistory[]>(actionId));
    }

    getAuditById(findingId: number) {
        return this.findingEndpoint.getAuditById<any[]>(findingId);
    }

}