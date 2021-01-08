// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';





import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

import { JobTypeEndpontService } from './job-type-endpoint.service';

import { JobType } from '../models/jobtype.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class JobTypeService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private jobTypeEndpoint: JobTypeEndpontService) { }

  


    getAllJobTypeList() {
        return forkJoin(
            this.jobTypeEndpoint.getJobtypeEndpoint<any>());
    }
    newJobType(action) {
        return this.jobTypeEndpoint.addNewJobtype<JobType>(action);
    }


    updateAction(action) {
        return this.jobTypeEndpoint.updateJobType(action, action.jobTypeId);
    }

    deleteAcion(actionId: number) {

        return this.jobTypeEndpoint.getDeleteJobTypeEndpoint(actionId);

    }


    getJobTypeAudit(jobTypeId: number) {
        return this.jobTypeEndpoint.getJobTypeAuditById<any>(jobTypeId);
    }

 

   



}