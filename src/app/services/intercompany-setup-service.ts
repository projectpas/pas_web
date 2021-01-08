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
import { InterCompanySetupEndPointService } from '../services/intercompany-setup-endpoint.service';

import { AuthService } from './auth.service';
import { Role } from '../models/role.model';
import { InterCompanySetup } from '../models/intercompany-setup.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class InterCompanySetupService {

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private interCompanySetupEndPointService: InterCompanySetupEndPointService) { }

    getIntercompanySetupList<T>() {
        return this.interCompanySetupEndPointService.getInterCompanySetupList<InterCompanySetup[]>();
    }

    addInterCompanySetup<T>(interCompanySetupDetails: InterCompanySetup): Observable<T> {
        return this.interCompanySetupEndPointService.addInterCompanySetup<T>(interCompanySetupDetails);
    }

    updateInterCompanySetup<T>(interCompanySetupDetails: InterCompanySetup): Observable<T> {
        return this.interCompanySetupEndPointService.updateInterCompanySetup<T>(interCompanySetupDetails);
    }

    removeInterCompanySetup<T>(Id: number): Observable<T> {
        return this.interCompanySetupEndPointService.removeInterCompanySetup<T>(Id);
    }
}