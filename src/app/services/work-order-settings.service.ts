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
import { WorkOrderSettingsEndpointService } from './work-order-settings-endpoint.service';


export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class WorkOrderSettingsService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();
    isEditWOQuoteSettingsList: boolean = false;
    woQuoteSettingsData: any = {};

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private workorderEndpointService: WorkOrderSettingsEndpointService) { }

    getWorkFlows() {
        return forkJoin(
            this.workorderEndpointService.getworkorderEndpoint<any[]>());
    }
    getAllWorkFlows() {
        return forkJoin(
            this.workorderEndpointService.getAllworkorderEndpoint<any[]>());
    }



    newAction(action) {
        return this.workorderEndpointService.getNewActionEndpoint<any>(action);
    }

    getIntegrationsBasic() {
        return this.workorderEndpointService.getworkorderLiteEndpoint<any[]>();
    }

    updateAction(action) {
        return this.workorderEndpointService.getUpdateActionEndpoint(action);
    }

    deleteAcion(actionId: number) {

        return this.workorderEndpointService.getDeleteActionEndpoint(actionId);

    }
    getworkflowbyid(companyid:number,actionId: number) {
        return this.workorderEndpointService.getworkflowbyidEndpoint(companyid,actionId);
    }
    getAudit(workorderId: number) {
        return this.workorderEndpointService.getAuditById<any[]>(workorderId);
    }
}