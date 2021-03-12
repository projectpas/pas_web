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

import { CreditTermsEndpoint } from './Credit Terms-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { CreditTerms } from '../models/credit-terms.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class CreditTermsService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private CreditTermsEndpoint: CreditTermsEndpoint) { }

    getCreditTermsList(masterCompanyId?) {
        return Observable.forkJoin(
            this.CreditTermsEndpoint.getCreditTermsEndpoint<any>(masterCompanyId));
    }

    newAddcreditterms(action) {
        return this.CreditTermsEndpoint.getNewCreditermEndpoint<CreditTerms>(action);
    }

    updatecreditterms(action: any) {
        return this.CreditTermsEndpoint.getUpdatecredittermsEndpoint(action, action.creditTermsId);
    }

    deletecreditterms(actionId: number) {

        return this.CreditTermsEndpoint.getDeletecredittermsEndpoint(actionId);

    }

    historycreditterms(actionId: number) {
        return Observable.forkJoin(this.CreditTermsEndpoint.getHistorycredittermsEndpoint<AuditHistory[]>(actionId));
    }

    getCreditTermsAudit(credittermId: number) {
        return this.CreditTermsEndpoint.getCreaditTermsAuditById<any>(credittermId);
    }

    creditTermsCustomUpload(file) {
        return this.CreditTermsEndpoint.creditTermsCustomUpload(file);
    }

}