
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { error } from '../../../node_modules/@angular/compiler/src/util';

@Injectable()
export class WorkPerformedEndpointService extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/WorkPerformed/Get";
    private readonly _actionsUrlNew: string = "/api/WorkPerformed/workperformed";  
    private readonly _actionsUrlAuditHistory: string = "/api/WorkPerformed/auditHistoryById";
    private readonly workPerformedDataAuditById: string = "/api/WorkPerformed/audits";

    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getWorkPerformedEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this._actionsUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getWorkPerformedEndpoint());
            });
    }
    getNewWorkPerformedEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewWorkPerformedEndpoint(userObject));
            });
    }
    


  

    getHistoryWorkPerformedEndpoint<T>(workPerformedId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${workPerformedId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryWorkPerformedEndpoint(workPerformedId));
            });
    }

    getEditWorkPerformedEndpoint<T>(workPerformedId?: number): Observable<T> {
        let endpointUrl = workPerformedId ? `${this._actionsUrlNew}/${workPerformedId}` : this._actionsUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditWorkPerformedEndpoint(workPerformedId));
            });
    }

    getUpdateWorkPerformedEndpoint<T>(roleObject: any, workPerformedId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${workPerformedId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateWorkPerformedEndpoint(roleObject, workPerformedId));
            });
    }

    getDeleteWorkPerformedEndpoint<T>(workPerformedId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${workPerformedId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteWorkPerformedEndpoint(workPerformedId));
            });
    }
    getWorkPerformedAuditById<T>(workPerformedId: number): Observable<T> {
        let endpointUrl = `${this.workPerformedDataAuditById}/${workPerformedId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getWorkPerformedAuditById(workPerformedId));
            });
    }


}
