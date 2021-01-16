
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { TaskAttribute } from '../models/taskattribute.model';
import { environment } from 'src/environments/environment';
@Injectable()
export class TaskAttributeEndpointService extends EndpointFactory {
    baseUrl = environment.baseUrl;

    private readonly _actionsattributeUrl: string =this.baseUrl+ "/api/taskattribute/taskattributelist";
    private readonly _actionsattributeUrlNew: string =this.baseUrl+ "/api/taskattribute/createtaskattribute";
    private readonly _actionsattributeUrlUpdate: string =this.baseUrl+ "/api/taskattribute/updatetaskattribute";
    private readonly _actionsattributeUrlDelete: string =this.baseUrl+ "/api/taskattribute/deletetaskattribute";
    private readonly _actionsUrlAuditHistory: string =this.baseUrl+ "/api/taskattribute/taskattributehistory";


    get actionattributesUrl() { return this.configurations.baseUrl + this._actionsattributeUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getActionattributeEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.actionattributesUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getActionattributeEndpoint());
            });
    }
    getNewGatecodeEndpoint<T>(userObject: any): Observable<T>
    {

        return this.http.post<T>(this._actionsattributeUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewGatecodeEndpoint(userObject));
            });
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._actionsattributeUrlNew}/${actionId}` : this._actionsattributeUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            });
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsattributeUrlUpdate}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            });
    }

    getDeleteActionEndpoint<T>(taskAttributeId: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this._actionsattributeUrlDelete}?taskAttributeId=${taskAttributeId}&updatedBy=${updatedBy}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(taskAttributeId, updatedBy));
            });
    }
    getHistoryActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${actionId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryActionEndpoint(actionId));
            });
    }

    getTaskAttributeAuditeDetails<T>(taskAttributeId: number): Observable<T> {
        let endPointUrl = `${this._actionsUrlAuditHistory}?taskAttributeId=${taskAttributeId}`;
        return this.http.get<T>(endPointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTaskAttributeAuditeDetails(taskAttributeId));
            });
    }

}