
import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




import { GlCashFlowClassificationEndpoint } from './gl-cash-flow-classification-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';

import { AuditHistory } from '../models/audithistory.model';
import { GlCashFlowClassification } from '../models/glcashflowclassification.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class GlCashFlowClassificationService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,

        private glCashFlowClassificationEndpoint: GlCashFlowClassificationEndpoint) { }

    getWorkFlows() {
        return forkJoin(
            this.glCashFlowClassificationEndpoint.getGlCashFlowClassificationEndpoint<any[]>());
    }

    search(serverSidePagesData: any) {
        return forkJoin(
            this.glCashFlowClassificationEndpoint.getGlCashFlowClassificationsearchEndpoint<any[]>(serverSidePagesData));
    }

    historyGlCashFlowClassification(glclassflowclassificationId: number) {
        return forkJoin(this.glCashFlowClassificationEndpoint.getHistoryGlCashFlowClassificationEndpoint<AuditHistory[]>(glclassflowclassificationId));
    }

    newGlCashFlowClassification(glclassflowclassification: any) {
        return this.glCashFlowClassificationEndpoint.getNewGlCashFlowClassificationEndpoint<any>(glclassflowclassification);
    }

    getCashFlowClassification(glclassflowclassificationId?: number) {
        return this.glCashFlowClassificationEndpoint.getEditGlCashFlowClassificationEndpoint<any>(glclassflowclassificationId);
    }

    updateCashFlowClassification(glclassflowclassification: any) {
        return this.glCashFlowClassificationEndpoint.getUpdateGlCashFlowClassificationEndpoint(glclassflowclassification, glclassflowclassification.glClassFlowClassificationId);
    }

    deleteCashFlowClassification(glClassFlowClassificationId: number) {

        return this.glCashFlowClassificationEndpoint.getDeleteGlCashFlowClassificationEndpoint(glClassFlowClassificationId);

    }

    getGLCashFlowClassificationAuditDetails(Id: number) {
        return this.glCashFlowClassificationEndpoint.getGLCashFlowClassificationAuditDetails<any[]>(Id);
    }

    getGLCashFlowClassificationFileUpload(file) {
        return this.glCashFlowClassificationEndpoint.getGLCashFlowClassificationFileUpload(file);
    }

    getServerPages(serverSidePagesData: any) {
        return forkJoin(
            this.glCashFlowClassificationEndpoint.getGlCashFlowClassificationRecords<GlCashFlowClassification[]>(serverSidePagesData));
    }
}