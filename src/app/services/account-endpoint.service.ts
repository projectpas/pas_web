// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators'
@Injectable()
export class AccountEndpoint extends EndpointFactory {

    private readonly _usersUrl: string = "/api/account/users";
    private readonly _userByUserNameUrl: string = "/api/account/users/username";
    private readonly _currentUserUrl: string = "/api/account/users/me";
    private readonly _currentUserPreferencesUrl: string = "/api/account/users/me/preferences";
    private readonly _unblockUserUrl: string = "/api/account/users/unblock";
    private readonly _rolesUrl: string = "/api/account/roles";
    private readonly _roleByRoleNameUrl: string = "/api/account/roles/name";
    private readonly _permissionsUrl: string = "/api/account/permissions";
    private readonly _countriesListURL: string = "/api/globalsettings/getcultureinfos";
    private readonly _getCountrySpecificDataUrl : string = "/api/globalsettings/globalsettingsinfo?culture="
    
    private readonly _getSavedCountryDataUrl : string = "/api/globalsettings/globalsettings?masterCompanyId="
    private readonly _saveCountryLevelGlobalSettingsUrl: string = "/api/globalsettings/createglobalsettings"

    get usersUrl() { return this.configurations.baseUrl + this._usersUrl; }
    get userByUserNameUrl() { return this.configurations.baseUrl + this._userByUserNameUrl; }
    get currentUserUrl() { return this.configurations.baseUrl + this._currentUserUrl; }
    get currentUserPreferencesUrl() { return this.configurations.baseUrl + this._currentUserPreferencesUrl; }
    get unblockUserUrl() { return this.configurations.baseUrl + this._unblockUserUrl; }
    get rolesUrl() { return this.configurations.baseUrl + this._rolesUrl; }
    get roleByRoleNameUrl() { return this.configurations.baseUrl + this._roleByRoleNameUrl; }
    get permissionsUrl() { return this.configurations.baseUrl + this._permissionsUrl; }
    get countriesListUrl() { return this.configurations.baseUrl + this._countriesListURL; }
    get getCountrySpecificDataUrl() { return this.configurations.baseUrl + this._getCountrySpecificDataUrl; }
    get getSavedCountryDataUrl() { return this.configurations.baseUrl + this._getSavedCountryDataUrl; }
    get saveCountryLevelGlobalSettingsUrl() { return this.configurations.baseUrl + this._saveCountryLevelGlobalSettingsUrl; }
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getUserEndpoint<T>(userId?: string): Observable<T> {
        let endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUserEndpoint(userId));
            }));
    }

    getUserByUserNameEndpoint<T>(userName: string): Observable<T> {
        let endpointUrl = `${this.userByUserNameUrl}/${userName}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUserByUserNameEndpoint(userName));
            }));
    }

    getUsersEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
        let endpointUrl = page && pageSize ? `${this.usersUrl}/${page}/${pageSize}` : this.usersUrl;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUsersEndpoint(page, pageSize));
            }));
    }

    getNewUserEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this.usersUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewUserEndpoint(userObject));
            }));
    }

    getUpdateUserEndpoint<T>(userObject: any, userId?: string): Observable<T> {
        let endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;

        return this.http.put<any>(endpointUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateUserEndpoint(userObject, userId));
            }));
    }

    getPatchUpdateUserEndpoint<T>(patch: {}, userId?: string): Observable<T>
    getPatchUpdateUserEndpoint<T>(value: any, op: string, path: string, from?: any, userId?: string): Observable<T>
    getPatchUpdateUserEndpoint<T>(valueOrPatch: any, opOrUserId?: string, path?: string, from?: any, userId?: string): Observable<T> {
        let endpointUrl: string;
        let patchDocument: {};

        if (path) {
            endpointUrl = userId ? `${this.usersUrl}/${userId}` : this.currentUserUrl;
            patchDocument = from ?
                [{ "value": valueOrPatch, "path": path, "op": opOrUserId, "from": from }] :
                [{ "value": valueOrPatch, "path": path, "op": opOrUserId }];
        }
        else {
            endpointUrl = opOrUserId ? `${this.usersUrl}/${opOrUserId}` : this.currentUserUrl;
            patchDocument = valueOrPatch;
        }

        return this.http.patch<any>(endpointUrl, JSON.stringify(patchDocument), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getPatchUpdateUserEndpoint(valueOrPatch, opOrUserId, path, from, userId));
            }));
    }

    getUserPreferencesEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.currentUserPreferencesUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUserPreferencesEndpoint());
            }));
    }

    getUpdateUserPreferencesEndpoint<T>(configuration: string): Observable<T> {
        return this.http.put<any>(this.currentUserPreferencesUrl, JSON.stringify(configuration), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateUserPreferencesEndpoint(configuration));
            }));
    }

    getUnblockUserEndpoint<T>(userId: string): Observable<T> {
        let endpointUrl = `${this.unblockUserUrl}/${userId}`;

        return this.http.put<any>(endpointUrl, null, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUnblockUserEndpoint(userId));
            }));
    }

    getDeleteUserEndpoint<T>(userId: string): Observable<T> {
        let endpointUrl = `${this.usersUrl}/${userId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteUserEndpoint(userId));
            }));
    }

    getRoleEndpoint<T>(roleId: string): Observable<T> {
        let endpointUrl = `${this.rolesUrl}/${roleId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getRoleEndpoint(roleId));
            }));
    }

    getRoleByRoleNameEndpoint<T>(roleName: string): Observable<T> {
        let endpointUrl = `${this.roleByRoleNameUrl}/${roleName}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getRoleByRoleNameEndpoint(roleName));
            }));
    }

    getRolesEndpoint<T>(page?: number, pageSize?: number): Observable<T> {
        let endpointUrl = page && pageSize ? `${this.rolesUrl}/${page}/${pageSize}` : this.rolesUrl;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getRolesEndpoint(page, pageSize));
            }));
    }

    getNewRoleEndpoint<T>(roleObject: any): Observable<T> {

        return this.http.post<any>(this.rolesUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewRoleEndpoint(roleObject));
            }));
    }

    getUpdateRoleEndpoint<T>(roleObject: any, roleId: string): Observable<T> {
        let endpointUrl = `${this.rolesUrl}/${roleId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateRoleEndpoint(roleObject, roleId));
            }));
    }

    getDeleteRoleEndpoint<T>(roleId: string): Observable<T> {
        let endpointUrl = `${this.rolesUrl}/${roleId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteRoleEndpoint(roleId));
            }));
    }

    getPermissionsEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.permissionsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getPermissionsEndpoint());
            }));
    }

    //Global Settings 
    getCountriesListEndPoint<T>(): Observable<T> {

        return this.http.get<any>(this.countriesListUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCountriesListEndPoint());
            }));
    }

    getCountrySpecificDataEndPoint<T>(countryId): Observable<T>{
        return this.http.get<any>(`${this.getCountrySpecificDataUrl}${countryId}` , this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCountrySpecificDataEndPoint(countryId))
            }));
    }
    getSavedCountryDataEndPoint<T>(masterCompanyId): Observable<T>{
        return this.http.get<any>(`${this.getSavedCountryDataUrl}${masterCompanyId}` , this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getSavedCountryDataEndPoint(masterCompanyId))
            }));
    }
    saveCountryLevelGlobalSettingsEndPoint<T>(data): Observable<T>{
        return this.http.post<any>(this.saveCountryLevelGlobalSettingsUrl, JSON.stringify(data), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.saveCountryLevelGlobalSettingsEndPoint(data));
            }));
    }
}