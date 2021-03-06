﻿import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class PercentEndpoint extends EndpointFactory {

    private readonly _currencyUrl: string = "/api/Percentage/Get";
    private readonly _addPercentageNew: string = "/api/Percentage/percentagepost";
    private readonly _actionsUrlAuditHistory: string = "/api/Percentage/auditHistoryById";
    private readonly _workflowActionsNewUrl: string = "/api/Percentage/DeletePercentage";
    get GetPercentURL() { return this.configurations.baseUrl + this._currencyUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getAllPercentages<T>(): Observable<T> {

        return this.http.get<T>(this.GetPercentURL, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllPercentages());
            });
    }


    getNewGatecodeEndpoint<T>(userObject: any): Observable<T> {
  
        return this.http.post<T>(this._addPercentageNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewGatecodeEndpoint(userObject));
            });
    }

    getEditPercentageEndpoint<T>(percentId?: number): Observable<T> {
        let endpointUrl = percentId ? `${this._addPercentageNew}/${percentId}` : this._addPercentageNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditPercentageEndpoint(percentId));
            });
    }

    getUpdatePercentageEndpoint<T>(roleObject: any, percentId: number): Observable<T> {
        let endpointUrl = `${this._addPercentageNew}/${percentId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdatePercentageEndpoint(roleObject, percentId));
            });
    }
    getDeletePercentEndpoint<T>(actionId: number,updatedBy: string): Observable<T> {
        let endpointUrl = `${this._workflowActionsNewUrl}/${actionId}?updatedBy=${updatedBy}`;

        return this.http.put<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () =>
                 this.getDeletePercentEndpoint(actionId,updatedBy));
            });
    }

    getHistoryActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${actionId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryActionEndpoint(actionId));
            });
    }
}