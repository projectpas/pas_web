
import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Master1099Endpoint } from './master-1099-endpoint.services';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

import { AuditHistory } from '../models/audithistory.model';
// { GlCashFlowClassification } from '../models/glcashflowclassification.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class Master1099Service {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,

        private master1099Endpoint: Master1099Endpoint) { }

    getWorkFlows() {
        return Observable.forkJoin(
            this.master1099Endpoint.getMaster1099Endpoint<any[]>());
    }

    search(serverSidePagesData: any) {
        return Observable.forkJoin(
            this.master1099Endpoint.getMaster1099searchEndpoint<any[]>(serverSidePagesData));
    }

    historyGlCashFlowClassification(master1099Id: number) {
        return Observable.forkJoin(this.master1099Endpoint.getHistoryMaster1099Endpoint<AuditHistory[]>(master1099Id));
    }

    newGlCashFlowClassification(glclassflowclassification: any) {
        return this.master1099Endpoint.getNewMaster1099Endpoint<any>(glclassflowclassification);
    }

    getCashFlowClassification(master1099Id?: number) {
        return this.master1099Endpoint.getEditMaster1099Endpoint<any>(master1099Id);
    }

    updateMaster1099(glclassflowclassification: any) {
        return this.master1099Endpoint.getUpdateMaster1099Endpoint(glclassflowclassification, glclassflowclassification.master1099Id);
    }

    deleteMaster1099(master1099Id: number) {

        return this.master1099Endpoint.getDeleteMaster1099Endpoint(master1099Id);

    }

    getMaster1099AuditDetails(Id: number) {
        return this.master1099Endpoint.getMaster1099AuditDetails<any[]>(Id);
    }

    master1099FileUpload(file) {
        return this.master1099Endpoint.master1099FileUpload(file);
    }


    getServerPages(serverSidePagesData: any) {
        return Observable.forkJoin(
            this.master1099Endpoint.getMaster1099Records<any[]>(serverSidePagesData));
    }
}