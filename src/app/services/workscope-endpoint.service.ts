
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class WorkScopeEndpointService extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/WorkScope/Get";
    private readonly _actionsUrlNew: string = "/api/WorkScope/workscope";
    private readonly _actionsUrlAuditHistory: string = "/api/WorkScope/auditHistoryById";
    private readonly _auditUrl: string = '/api/WorkScope/audits';

    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getWorkScopeEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.actionsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getWorkScopeEndpoint());
            }));
    }
    getNewWorkScopeEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewWorkScopeEndpoint(userObject));
            }));
    }

    getHistoryWorkScopeEndpoint<T>(workscopeId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${workscopeId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistoryWorkScopeEndpoint(workscopeId));
            }));
    }

    getEditWorkScopeEndpoint<T>(workscopeId?: number): Observable<T> {
        let endpointUrl = workscopeId ? `${this._actionsUrlNew}/${workscopeId}` : this._actionsUrlNew;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditWorkScopeEndpoint(workscopeId));
            }));
    }

    getUpdateWorkScopeEndpoint<T>(roleObject: any, workscopeId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${workscopeId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateWorkScopeEndpoint(roleObject, workscopeId));
            }));
    }

    getDeleteWorkScopeEndpoint<T>(workscopeId: number,updatedBy: string): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${workscopeId}?updatedBy=${updatedBy}`;

        return this.http.put<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteWorkScopeEndpoint(workscopeId,updatedBy));
            }));
    }

    getWorkScopeAuditDetails<T>(Id: number): Observable<T> {
        let endPointUrl = `${this._auditUrl}/${Id}`;

        return this.http.get<any>(endPointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getWorkScopeAuditDetails(Id));
            }));
    }
}

