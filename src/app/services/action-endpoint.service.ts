
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError} from 'rxjs/operators'

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

        return this.http.get<any>(this.actionsUrl, this.getRequestHeaders()).pipe(
            catchError(error => {
                return this.handleError(error, () => this.getActionEndpoint());
            }));
    }

    getHistoryActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${actionId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders()).pipe(
            catchError(error => {
                return this.handleError(error, () => this.getHistoryActionEndpoint(actionId));
            }));
    }


    getNewActionEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._actionsUrlNew, JSON.parse(JSON.stringify(userObject)), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewActionEndpoint(userObject));
            }));
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._actionsUrlNew}/${actionId}` : this._actionsUrlNew;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders()).pipe(
            catchError(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            }));
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._actionUpdateURL}/${actionId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders()).pipe(
            catchError(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            }));
    }

    getDeleteActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionUpdateURL}/${actionId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders()).pipe(
            catchError(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId));
            }));
    }

    getTaskAuditDetails<T>(Id: number): Observable<T> {
        let endPointUrl = `${this._auditUrl}/${Id}`;

        return this.http.get<any>(endPointUrl, this.getRequestHeaders()).pipe(
        catchError(error => {
                return this.handleError(error, () => this.getTaskAuditDetails(Id));
            }));
    }
}