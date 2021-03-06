﻿
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class EmployeeExpertiseEndpointService extends EndpointFactory {


    private readonly _employeeExpertiseGetUrl: string = "/api/EmployeeExpertise/Get";
    private readonly _employeeExpertiseUrlNew: string = "/api/EmployeeExpertise/EmployeeExpertiseepost";
    private readonly _actionsUrlAuditHistory: string = "/api/EmployeeExpertise/auditHistoryById";
    private readonly _getAuditById: string = "/api/EmployeeExpertise/audits";
    private readonly excelUpload: string = "/api/EmployeeExpertise/uploaduomcustomdata";
    get employeeExpertiseUrl() { return this.configurations.baseUrl + this._employeeExpertiseGetUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getEmployeeExpertiseEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.employeeExpertiseUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEmployeeExpertiseEndpoint());
            });
    }

    getNewEmployeeExpertiseEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._employeeExpertiseUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewEmployeeExpertiseEndpoint(userObject));
            });
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._employeeExpertiseUrlNew}/${actionId}` : this._employeeExpertiseUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            });
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._employeeExpertiseUrlNew}/${actionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            });
    }

    getDeleteActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._employeeExpertiseUrlNew}/${actionId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId));
            });
    }
    getHistoryActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${actionId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryActionEndpoint(actionId));
            });
    }
    getAuditById<T>(employeeExpertiseId: number): Observable<T> {
        let endpointUrl = `${this._getAuditById}/${employeeExpertiseId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAuditById(employeeExpertiseId));
            });
    }


    EmployeeExpertiseFileUploadCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)
            .catch(error => {
                return this.handleError(error, () => this.EmployeeExpertiseFileUploadCustomUpload(file));
            });
    }
}