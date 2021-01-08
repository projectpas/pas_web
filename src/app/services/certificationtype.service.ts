import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable , Subject,forkJoin} from 'rxjs';




import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';


import { CertificationTypeEndpoint } from './certificationtype.endpoint.service';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class CertificationtypeService {
	public static readonly roleAddedOperation: RolesChangedOperation = "add";
	public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
	public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

	private _rolesChanged = new Subject<RolesChangedEventArg>();

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private certificationtypeEndpoint: CertificationTypeEndpoint) { }

	getWorkFlows() {
		return forkJoin(
			this.certificationtypeEndpoint.getcertificationTypeEndpoint<any[]>());
	}

	historyCertificationtype(EmployeeLicenseTypeId: number) {
		return forkJoin(this.certificationtypeEndpoint.getHistoryCertificationTypeEndpoint<any>(EmployeeLicenseTypeId));
	}

	newCertificationtype(action: any) {
		return this.certificationtypeEndpoint.getNewCertificationTypeEndpoint<any>(action);
	}

	getCertificationtype(EmployeeLicenseTypeId?: number) {
		return this.certificationtypeEndpoint.getEditCertificationTypeEndpoint<any>(EmployeeLicenseTypeId);
	}

	updateCertificationtype(action: any) {
		return this.certificationtypeEndpoint.getUpdateCertificationTypeEndpoint(action, action.employeeLicenseTypeId);
	}

	deleteCertificationtype(employeeLicenseTypeId: number) {

		return this.certificationtypeEndpoint.getDeleteCertificationTypeEndpoint(employeeLicenseTypeId);

	}
    
    getEmployeeLicenceAudit(employeeLicenseTypeId: number) {
        return this.certificationtypeEndpoint.getEmployeeLiceneceAuditById<any>(employeeLicenseTypeId);
    }
}