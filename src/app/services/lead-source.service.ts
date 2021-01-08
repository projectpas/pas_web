import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';



import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Action } from '../models/action.model';
import { Integration } from '../models/integration.model';
import { AuditHistory } from '../models/audithistory.model';
import { LeadSourceEndpointService } from './lead-source-endpoint.service';


export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class LeadSourceService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private leadSourceEndpointService: LeadSourceEndpointService) { }

    getWorkFlows() {
        return forkJoin(
            this.leadSourceEndpointService.getLeadSourceEndpoint<Integration[]>());
    }
    getAllWorkFlows() {
        return forkJoin(
            this.leadSourceEndpointService.getAllLeadSourceEndpoint<Integration[]>());
    }



    newAction(action) {
        return this.leadSourceEndpointService.getNewActionEndpoint<Integration>(action);
    }

    getIntegrationsBasic() {
        return this.leadSourceEndpointService.getLeadSourceLiteEndpoint<any[]>();
    }

    updateAction(action) {
        return this.leadSourceEndpointService.getUpdateActionEndpoint(action, action.leadSourceId);
    }

    deleteAcion(actionId: number) {

        return this.leadSourceEndpointService.getDeleteActionEndpoint(actionId);

    }
    historyintegration(actionId: number) {
        return this.leadSourceEndpointService.getHistoryLeadSourceEndpoint<any[]>(actionId);
    }
    getAudit(leadSourceId: number) {
        return this.leadSourceEndpointService.getAuditById<any[]>(leadSourceId);
    }

    IntegrationCustomUpload(file) {
        return this.leadSourceEndpointService.LeadSourceCustomUpload(file);
    }
}