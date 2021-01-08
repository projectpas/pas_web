import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Action } from '../models/action.model';
import { AuditHistory } from '../models/audithistory.model';
import { TeardownReason } from '../models/teardownReason.model';
import { TeardownReasonEndpointService } from './teardown-reason-endpoint.service';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class TeardownReasonService {
	public static readonly roleAddedOperation: RolesChangedOperation = "add";
	public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
	public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

	private _rolesChanged = new Subject<RolesChangedEventArg>();

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private teardownReasonEndpoint: TeardownReasonEndpointService) { }

	getAll() {
		return forkJoin(
			this.teardownReasonEndpoint.getTeardownReasonEndpoint<TeardownReason[]>());
	}

	add(teardownReason: TeardownReason) {
        return this.teardownReasonEndpoint.addTeardownReasonEndpoint<TeardownReason>(teardownReason);
	}

    remove(teardownReasonId: number, updatedBy: string) {
        return this.teardownReasonEndpoint.removeTeardownReasonEndpoint(teardownReasonId, updatedBy);
	}
	
	updateAction(action) {
        return this.teardownReasonEndpoint.getUpdateActionEndpoint(action, action.teardownReasonId);
	}
	
	history(actionId: number) {
        return this.teardownReasonEndpoint.getHistoryEndpoint<any[]>(actionId);
	}
	
	deleteAcion(actionId: number, updatedBy: string) {

		return this.teardownReasonEndpoint.
		getDeleteActionEndpoint(actionId, updatedBy);

    }
   
}