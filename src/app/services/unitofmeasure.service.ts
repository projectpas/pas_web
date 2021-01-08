// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




import { UnitOfMeasureEndpoint } from './unitofmeasure-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { UnitOfMeasure } from '../models/unitofmeasure.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class UnitOfMeasureService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private unitofmeasureEndpoint: UnitOfMeasureEndpoint) { }

    getUnitOfMeasureList() {
        return forkJoin(
            this.unitofmeasureEndpoint.getUnitOfMeasureEndpoint<UnitOfMeasure[]>());
    }
    getAllUnitofMeasureList() {
        return forkJoin(
            this.unitofmeasureEndpoint.getAllUnitOfMeasureEndpoint<any>());
    }
    newUnitOfMeasure(unitofmeasure) {
        return this.unitofmeasureEndpoint.getNewUnitOfMeasureEndpoint<UnitOfMeasure>(unitofmeasure);
    }

    historyUnitOfMeasure(unitofmeasureId: number) {
        return forkJoin(this.unitofmeasureEndpoint.getHistoryUnitOfMeasureEndpoint<AuditHistory[]>(unitofmeasureId));
    }

    getUnitOfMeasure(unitofmeasureId?: number) {
        return this.unitofmeasureEndpoint.getEditUnitOfMeasureEndpoint<UnitOfMeasure>(unitofmeasureId);
    }

    updateUnitOfMeasure(unitofmeasure) {
        return this.unitofmeasureEndpoint.getUpdateUnitOfMeasureEndpoint(unitofmeasure, unitofmeasure.unitOfMeasureId);
    }

    deleteUnitOfMeasure(unitofmeasureId: number) {

        return this.unitofmeasureEndpoint.getDeleteUnitOfMeasureEndpoint(unitofmeasureId);

    }

    getUnitOfWorkAuditDetails(Id: number) {
        return this.unitofmeasureEndpoint.getUnitOfWorkAuditDetails<any[]>(Id);
    }

    getServerPages(serverSidePagesData: any) {
        return forkJoin(
            this.unitofmeasureEndpoint.getUnitOfMeasurePages<any[]>(serverSidePagesData));
    }
    UOMFileUpload(file){
        return this.unitofmeasureEndpoint.UOMCustomUpload(file);
    }

}