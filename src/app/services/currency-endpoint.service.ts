
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

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
        return this.http.get<T>(this.CountryAll, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getCountryEndpoint());
        });
    }

    getCurrencyEndpoint<T>(masterCompanyId?): Observable<T> {
        let endpointUrl = `${this.CurrencyUrl}/${masterCompanyId !== undefined ? masterCompanyId : 1}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getCurrencyEndpoint(masterCompanyId));
        });
    }

    getAllCurrencyEndpoint<T>(): Observable<T> {
        return this.http.get<T>(this.CurrencyUrlAll, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getCurrencyEndpoint());
        });
    }

    getNewCurrencyEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._currencyPostUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewCurrencyEndpoint(userObject));
        });
    }

    getEditcurrencyEndpoint<T>(currencyId?: number): Observable<T> {
        let endpointUrl = currencyId ? `${this._currencyPostUrl}/${currencyId}` : this._currencyPostUrl;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getEditcurrencyEndpoint(currencyId));
        });
    }

    getUpdatecurrencyEndpoint<T>(roleObject: any, currencyId: number): Observable<T> {
        let endpointUrl = `${this._currencyPostUrl}/${currencyId}`;
        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getUpdatecurrencyEndpoint(roleObject, currencyId));
        });
    }

    getDeletecurrencyEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._currencyPostUrl}/${actionId}`;
        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getDeletecurrencyEndpoint(actionId));
        });
    }

    getHistorycurrencyEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNewAuditHistory}/${actionId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getHistorycurrencyEndpoint(actionId));
        });
    }
    
    getCurrencyDataAuditById<T>(currencyId: number): Observable<T> {
        let endpointUrl = `${this.getCurrencyAuditById}/${currencyId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getCurrencyDataAuditById(currencyId));
        });
    }
    
    getCurrencyRecords<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        //let endpointUrl = `${this.getPaginationData}/${data}`;
        return this.http.post<T>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getCurrencyRecords(paginationOption));
        });
    }

    currencyFileUploadCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file) .catch(error => {
            return this.handleErrorCommon(error, () => this.currencyFileUploadCustomUpload(file));
        });
    }

}