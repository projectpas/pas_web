import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




import { TaxTypeEndpointService } from './taxtype-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Action } from '../models/action.model';
import { AuditHistory } from '../models/audithistory.model';
import { TaxType } from '../models/taxtype.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class TaxTypeService {
	public static readonly roleAddedOperation: RolesChangedOperation = "add";
	public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
	public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

	private _rolesChanged = new Subject<RolesChangedEventArg>();

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private taxTypeEndpoint: TaxTypeEndpointService) { }

	getWorkFlows() {
		return forkJoin(
			this.taxTypeEndpoint.getTaxTypeEndpoint<TaxType[]>());
	}

	historyTaxType(actionId: number) {
		return forkJoin(this.taxTypeEndpoint.getHistoryTaxTypeEndpoint<AuditHistory[]>(actionId));
	}

	newAction(action) {
		return this.taxTypeEndpoint.getNewTaxTypeEndpoint<TaxType>(action);
	}

	getAction(actionId?: number) {
		return this.taxTypeEndpoint.getEditTaxTypeEndpoint<TaxType>(actionId);
	}

	updateAction(action) {
		return this.taxTypeEndpoint.getUpdateTaxTypeEndpoint(action, action.taxTypeId);
	}

	deleteAcion(actionId: number) {

		return this.taxTypeEndpoint.getDeleteTaxTypeEndpoint(actionId);

    }

    getTaxTypeAudit(taxTypeId: number) {
        return this.taxTypeEndpoint.getTaxTypeAuditById<any>(taxTypeId);
    }

    getTaxTypeAuditDetails(Id: number) {
        return this.taxTypeEndpoint.getTaxTypeAuditDetails<any[]>(Id);
    }

    getServerPages(serverSidePagesData: any) {
        return forkJoin(
            this.taxTypeEndpoint.getTaxTypeRecords<TaxType[]>(serverSidePagesData));
	}

	taxtypeCustomUpload(file) {
		return this.taxTypeEndpoint.taxtypeCustomUpload(file);
	}

}