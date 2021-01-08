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

import { VendorClassificationEndpoint } from './vendorclassification-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { VendorClassification } from '../models/vendorclassification.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class VendorClassificationService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private vendorclassificationEndpoint: VendorClassificationEndpoint) { }

    getVendorClassificationEndpointList() {
        return Observable.forkJoin(
            this.vendorclassificationEndpoint.getVendorClassificationEndpoint<any>());
    }

    getActiveVendorClassificationEndpointList() {
        return Observable.forkJoin(
            this.vendorclassificationEndpoint.getActiveVendorClassificationEndpoint<any>());
    }

    getAllVendorClassificationList() {
        return Observable.forkJoin(
            this.vendorclassificationEndpoint.getAllVendorClassificationEndpoint<any>());
    }

    newVendorClassification(vendorclassification) {
        return this.vendorclassificationEndpoint.getNewVendorClassificationEndpoint<VendorClassification>(vendorclassification);
    }

    historyVendorClassification(vendorclassificationId: number) {
        return Observable.forkJoin(this.vendorclassificationEndpoint.getHistoryVendorClassificationEndpoint<AuditHistory[]>(vendorclassificationId));
    }

    getVendorClassification(vendorclassificationId?: number) {
        return this.vendorclassificationEndpoint.getEditVendorClassificationEndpoint<VendorClassification>(vendorclassificationId);
    }

    updateVendorClassification(vendorclassification) {
        return this.vendorclassificationEndpoint.getUpdateVendorClassificationEndpoint(vendorclassification, vendorclassification.vendorClassificationId);
    }

    deleteVendorClassification(vendorclassificationId: number) {

        return this.vendorclassificationEndpoint.getDeleteVendorClassificationEndpoint(vendorclassificationId);

    }
    getVendorClassificationAudit(vendorclassificationId: number) {
        return this.vendorclassificationEndpoint.getVendorClassificationDataAuditById<any>(vendorclassificationId);
    }

}



