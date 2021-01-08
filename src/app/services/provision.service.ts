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

import { ProvisionEndpoint } from './provision-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Provision } from '../models/provision.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class ProvisionService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private provisionEndpoint: ProvisionEndpoint) { }

    getProvisionList() {
        return Observable.forkJoin(
            this.provisionEndpoint.getProvisionEndpoint<Provision[]>());
    }
    newProvision(provision) {
        return this.provisionEndpoint.getNewProvisionEndpoint<Provision>(provision);
    }

    historyProvision(provisionId: number) {
        return Observable.forkJoin(this.provisionEndpoint.getHistoryProvisionEndpoint<AuditHistory[]>(provisionId));
    }

    getProvision(provisionId?: number) {
        return this.provisionEndpoint.getEditProvisionEndpoint<Provision>(provisionId);
    }

    updateProvision(provision) {
        return this.provisionEndpoint.getUpdateProvisionEndpoint(provision, provision.provisionId);
    }

    deleteProvision(provisionId: number) {

        return this.provisionEndpoint.getDeleteProvisionEndpoint(provisionId);
    }

    getProvisionAudit(provisionId: number) {
        return this.provisionEndpoint.getProvisionAuditById<any>(provisionId);
    }
    provisionFileUpload(file) {
        return this.provisionEndpoint.provisionCustomUpload(file);
    }

}

