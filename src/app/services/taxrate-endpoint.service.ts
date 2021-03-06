﻿
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class TaxRateEndpointService extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/TaxRate/Get";
    private readonly _actionsUrlNew: string = "/api/TaxRate/taxrate";
    private readonly _actionsUrlAuditHistory: string = "/api/TaxRate/auditHistoryById";
    private readonly getTaxRateDataAuditById: string = "/api/TaxRate/audits";
    private readonly getTaxRate: string = "/api/TaxRate/pagination";

    get paginate() { return this.configurations.baseUrl + this.getTaxRate; }
    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getTaxRateEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.actionsUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTaxRateEndpoint());
            });
    }

    getNewTaxRateEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewTaxRateEndpoint(userObject));
            });
    }

    getHistoryTaxRateEndpoint<T>(taxrateId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${taxrateId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryTaxRateEndpoint(taxrateId));
            });
    }

    getEditTaxRateEndpoint<T>(taxrateId?: number): Observable<T> {
        let endpointUrl = taxrateId ? `${this._actionsUrlNew}/${taxrateId}` : this._actionsUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditTaxRateEndpoint(taxrateId));
            });
    }

    getUpdateTaxRateEndpoint<T>(roleObject: any, taxrateId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${taxrateId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateTaxRateEndpoint(roleObject, taxrateId));
            });
    }

    getDeleteTaxRateEndpoint<T>(taxrateId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${taxrateId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteTaxRateEndpoint(taxrateId));
            });
    }


    getTaxRateAuditById<T>(taxrateId: number): Observable<T> {
        let endpointUrl = `${this.getTaxRateDataAuditById}/${taxrateId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTaxRateAuditById(taxrateId));
            });
    }
    
    getTaxRateRecords<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        return this.http.post<T>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTaxRateRecords(paginationOption));
            });
    }

}

