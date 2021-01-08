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

import { JobTitleEndpontService } from './job-title-endpoint.service';
import { JobTitle } from '../models/jobtitle.model';
import { JobType } from '../models/jobtype.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class JobTitleService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private jobTitleEndpoint: JobTitleEndpontService) { }

    getAllJobTitleList() {
        return forkJoin(
            this.jobTitleEndpoint.getJobtitleEndpoint<any>());
    }

    
    newJobTitle(action) {
        return this.jobTitleEndpoint.getNewjobtitleEndpoint<any>(action);
    }

    getAction(actionId?: number) {
        return this.jobTitleEndpoint.getEditJobTitleEndpoint<JobTitle>(actionId);
    }

    updateAction(action) {     
        return this.jobTitleEndpoint.getUpdateJobtitleEndpoint(action, action.jobTitleId);
    }

    deleteAcion(actionId: number) {

		return this.jobTitleEndpoint.getDeleteJobTitleEndpoint(actionId);

    }

	historyJobTitle(actionId: number) {
		return forkJoin(this.jobTitleEndpoint.getHistoryJobTitleEndpoint<AuditHistory[]>(actionId));
    }

    
    getJobTitleAudit(jobTitleId: number) {
        return this.jobTitleEndpoint.getJobTitleAuditById<any>(jobTitleId);
    }


}