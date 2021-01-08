import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { ShipViaEndpoint } from './shipVia-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Condition } from '../models/condition.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class ShipViaService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private shipViaEndpoint: ShipViaEndpoint) { }

    getAllShipViaList() {
        return Observable.forkJoin(
            this.shipViaEndpoint.getAllShipViaListEndpoint<any>());
    }
    newAddShipvia(action) {
        return this.shipViaEndpoint.getNewShipviaEndpoint(action);
    }
    updateShipvia(action) {
        return this.shipViaEndpoint.getUpdateShipviaEndpoint(action, action.shippingViaId);
    }
    deleteShipvia(actionId: number, updatedBy: string) {
        return this.shipViaEndpoint.getDeleteShipviaEndpoint(actionId, updatedBy);
    }
    updateShipviaStatus(actionId: number, status, updatedBy: string) {
        return this.shipViaEndpoint.getShipviaStatusEndpoint(actionId, status, updatedBy);
    }   
    getShipViaAudit(id: number) {
        return this.shipViaEndpoint.getShipViaAuditEndpoint<any[]>(id);
    }
    shipviaCustomUpload(file) {
        return this.shipViaEndpoint.shipviaCustomUpload(file);
    }
}