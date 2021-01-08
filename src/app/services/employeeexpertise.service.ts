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


import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';


import { EmployeeExpertiseEndpointService } from './employeeexpertise-endpoint.service';
import { EmployeeExpertise } from '../models/employeeexpertise.model';
import { AuditHistory } from '../models/audithistory.model';


export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class EmployeeExpertiseService {

    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private employeeexpertiseEndpoint: EmployeeExpertiseEndpointService) { }

    getWorkFlows() {
        return Observable.forkJoin(
            this.employeeexpertiseEndpoint.getEmployeeExpertiseEndpoint<EmployeeExpertise[]>());
    }

    newAction(action) {
        return this.employeeexpertiseEndpoint.getNewEmployeeExpertiseEndpoint<EmployeeExpertise>(action);
    }

    getAction(actionId?: number) {
        return this.employeeexpertiseEndpoint.getEditActionEndpoint<EmployeeExpertise>(actionId);
    }

    updateAction(action: any) {
        return this.employeeexpertiseEndpoint.getUpdateActionEndpoint(action, action.employeeExpertiseId);
    }

    deleteAcion(actionId: number) {

        return this.employeeexpertiseEndpoint.getDeleteActionEndpoint(actionId);

    }
    historyAcion(actionId: number) {
        return this.employeeexpertiseEndpoint.getHistoryActionEndpoint<AuditHistory[]>(actionId);
    }
    getAudit(employeeExpertiseId: number) {
        return this.employeeexpertiseEndpoint.getAuditById<any[]>(employeeExpertiseId);
    }

    EmployeeExpertiseFileUpload(file) {
        return this.employeeexpertiseEndpoint.EmployeeExpertiseFileUploadCustomUpload(file);
    }

}