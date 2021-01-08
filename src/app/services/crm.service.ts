import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject} from 'rxjs';




import { AuthService } from './auth.service';
import { Role } from '../models/role.model';
import { AuditHistory } from '../models/audithistory.model';
import { CrmEndpoint } from './crm-endpoint.service';
import {forkJoin} from 'rxjs';
export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class CrmService {
    public static readonly roleAddedOperation: RolesChangedOperation = "add";
    public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
    public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

    private _rolesChanged = new Subject<RolesChangedEventArg>();

    constructor(
        private router: Router,
        private http: HttpClient,
        private authService: AuthService,
        private crmEndpoint: CrmEndpoint) { }

  
    getAllCrmList(data) {
       
           return this.crmEndpoint.getAllCrmList(data);
    }
    getAllDealList(data) {
       
          return this.crmEndpoint.getAllDealList(data);
    }
    getAllLeadList(data) {
       
           return this.crmEndpoint.getAllLeadList(data);
    }
    getAllOpportunityList(data) {
       
           return this.crmEndpoint.getAllOpportunityList(data);
    }

    newAction(action: any) {
       return this.crmEndpoint.getNewCrmEndpoint<any>(action);
   }

   updateAction(action: any) {
       return this.crmEndpoint.getUpdateCrmEndpoint<any>(action, action.csrId);
   }

   newDeal(action: any) {
    return this.crmEndpoint.getNewDealEndpoint<any>(action);
}

updateDeal(action: any) {
    return this.crmEndpoint.getUpdateDealEndpoint<any>(action, action.customerId);
}

newLead(action: any) {
    return this.crmEndpoint.getNewLeadEndpoint<any>(action);
}

updateLead(action: any) {
    return this.crmEndpoint.getUpdateLeadEndpoint<any>(action, action.customerId);
}
newOpportunity(action: any) {
    return this.crmEndpoint.getNewOpportunityEndpoint<any>(action);
}

updateOpportunity(action: any) {
    return this.crmEndpoint.getUpdateOpportunityEndpoint<any>(action, action.customerId);
}

getDealNames() {
    return forkJoin(
        this.crmEndpoint.getDealNames<any[]>());
}
  

   
}