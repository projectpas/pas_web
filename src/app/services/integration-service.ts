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
import { Action } from '../models/action.model';
import { IntegrationEndpointService } from './integration.endpoint-service';
import { Integration } from '../models/integration.model';
import { AuditHistory } from '../models/audithistory.model';


export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class IntegrationService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private integrationEndpointService: IntegrationEndpointService) { }

    getWorkFlows() {
        return forkJoin(
            this.integrationEndpointService.getIntegrationEndpoint<Integration[]>());
    }
    getAllWorkFlows() {
        return forkJoin(
            this.integrationEndpointService.getAllIntegrationEndpoint<Integration[]>());
    }



    newAction(action) {
        return this.integrationEndpointService.getNewActionEndpoint<Integration>(action);
    }

    getIntegrationsBasic() {
        return this.integrationEndpointService.getIntegrationLiteEndpoint<any[]>();
    }

    updateAction(action) {
        return this.integrationEndpointService.getUpdateActionEndpoint(action, action.integrationPortalId);
    }

    deleteAcion(actionId: number) {

        return this.integrationEndpointService.getDeleteActionEndpoint(actionId);

    }
    historyintegration(actionId: number) {
        return this.integrationEndpointService.getHistoryintegrationEndpoint<any[]>(actionId);
    }
    getAudit(integrationPortalId: number) {
        return this.integrationEndpointService.getAuditById<any[]>(integrationPortalId);
    }

    IntegrationCustomUpload(file) {
        return this.integrationEndpointService.IntegrationCustomUpload(file);
    }
}