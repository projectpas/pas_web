
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class DefaultMessageEndpoint extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/DefaultMessage/Get";
    private readonly _actionsUrlNew: string = "/api/DefaultMessage/defaultmessage";
    private readonly _actionsUrlAuditHistory: string = "/api/DefaultMessage/auditHistoryById";
    private readonly getAuditById: string = "/api/DefaultMessage/audits";
    private readonly getDefaultMessage: string = "/api/DefaultMessage/pagination";

    get paginate() { return this.configurations.baseUrl + this.getDefaultMessage; }
    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getDefaultMessageEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.actionsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDefaultMessageEndpoint());
            }));
    }

    getNewDefaultMessageEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewDefaultMessageEndpoint(userObject));
            }));
    }

    getHistoryDefaultMessageEndpoint<T>(defaultMessageId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${defaultMessageId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistoryDefaultMessageEndpoint(defaultMessageId));
            }));
    }

    getEditDefaultMessageEndpoint<T>(defaultMessageId?: number): Observable<T> {
        let endpointUrl = defaultMessageId ? `${this._actionsUrlNew}/${defaultMessageId}` : this._actionsUrlNew;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditDefaultMessageEndpoint(defaultMessageId));
            }));
    }

    getUpdateDefaultMessageEndpoint<T>(roleObject: any, defaultMessageId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${defaultMessageId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateDefaultMessageEndpoint(roleObject, defaultMessageId));
            }));
    }

    getDeleteDefaultMessageEndpoint<T>(defaultMessageId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${defaultMessageId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteDefaultMessageEndpoint(defaultMessageId));
            }));
    }
    getDefaultAudit<T>(defaultMessageId: number): Observable<T> {
        let endpointUrl = `${this.getAuditById}/${defaultMessageId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDefaultAudit(defaultMessageId));
            }));
    }
    
    getDefaultMessageRecords<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        return this.http.post<any>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDefaultMessageRecords(paginationOption));
            }));
    }
}


