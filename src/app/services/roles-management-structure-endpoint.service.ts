import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

import {catchError} from 'rxjs/operators';
@Injectable()
export class RolesManagementStructureEndpoint extends EndpointFactory {

	private readonly _actionsUrl: string = "/api/RoleManagementStruct/Get";
	private readonly _actionsManagemetUrl: string = "/api/RoleManagementStruct/GetUserRoleMangementStructure";
	private readonly _actionsUrlNew: string = "/api/RoleManagementStruct/userRolePost";
	private readonly _actionsUrlAuditHistory: string = "/api/RoleManagementStruct/ataauditHistoryById";
	private readonly _actionsUrlManagementPost: string = "/api/RoleManagementStruct/UserRoleMangementStructurePost";


	get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }
	get actionsMangementSiteUrl() { return this.configurations.baseUrl + this._actionsManagemetUrl; }

	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

		super(http, configurations, injector);
	}


	getRolesEndpoint<T>(): Observable<T>
	{

		return this.http.get<any>(this.actionsUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getRolesEndpoint());
			}));
	}

	getRolesManagementStructureEditEndpoint<T>(UserRoleLevelId: number): Observable<T> {
		let endpointUrl = `${this._actionsManagemetUrl}/${UserRoleLevelId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getRolesManagementStructureEditEndpoint(UserRoleLevelId));
			}));
	}

	getNewRolesEndpoint<T>(userObject: any): Observable<T> {

		return this.http.post<any>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getNewRolesEndpoint(userObject));
			}));
	}

	//new ManagementSie table entereing

	getnewRolesManagementStructureData<T>(userObject: any): Observable<T> {
		debugger
		return this.http.post<any>(this._actionsUrlManagementPost, JSON.stringify(userObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getnewRolesManagementStructureData(userObject));
			}));
	}

	getHistoryRolesEndpoint<T>(UserRoleLevelId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlAuditHistory}/${UserRoleLevelId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getHistoryRolesEndpoint(UserRoleLevelId));
			}));
	}

	getEditRolesEndpoint<T>(UserRoleLevelId?: number): Observable<T> {
		let endpointUrl = UserRoleLevelId ? `${this._actionsUrlNew}/${UserRoleLevelId}` : this._actionsUrlNew;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getEditRolesEndpoint(UserRoleLevelId));
			}));
	}

	getUpdateRolesEndpoint<T>(roleObject: any, UserRoleLevelId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlNew}/${UserRoleLevelId}`;

		return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getUpdateRolesEndpoint(roleObject, UserRoleLevelId));
			}));
	}

	getUpdateRoleManagementStructureEndpoint<T>(roleObject: any, UserRoleLevelId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlManagementPost}/${UserRoleLevelId}`;
		return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getUpdateRoleManagementStructureEndpoint(roleObject, UserRoleLevelId));
			}));
	}

	getDeleteRolesEndpoint<T>(UserRoleLevelId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlNew}/${UserRoleLevelId}`;

		return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getDeleteRolesEndpoint(UserRoleLevelId));
			}));
	}


	//Delete management Role Before Edit
	getDeleteRoleManagementStructureEndpoint<T>(UserRoleLevelId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlManagementPost}/${UserRoleLevelId}`;
		return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getDeleteRoleManagementStructureEndpoint(UserRoleLevelId));
			}));
	}

}