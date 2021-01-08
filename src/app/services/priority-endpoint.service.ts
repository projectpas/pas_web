
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class PriorityEndpointService extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/Priority/Get";
    private readonly _actionsUrlNew: string = "/api/Priority/priority";
    private readonly _actionsUrlNewAuditHistory: string = "/api/Priority/auditHistoryById";
    private readonly getPrioriryDataAuditById: string = "/api/Priority/audits";

    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getPriorityEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.actionsUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getPriorityEndpoint());
            });
    }

    getNewPriorityEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewPriorityEndpoint(userObject));
            });
    }

    getEditPriorityEndpoint<T>(priorityId?: number): Observable<T> {
        let endpointUrl = priorityId ? `${this._actionsUrlNew}/${priorityId}` : this._actionsUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditPriorityEndpoint(priorityId));
            });
    }

    getUpdatePriorityEndpoint<T>(roleObject: any, priorityId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${priorityId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdatePriorityEndpoint(roleObject, priorityId));
            });
    }

    getDeletePriorityEndpoint<T>(priorityId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${priorityId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeletePriorityEndpoint(priorityId));
            });
    }
    getHistoryPriorityEndpoint<T>(priorityId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNewAuditHistory}/${priorityId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryPriorityEndpoint(priorityId));
            });
    }
    getPrioriryAuditById<T>(priorityId: number): Observable<T> {
        let endpointUrl = `${this.getPrioriryDataAuditById}/${priorityId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getPrioriryAuditById(priorityId));
            });
    }
    
}