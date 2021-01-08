import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class CustomerClassificationEndpoint extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/CustomerClassification/Get";
    private readonly _customerClassPostUrl: string = "/api/CustomerClassification/CustomerclassPost";
    private readonly _actionsUrlNewAuditHistory: string = "/api/CustomerClassification/auditHistoryById";
    private readonly getAuditById: string = "/api/CustomerClassification/audits";

    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getCustomerClassificationEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.actionsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCustomerClassificationEndpoint());
            }));
    }
    getNewCustomerClassification<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._customerClassPostUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewCustomerClassification(userObject));
            }));
    }
    getEditcurrencyEndpoint<T>(currencyId?: number): Observable<T> {
        let endpointUrl = currencyId ? `${this._customerClassPostUrl}/${currencyId}` : this._customerClassPostUrl;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditcurrencyEndpoint(currencyId));
            }));
    }

    getupdateCustomerClassification<T>(roleObject: any, currencyId: number): Observable<T> {
        let endpointUrl = `${this._customerClassPostUrl}/${currencyId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getupdateCustomerClassification(roleObject, currencyId));
            }));
    }
    getdeleteCustomerClassification<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._customerClassPostUrl}/${actionId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getdeleteCustomerClassification(actionId));
            }));
    }
    getHistoryCustomerClassification<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNewAuditHistory}/${actionId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistoryCustomerClassification(actionId));
            }));
    }


    getAuditCustomerClassification<T>(CustomerClassificationId: number): Observable<T> {
        let endpointUrl = `${this.getAuditById}/${CustomerClassificationId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAuditCustomerClassification(CustomerClassificationId));
            }));
    }

}