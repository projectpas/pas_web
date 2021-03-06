﻿import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { AuthService } from './auth.service';
import { Role } from '../models/role.model';
import { Percent } from '../models/Percent.model';
import { PercentEndpoint } from './percent-endpoint.service';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class PercentService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private percentEndpoint: PercentEndpoint) { }

    getPercentages() {
        return Observable.forkJoin(
            this.percentEndpoint.getAllPercentages<Percent[]>());
    }

    newPercentage(action: any) {
        return this.percentEndpoint.getNewGatecodeEndpoint<any>(action);
    }

    historyAcion(actionId: number) {
        return this.percentEndpoint.getHistoryActionEndpoint<any[]>(actionId);
    }
  

    updatePercentage(action: any) {
        return this.percentEndpoint.getUpdatePercentageEndpoint(action, action.percentId);
    }

    deletePercentage(actionId: any,updatedBy: string) {

        return this.percentEndpoint.getDeletePercentEndpoint
        (actionId,updatedBy);

    }

}