
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class CurrencyEndpoint extends EndpointFactory {


    private readonly _currencyUrl: string = "/api/Currency/Get";
    // private readonly _workflowActionsNewUrl: string = "/api/WorkflowAction/Get";
    private readonly _currencyPostUrl: string = "/api/Currency/CurrencyPost";
    private readonly _actionsUrlNewAuditHistory: string = "/api/Currency/auditHistoryById";
    private readonly getCurrencyAuditById: string = "/api/Currency/audits";
    private readonly getCurrency: string = "/api/Currency/pagination";
    private readonly excelUpload: string = "/api/Currency/uploaduomcustomdata"
    private readonly _currencyUrlAll: string = "/api/Currency/GetAllCurrency";
    private readonly _countryUrl: string = "/api/Customer/GetcountryList";
    get CurrencyUrl() { return this.configurations.baseUrl + this._currencyUrl; }
    get CurrencyUrlAll() { return this.configurations.baseUrl + this._currencyUrlAll; }
    get CountryAll() { return this.configurations.baseUrl + this._countryUrl; }


    get paginate() { return this.configurations.baseUrl + this.getCurrency; }
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getCountryEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.CountryAll, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCountryEndpoint());
            }));
    }

    getCurrencyEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.CurrencyUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCurrencyEndpoint());
            }));
    }

    getAllCurrencyEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.CurrencyUrlAll, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCurrencyEndpoint());
            }));
    }

    getNewCurrencyEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._currencyPostUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewCurrencyEndpoint(userObject));
            }));
    }
    getEditcurrencyEndpoint<T>(currencyId?: number): Observable<T> {
        let endpointUrl = currencyId ? `${this._currencyPostUrl}/${currencyId}` : this._currencyPostUrl;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditcurrencyEndpoint(currencyId));
            }));
    }

    getUpdatecurrencyEndpoint<T>(roleObject: any, currencyId: number): Observable<T> {
        let endpointUrl = `${this._currencyPostUrl}/${currencyId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdatecurrencyEndpoint(roleObject, currencyId));
            }));
    }
    getDeletecurrencyEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._currencyPostUrl}/${actionId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeletecurrencyEndpoint(actionId));
            }));
    }
    getHistorycurrencyEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNewAuditHistory}/${actionId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistorycurrencyEndpoint(actionId));
            }));
    }
    
    getCurrencyDataAuditById<T>(currencyId: number): Observable<T> {
        let endpointUrl = `${this.getCurrencyAuditById}/${currencyId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCurrencyDataAuditById(currencyId));
            }));
    }
    
    getCurrencyRecords<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        //let endpointUrl = `${this.getPaginationData}/${data}`;
        return this.http.post<any>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getCurrencyRecords(paginationOption));
            }));
    }


    currencyFileUploadCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)


    }

}