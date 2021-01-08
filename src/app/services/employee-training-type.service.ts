import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';


import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';


import { EmployeeTrainingTypeEndpointService } from './employee-training-type-endpoint.service';
import { EmployeeExpertise } from '../models/employeeexpertise.model';
import { AuditHistory } from '../models/audithistory.model';


export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class EmployeeTrainingTypeService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private employeeTrainingTypeEndpointService: EmployeeTrainingTypeEndpointService) { }

    getWorkFlows() {
        return Observable.forkJoin(
            this.employeeTrainingTypeEndpointService.getEmployeeExpertiseEndpoint<EmployeeExpertise[]>());
    }

    newAction(action) {
        return this.employeeTrainingTypeEndpointService.getNewEmployeeExpertiseEndpoint<any>(action);
    }

    getAction(actionId?: number) {
        return this.employeeTrainingTypeEndpointService.getEditActionEndpoint<EmployeeExpertise>(actionId);
    }

    updateAction(action: any) {
        return this.employeeTrainingTypeEndpointService.getUpdateActionEndpoint(action, action.employeeTrainingTypeId);
    }

    deleteAcion(actionId: number,updatedBy: string) {

        return this.employeeTrainingTypeEndpointService.
        getDeleteActionEndpoint(actionId,updatedBy);

    }
    historyAcion(actionId: number) {
        return Observable.forkJoin(this.employeeTrainingTypeEndpointService.getHistoryActionEndpoint<AuditHistory[]>(actionId));
    }
    getAudit(employeeExpertiseId: number) {
        return this.employeeTrainingTypeEndpointService.getAuditById<any[]>(employeeExpertiseId);
    }

    EmployeeExpertiseFileUpload(file) {
        return this.employeeTrainingTypeEndpointService.EmployeeExpertiseFileUploadCustomUpload(file);
    }

    getSearchData(serverSidePagesData: any)
  {
      return Observable.forkJoin(
          this.employeeTrainingTypeEndpointService.SearchData<any[]>(serverSidePagesData));
  }
}