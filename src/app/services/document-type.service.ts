import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';


import { AuthService } from './auth.service';
import { Role } from '../models/role.model';
import { Integration } from '../models/integration.model';

import { DocumentTypeEndpointService } from './document-type-endpoint.service';


export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class DocumentTypeService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private documentTypeEndpointService: DocumentTypeEndpointService) { }

    getWorkFlows() {
        return Observable.forkJoin(
            this.documentTypeEndpointService.getDocumentTypeEndpoint<Integration[]>());
    }
    getAllWorkFlows() {
        return Observable.forkJoin(
            this.documentTypeEndpointService.getAllDocumentTypeEndpoint<Integration[]>());
    }



    newAction(action) {
        return this.documentTypeEndpointService.getNewActionEndpoint<Integration>(action);
    }

    getIntegrationsBasic() {
        return this.documentTypeEndpointService.getDocumentTypeLiteEndpoint<any[]>();
    }

    updateAction(action) {
        return this.documentTypeEndpointService.getUpdateActionEndpoint(action, action.documentTypeId);
    }

    deleteAcion(actionId: number, updatedBy: string) {

        return this.documentTypeEndpointService.getDeleteActionEndpoint(actionId, updatedBy);

    }
    historyintegration(actionId: number) {
        return this.documentTypeEndpointService.getHistoryDocumentTypeEndpoint<any[]>(actionId);
    }
    getAudit(tagTypeId: number) {
        return this.documentTypeEndpointService.getAuditById<any[]>(tagTypeId);
    }

    IntegrationCustomUpload(file) {
        return this.documentTypeEndpointService.DocumentTypeCustomUpload(file);
    }
}