
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ActionEndpoint extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/Task/Get";
    private readonly _actionsUrlNew: string = "/api/Task/add";
    private readonly _actionUpdateURL: string = "/api/Task/Tasks";
    private readonly _actionsUrlAuditHistory: string = "c/auditHistoryById";
    private readonly _auditUrl: string = '/api/Task/audits'

    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getActionEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.actionsUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getActionEndpoint());
            });
    }

    getHistoryActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${actionId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryActionEndpoint(actionId));
            });
    }


    getNewActionEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._actionsUrlNew, JSON.parse(JSON.stringify(userObject)), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewActionEndpoint(userObject));
            });
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._actionsUrlNew}/${actionId}` : this._actionsUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            });
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._actionUpdateURL}/${actionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            });
    }

    getDeleteActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionUpdateURL}/${actionId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId));
            });
    }

    getTaskAuditDetails<T>(Id: number): Observable<T> {
        let endPointUrl = `${this._auditUrl}/${Id}`;

        return this.http.get<T>(endPointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTaskAuditDetails(Id));
            });
    }
}