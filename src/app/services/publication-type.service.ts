import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';





import { AuthService } from './auth.service';
import { Role } from '../models/role.model';
import { PublicationType } from '../models/publicationtype.model';

import { publicationTypeEndpointService } from './publication-type-endpoint.service';


export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class publicationTypeService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private publicationTypeEndpointService: publicationTypeEndpointService) { }

    getWorkFlows() {
        return forkJoin(
            this.publicationTypeEndpointService.getDocumentTypeEndpoint<PublicationType[]>());
    }
    getAllWorkFlows() {
        return forkJoin(
            this.publicationTypeEndpointService.getAllDocumentTypeEndpoint<PublicationType[]>());
    }



    newAction(action) {
        return this.publicationTypeEndpointService.getNewActionEndpoint<PublicationType>(action);
    }

    getIntegrationsBasic() {
        return this.publicationTypeEndpointService.getDocumentTypeLiteEndpoint<any[]>();
    }

    updateAction(action) {
        return this.publicationTypeEndpointService.getUpdateActionEndpoint(action, action.publicationTypeId);
    }

    deleteAcion(actionId: number, updatedBy: string) {

        return this.publicationTypeEndpointService.getDeleteActionEndpoint(actionId, updatedBy);

    }
    historyintegration(actionId: number) {
        return this.publicationTypeEndpointService.getHistoryDocumentTypeEndpoint<any[]>(actionId);
    }
    //getAudit(tagTypeId: number) {
    //    return this.publicationTypeEndpointService.getAuditById<any[]>(tagTypeId);
    //}   
}