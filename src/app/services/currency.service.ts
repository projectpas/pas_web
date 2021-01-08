// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




import { CurrencyEndpoint } from './currency-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Currency } from '../models/currency.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class CurrencyService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private currencyEndpoint: CurrencyEndpoint) { }

    getCurrencyList() {
        return forkJoin(
            this.currencyEndpoint.getCurrencyEndpoint<Currency[]>());
    }

    getCurrencyListAll() {
        return forkJoin(
            this.currencyEndpoint.getAllCurrencyEndpoint<Currency[]>());
    }
    getCountryListAll() {
        return forkJoin(
            this.currencyEndpoint.getCountryEndpoint<any[]>());
    }

    newAddcurrency(action: any) {
        return this.currencyEndpoint.getNewCurrencyEndpoint<Currency>(action);
    }
    updatecurrency(action: any) {
        return this.currencyEndpoint.getUpdatecurrencyEndpoint(action, action.currencyId);
    }
    deletecurrency(actionId: number) {

        return this.currencyEndpoint.getDeletecurrencyEndpoint(actionId);

    }
    historycurrency(actionId: number) {
        return forkJoin(this.currencyEndpoint.getHistorycurrencyEndpoint<AuditHistory[]>(actionId));
    }
    
    getCurrencyAudit(currencyId: number) {
        return this.currencyEndpoint.getCurrencyDataAuditById<any>(currencyId);
    }

    getServerPages(serverSidePagesData: any) {
        return forkJoin(
            this.currencyEndpoint.getCurrencyRecords<Currency[]>(serverSidePagesData));
    }

    currencyFileUpload(file) {
        return this.currencyEndpoint.currencyFileUploadCustomUpload(file);
    }
}