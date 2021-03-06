﻿
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ProvisionEndpoint extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/Provision/Get";
    private readonly _actionsUrlNew: string = "/api/Provision/provision";
    private readonly _actionsUrlAuditHistory: string = "/api/Provision/auditHistoryById";
    private readonly getProvisionAuditHistoryById: string = "/api/Provision/audits";
    private readonly excelUpload: string = "/api/Provision/uploadProvisionCustomdata";



    // private readonly _workflowActionsNewUrl: string = "/api/WorkflowAction/Get";
    // private readonly _actionsUrlNew: string = "/api/Action/actions";
    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getProvisionEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.actionsUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getProvisionEndpoint());
            });
    }

    getNewProvisionEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewProvisionEndpoint(userObject));
            });
    }

    getHistoryProvisionEndpoint<T>(provisionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${provisionId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryProvisionEndpoint(provisionId));
            });
    }

    getEditProvisionEndpoint<T>(provisionId?: number): Observable<T> {
        let endpointUrl = provisionId ? `${this._actionsUrlNew}/${provisionId}` : this._actionsUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditProvisionEndpoint(provisionId));
            });
    }

    getUpdateProvisionEndpoint<T>(roleObject: any, provisionId: number): Observable<T> { 
        let endpointUrl = `${this._actionsUrlNew}/${provisionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateProvisionEndpoint(roleObject, provisionId));
            });
    }

    getDeleteProvisionEndpoint<T>(provisionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${provisionId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteProvisionEndpoint(provisionId));
            });
    }

    getProvisionAuditById<T>(provisionId: number): Observable<T> {
        let endpointUrl = `${this.getProvisionAuditHistoryById}/${provisionId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getProvisionAuditById(provisionId));
            });
    }
 
    provisionCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)


    }

}


