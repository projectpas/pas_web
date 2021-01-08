
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { TaskAttribute } from '../models/taskattribute.model';
import {catchError} from 'rxjs/operators';
@Injectable()
export class TaskAttributeEndpointService extends EndpointFactory {


    private readonly _actionsattributeUrl: string = "/api/taskattribute/taskattributelist";
    private readonly _actionsattributeUrlNew: string = "/api/taskattribute/createtaskattribute";
    private readonly _actionsattributeUrlUpdate: string = "/api/taskattribute/updatetaskattribute";
    private readonly _actionsattributeUrlDelete: string = "/api/taskattribute/deletetaskattribute";
    private readonly _actionsUrlAuditHistory: string = "/api/taskattribute/taskattributehistory";


    get actionattributesUrl() { return this.configurations.baseUrl + this._actionsattributeUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getActionattributeEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.actionattributesUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getActionattributeEndpoint());
            }));
    }
    getNewGatecodeEndpoint<T>(userObject: any): Observable<T>
    {

        return this.http.post<any>(this._actionsattributeUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewGatecodeEndpoint(userObject));
            }));
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._actionsattributeUrlNew}/${actionId}` : this._actionsattributeUrlNew;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            }));
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsattributeUrlUpdate}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            }));
    }

    getDeleteActionEndpoint<T>(taskAttributeId: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this._actionsattributeUrlDelete}?taskAttributeId=${taskAttributeId}&updatedBy=${updatedBy}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(taskAttributeId, updatedBy));
            }));
    }
    getHistoryActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${actionId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistoryActionEndpoint(actionId));
            }));
    }

    getTaskAttributeAuditeDetails<T>(taskAttributeId: number): Observable<T> {
        let endPointUrl = `${this._actionsUrlAuditHistory}?taskAttributeId=${taskAttributeId}`;
        return this.http.get<any>(endPointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getTaskAttributeAuditeDetails(taskAttributeId));
            }));
    }

}