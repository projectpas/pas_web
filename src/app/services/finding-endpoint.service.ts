
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class FindingEndpoint extends EndpointFactory {




    private readonly _actionsUrl: string = "/api/Finding/Get";
    private readonly _workflowActionsNewUrl: string = "/api/Finding/findingpost";
    private readonly _actionsUrlAuditHistory: string = "/api/Finding/auditHistoryById";
    private readonly _getAuditById: string = "/api/Finding/audits";
  
    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getFindingEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.actionsUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getFindingEndpoint());
            });
    }
    getNewGatecodeEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._workflowActionsNewUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewGatecodeEndpoint(userObject));
            });
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._workflowActionsNewUrl}/${actionId}` : this._workflowActionsNewUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            });
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._workflowActionsNewUrl}/${actionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            });
    }

    getDeleteActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._workflowActionsNewUrl}/${actionId}`;

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
    getAuditById<T>(findingId: number): Observable<T> {
        let endpointUrl = `${this._getAuditById}/${findingId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAuditById(findingId));
            });
    }

}