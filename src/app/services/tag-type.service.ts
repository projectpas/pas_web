import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';





import { AuthService } from './auth.service';
import { Role } from '../models/role.model';
import { Integration } from '../models/integration.model';

import { TagTypeEndpointService } from './tag-type-endpoint.service';


export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class TagTypeService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private tagTypeEndpointService: TagTypeEndpointService) { }

    getWorkFlows() {
        return forkJoin(
            this.tagTypeEndpointService.getTagTypeEndpoint<Integration[]>());
    }
    getAllWorkFlows() {
        return forkJoin(
            this.tagTypeEndpointService.getAllTagTypeEndpoint<Integration[]>());
    }



    newAction(action) {
        return this.tagTypeEndpointService.getNewActionEndpoint<Integration>(action);
    }

    getIntegrationsBasic() {
        return this.tagTypeEndpointService.getTagTypeLiteEndpoint<any[]>();
    }

    updateAction(action) {
        return this.tagTypeEndpointService.getUpdateActionEndpoint(action, action.tagTypeId);
    }

    deleteAcion(actionId: number, updatedBy: string) {

        return this.tagTypeEndpointService.getDeleteActionEndpoint(actionId, updatedBy);

    }
    historyintegration(actionId: number) {
        return this.tagTypeEndpointService.getHistoryTagTypeEndpoint<any[]>(actionId);
    }
    getAudit(tagTypeId: number) {
        return this.tagTypeEndpointService.getAuditById<any[]>(tagTypeId);
    }

    IntegrationCustomUpload(file) {
        return this.tagTypeEndpointService.TagTypeCustomUpload(file);
    }
}