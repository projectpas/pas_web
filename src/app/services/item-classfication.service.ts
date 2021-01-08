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
import { ItemClassificationEndpointService } from './item-classification-endpoint.service';
import { ItemClassificationModel } from '../models/item-classification.model';
import { AuditHistory } from '../models/audithistory.model';




export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class ItemClassificationService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private itemclassificationEndpoint: ItemClassificationEndpointService) { }

    getWorkFlows() {
        return forkJoin(
            this.itemclassificationEndpoint.getitemclassificationEndpoint<ItemClassificationModel[]>());
    }
    loadAltEquPartInfoData(itemMasterId){
        return this.itemclassificationEndpoint.getloadAltEquPartInfoData<any>(itemMasterId);
    }
    newAction(action: any) {
        return this.itemclassificationEndpoint.getNewitemclassificationEndpoint<any>(action);
    }

    getAction(actionId?: number) {
        return this.itemclassificationEndpoint.getEditActionEndpoint<ItemClassificationModel>(actionId);
    }

    updateAction(action: any) {
        return this.itemclassificationEndpoint.getUpdateActionEndpoint(action, action.itemClassificationId);
    }

    deleteAcion(actionId: number) {

        return this.itemclassificationEndpoint.getDeleteActionEndpoint(actionId);

    }
    historyAcion(actionId: number) {
        return this.itemclassificationEndpoint.getHistoryActionEndpoint<any[]>(actionId);
    }
    getItemClassificationAudit(classificationAuditId: number) {
        return this.itemclassificationEndpoint.getItemClassificationDataAuditById<any>(classificationAuditId);
    }
    getServerPages(serverSidePagesData: any) {
        return forkJoin(
            this.itemclassificationEndpoint.getItemClassificationPagination<ItemClassificationModel[]>(serverSidePagesData));
    }
    ItemClassCustomUpload(file) {
        return this.itemclassificationEndpoint.ItemClassCustomUpload(file);
    } 

    getSearchRecords(serverSidePagesData: any) {
        return forkJoin(
            this.itemclassificationEndpoint.SearchData<ItemClassificationModel[]>(serverSidePagesData));
    }
}