
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class ReasonEndpoint extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/Reason/Get";
    private readonly _actionsUrlNew: string = "/api/Reason/reason";
    private readonly _actionsUrlAuditHistory: string = "/api/Reason/auditHistoryById";
    private readonly _actionUrlAll: string = "/api/Reason/getAll"
    private readonly getReasonAuditDataById: string = "/api/Reason/audits";
    private readonly getReason: string = "/api/Reason/pagination";
    private readonly excelUpload: string = "/api/Reason/uploadReasonCustomdata";

    // private readonly _workflowActionsNewUrl: string = "/api/WorkflowAction/Get";
    // private readonly _actionsUrlNew: string = "/api/Action/actions";
    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }
    get paginate() { return this.configurations.baseUrl + this.getReason; }
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getReasonEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.actionsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getReasonEndpoint());
            }));
    }
    getNewReasonEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewReasonEndpoint(userObject));
            }));
    }

    getHistoryReasonEndpoint<T>(reasonId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${reasonId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistoryReasonEndpoint(reasonId));
            }));
    }

    getEditReasonEndpoint<T>(reasonId?: number): Observable<T> {
        let endpointUrl = reasonId ? `${this._actionsUrlNew}/${reasonId}` : this._actionsUrlNew;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditReasonEndpoint(reasonId));
            }));
    }

    getUpdateReasonEndpoint<T>(roleObject: any, reasonId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${reasonId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateReasonEndpoint(roleObject, reasonId));
            }));
    }

    getDeleteReasonEndpoint<T>(reasonId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${reasonId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteReasonEndpoint(reasonId));
            }));
    }
    
    getReasonAuditById<T>(reasonId: number): Observable<T> {
        let endpointUrl = `${this.getReasonAuditDataById}/${reasonId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getReasonAuditById(reasonId));
            }));
    }
    
    getReasonRecords<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        //let endpointUrl = `${this.getPaginationData}/${data}`;
        return this.http.post<any>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getReasonRecords(paginationOption));
            }));
    }

    getAllReasonsEndpoint<T>(): Observable<T> {
        return this.http.get<any>(this._actionUrlAll, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllReasonsEndpoint());
            }));
    }
    reasonCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)


    }

}


