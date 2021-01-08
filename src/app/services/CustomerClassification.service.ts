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

import { CustomerClassificationEndpoint } from './Customer Classification -endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { CustomerClassification } from '../models/customer-classification.model';
import { AuditHistory } from '../models/audithistory.model';
import { DiscountValue } from '../models/discountvalue';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class CustomerClassificationService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private CustomerClassificationEndpoint: CustomerClassificationEndpoint) { }

    getCustomerClassificationList() {
        return Observable.forkJoin(
            this.CustomerClassificationEndpoint.getCustomerClassificationEndpoint<CustomerClassification[]>());
    }
    newAddcustomerclass(action) {
        return this.CustomerClassificationEndpoint.getNewCustomerClassification<CustomerClassification>(action);
    }
    updatecustomerclass(action: CustomerClassification) {
        return this.CustomerClassificationEndpoint.getupdateCustomerClassification(action, action.customerClassificationId);
    }
    deletecustomerclass(actionId: number) {

        return this.CustomerClassificationEndpoint.getdeleteCustomerClassification(actionId);

    }
    historycustomerclass(actionId: number) {
        return Observable.forkJoin(this.CustomerClassificationEndpoint.getHistoryCustomerClassification<AuditHistory[]>(actionId));
    }

    getCustomerclassification(CustomerClassificationId: number) {
        return this.CustomerClassificationEndpoint.getAuditCustomerClassification<any[]>(CustomerClassificationId);
    }

}