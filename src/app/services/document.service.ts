// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




//import { ActionEndpoint } from './action-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
//import { Action } from '../models/action.model';
import { AuditHistory } from '../models/audithistory.model';
import { DocumentEndpointService } from './document-endpoint.service';
import { DocumentModel } from '../models/document.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class DocumentService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private documentEndpoint: DocumentEndpointService) { }

    getWorkFlows() {
        return forkJoin(
            this.documentEndpoint.getActionEndpoint<DocumentModel[]>());
    }

    historyAcion(actionId: number) {
        return forkJoin(this.documentEndpoint.getHistoryActionEndpoint<AuditHistory[]>(actionId));
    }

    newAction(action: DocumentModel) {
        return this.documentEndpoint.getNewActionEndpoint<DocumentModel>(action);
    }

    getAction(actionId?: number) {
        return this.documentEndpoint.getEditActionEndpoint<DocumentModel>(actionId);
    }

    updateAction(action: DocumentModel) {
        return this.documentEndpoint.getUpdateActionEndpoint(action, action.documentId);
    }

    deleteAcion(actionId: number) {

        return this.documentEndpoint.getDeleteActionEndpoint(actionId);

    }

    getAudit(documentId: number) {
        return this.documentEndpoint.getAuditById<any[]>(documentId);
    }
    getServerPages(serverSidePagesData: any) {
        return forkJoin(
            this.documentEndpoint.getDocumentRecords<Document[]>(serverSidePagesData));
    }


}