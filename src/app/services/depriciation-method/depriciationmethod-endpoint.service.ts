// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { DepriciationMethod } from '../../models/depriciation-method.model';

@Injectable()
export class DepriciationMethodEndpointService extends EndpointFactory {

    private readonly getAllURL: string = "/api/depreciationMethod/getAll";
    private readonly getByIdURL: string = "/api/depreciationMethod/getById";
    private readonly addURL: string = "/api/depreciationMethod/add";
    private readonly updateURL: string = "/api/depreciationMethod/update";
    private readonly removeByIdURL: string = "/api/depreciationMethod/removeById";
    //private readonly audits: string = "/api/depreciationMethod/audits";
    private readonly audits: string = "/api/depreciationMethod/depreciationmethodauditdetails";
    private readonly excelUpload: string = "/api/DepreciationMethod/UploadDepMethodCustomData";


    get getAll() { return this.configurations.baseUrl + this.getAllURL; }
    get getById() { return this.configurations.baseUrl + this.getByIdURL; }
    get add() { return this.configurations.baseUrl + this.addURL; }
    get update() { return this.configurations.baseUrl + this.updateURL; }
    get removeById() { return this.configurations.baseUrl + this.removeByIdURL; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getAlldepriciationMethod<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAlldepriciationMethod());
            });
    }

    getdepriciationMethodById<T>(assetDepreciationMethodId: number): Observable<T> {
        let endpointUrl = `${this.getById}/${assetDepreciationMethodId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getdepriciationMethodById(assetDepreciationMethodId));
            });
    }

    adddepriciationMethod<T>(depriciationMethod: DepriciationMethod): Observable<T> {
        let endpointUrl = this.add;

        return this.http.post<T>(endpointUrl, JSON.stringify(depriciationMethod), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.adddepriciationMethod(depriciationMethod));
            });
    }

    updatedepriciationMethod<T>(depriciationMethod: DepriciationMethod): Observable<T> {
        let endpointUrl = this.update;

        return this.http.post<T>(endpointUrl, JSON.stringify(depriciationMethod), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updatedepriciationMethod(depriciationMethod));
            });
    }

    removedepriciationMethodById<T>(assetDepreciationMethodId: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${assetDepreciationMethodId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.removedepriciationMethodById(assetDepreciationMethodId));
            });
    }

    getAssetDepreciationAudits<T>(assetDepreciationMethodId: number): Observable<T> {
        let endpointUrl = `${this.audits}/${assetDepreciationMethodId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAssetDepreciationAudits(assetDepreciationMethodId));
            });
    }

    DepMethodCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

    }

}