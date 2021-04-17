
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class ConditionEndpoint extends EndpointFactory {


    private readonly _conditionurl: string = "/api/Condition/Get";
    private readonly _workflowconditionsNewUrl: string = "/api/Workflowcondition/Get";
    private readonly _conditionPosturl: string = "/api/Condition/ConditionPost";
    private readonly _actionsUrlNewAuditHistory: string = "/api/Condition/auditHistoryById";
    private readonly getConditionDataAuditById: string = "/api/Condition/audits";
    private readonly _actionUrlAll: string = "/api/Condition/getAll";
    private readonly excelUpload: string = "/api/Condition/UploadConditionCustomData";
    get ConditionUrl() { return this.configurations.baseUrl + this._conditionurl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }
    
    getAllConditionEndpoint<T>(): Observable<T> {
        return this.http.get<T>(this._actionUrlAll, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllConditionEndpoint());
            });
    }

    getConditionEndpoint<T>(masterCompanyId: number): Observable<T> {

        return this.http.get<T>(`${this.ConditionUrl}?masterCompanyId=${masterCompanyId}`, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getConditionEndpoint(masterCompanyId));
            });
    }
    getNewConditionEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._conditionPosturl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewConditionEndpoint(userObject));
            });
    }

    getEditConditionEndpoint<T>(conditionId?: number): Observable<T> {
        let endpointUrl = conditionId ? `${this._conditionPosturl}/${conditionId}` : this._conditionPosturl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditConditionEndpoint(conditionId));
            });
    }

    getUpdateConditionEndpoint<T>(roleObject: any, conditionId: number): Observable<T> {
        let endpointUrl = `${this._conditionPosturl}/${conditionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateConditionEndpoint(roleObject, conditionId));
            });
    }
    getDeleteConditionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._conditionPosturl}/${actionId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteConditionEndpoint(actionId));
            });
    }
    getHistoryConditionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNewAuditHistory}/${actionId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryConditionEndpoint(actionId));
            });
    }
    
    getConditionAuditById<T>(conditionId: number): Observable<T> {
        let endpointUrl = `${this.getConditionDataAuditById}/${conditionId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getConditionAuditById(conditionId));
            });
    }

    ConditionCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

    }
}