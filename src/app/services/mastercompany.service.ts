// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject} from 'rxjs';




import { MasterCompanyEndpoint } from './mastercompany-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { MasterCompany } from '../models/mastercompany.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };
import {forkJoin} from 'rxjs';
@Injectable()
export class MasterComapnyService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private masterCompanyEndpoint: MasterCompanyEndpoint) { }

    getMasterCompanies() {
        return forkJoin(
            this.masterCompanyEndpoint.getMasterCompanyEndpoint<MasterCompany[]>());
    }



}