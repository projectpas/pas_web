import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { DepreciationIntervals } from '../../models/depriciationIntervals.model';
import {catchError} from 'rxjs/operators'
@Injectable()
export class DepreciationIntervalsEndpoint extends EndpointFactory {

    //private readonly getAllURL: string = "/api/DepreciationIntervals/getAll";
    //private readonly getByIdURL: string = "/api/DepreciationIntervals/getById";
    //private readonly addURL: string = "/api/DepreciationIntervals/add";
    //private readonly updateURL: string = "/api/DepreciationIntervals/update";
    //private readonly removeByIdURL: string = "/api/DepreciationIntervals/removeById";
    //private readonly getIntervalsHistById: string = "/api/DepreciationIntervals/audits";

    private readonly getAllURL: string = "/api/AssetDepreciationInterval/getAll";
    private readonly getByIdURL: string = "/api/AssetDepreciationInterval/getById";
    private readonly addURL: string = "/api/AssetDepreciationInterval/add";
    private readonly updateURL: string = "/api/AssetDepreciationInterval/update";
    private readonly removeByIdURL: string = "/api/AssetDepreciationInterval/remove";
    private readonly getIntervalsHistById: string = "/api/AssetDepreciationInterval/depreciationintervalauditdetails";
    private readonly excelUpload: string = "/api/AssetDepreciationInterval/UploadDepIntervalCustomData";


    get getAll() { return this.configurations.baseUrl + this.getAllURL; }
    get getById() { return this.configurations.baseUrl + this.getByIdURL; }
    get add() { return this.configurations.baseUrl + this.addURL; }
    get update() { return this.configurations.baseUrl + this.updateURL; }
    get removeById() { return this.configurations.baseUrl + this.removeByIdURL; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getAlldepreciationIntervals<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAlldepreciationIntervals());
            }));
    }

    getdepreciationIntervalById<T>(assetDepreciationIntervalTypeId: number): Observable<T> {
        let endpointUrl = `${this.getById}/${assetDepreciationIntervalTypeId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getdepreciationIntervalById(assetDepreciationIntervalTypeId));
            }));
    }

    adddepreciationInterval<T>(depreciationInterval: DepreciationIntervals): Observable<T> {
        let endpointUrl = this.add;

        return this.http.post<any>(endpointUrl, JSON.stringify(depreciationInterval), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.adddepreciationInterval(depreciationInterval));
            }));
    }

    updatedepreciationInterval<T>(depreciationIntervalStatus: DepreciationIntervals): Observable<T> {
        let endpointUrl = this.update;

        return this.http.post<any>(endpointUrl, JSON.stringify(depreciationIntervalStatus), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updatedepreciationInterval(depreciationIntervalStatus));
            }));
    }

    removedepreciationIntervalById<T>(assetDepreciationIntervalTypeId: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${assetDepreciationIntervalTypeId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.removedepreciationIntervalById(assetDepreciationIntervalTypeId));
            }));
    }

    getAudit<T>(assetDepreciationIntervalId: number): Observable<T> {
        let endpointUrl = `${this.getIntervalsHistById}/${assetDepreciationIntervalId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAudit(assetDepreciationIntervalId));
            }));
    }

    DepIntervalCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)


    }

}