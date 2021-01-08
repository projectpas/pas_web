import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { RolesManagementStructureEndpoint } from './roles-management-structure-endpoint.service';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { UserRoleLevel } from '../models/userRoleLevel.model';
import { AuditHistory } from '../models/audithistory.model';

export type RolesChangedOperation = "add" | "delete" | "modify";
export type RolesChangedEventArg = { roles: Role[] | string[], operation: RolesChangedOperation };

@Injectable()
export class RolesManagementStructureService
{
	isEditMode: boolean = false;
	public static readonly roleAddedOperation: RolesChangedOperation = "add";
	public static readonly roleDeletedOperation: RolesChangedOperation = "delete";
	public static readonly roleModifiedOperation: RolesChangedOperation = "modify";

	private _rolesChanged = new Subject<RolesChangedEventArg>();

	constructor(
		private router: Router,
		private http: HttpClient,
		private authService: AuthService,
		private rolesEndpoint: RolesManagementStructureEndpoint) { }

	getRolesList() {
		return Observable.forkJoin(
			this.rolesEndpoint.getRolesEndpoint<UserRoleLevel[]>());
	}

	newRole(role: any) {
		return this.rolesEndpoint.getNewRolesEndpoint<any>(role);
	}

	//for new Management Site Data and Edit Also
	newRolesManagementStructure(data: any) {
		return this.rolesEndpoint.getnewRolesManagementStructureData<any>(data);
	}

	historyRoles(UserRoleLevelId: number) {
		return Observable.forkJoin(this.rolesEndpoint.getHistoryRolesEndpoint<AuditHistory[]>(UserRoleLevelId));
	}

	getRole(UserRoleLevelId?: number) {
		return this.rolesEndpoint.getEditRolesEndpoint<UserRoleLevel>(UserRoleLevelId);
	}

	updateManagementRole(data: any) //Update Management SIte
	{
		for (let i = 0; i <= data.length; i++)
		{

			return this.rolesEndpoint.getUpdateRoleManagementStructureEndpoint(data, data[i].data.userRoleLevelId);
		}

	}

	updateRole(role: UserRoleLevel) {
		return this.rolesEndpoint.getUpdateRolesEndpoint(role, role.userRoleLevelId);
	}

	deleteRole(roleId: number) {

		return this.rolesEndpoint.getDeleteRolesEndpoint(roleId);

	}

	getRoleManagementStructureEditData(UserRoleLevelId?: number)
	{
		return this.rolesEndpoint.getRolesManagementStructureEditEndpoint<any>(UserRoleLevelId);
	}

	deleteManagementRole(data: any) {
		return this.rolesEndpoint.getDeleteRoleManagementStructureEndpoint(data[0].data.userRoleLevelId);
	}
}