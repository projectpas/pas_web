// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




import { TaxRateEndpointService } from './taxrate-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { TaxRate } from '../models/taxrate.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class TaxRateService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private taxRateEndpoint: TaxRateEndpointService) { }

    getTaxRateList() {
        return forkJoin(
            this.taxRateEndpoint.getTaxRateEndpoint<TaxRate[]>());
    }

    newTaxRate(taxrate) {
        return this.taxRateEndpoint.getNewTaxRateEndpoint(taxrate);
    }

    historyTaxRate(taxrateId: number) {
        return forkJoin(this.taxRateEndpoint.getHistoryTaxRateEndpoint<AuditHistory[]>(taxrateId));
    }

    getTaxRate(taxrateId?: number) {
        return this.taxRateEndpoint.getEditTaxRateEndpoint<TaxRate>(taxrateId);
    }

    updateTaxRate(taxrate: TaxRate) {
        return this.taxRateEndpoint.getUpdateTaxRateEndpoint(taxrate, taxrate.taxRateId);
    }

    deleteTaxRate(taxrateId: number) {

        return this.taxRateEndpoint.getDeleteTaxRateEndpoint(taxrateId);
    }
    getTaxRateAudit(taxrateId: number) {
        return this.taxRateEndpoint.getTaxRateAuditById<any>(taxrateId);
    }
    getServerPages(serverSidePagesData: any) {
        return forkJoin(
            this.taxRateEndpoint.getTaxRateRecords<TaxRate[]>(serverSidePagesData));
    }
}