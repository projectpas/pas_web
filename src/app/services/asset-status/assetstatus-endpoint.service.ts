// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { AssetStatus } from '../../models/asset-status.model';
import {catchError} from 'rxjs/operators';
@Injectable()
export class AssetStatusEndpointService extends EndpointFactory {

    private readonly getAllURL: string = "/api/assetstatus/getAll";
    private readonly getByIdURL: string = "/api/assetstatus/getById";
    private readonly addURL: string = "/api/assetstatus/add";
    private readonly updateURL: string = "/api/assetstatus/update";
    private readonly removeByIdURL: string = "/api/assetstatus/removeById";
    private readonly updateForActive: string = "/api/assetstatus/updateActive";
    private readonly getAssetAuditById: string = "/api/assetstatus/assetstatusauditdetails";
    private readonly excelUpload: string = "/api/assetstatus/UploadAssetStatusCustomData";


    get getAll() { return this.configurations.baseUrl + this.getAllURL; }
    get getById() { return this.configurations.baseUrl + this.getByIdURL; }
    get add() { return this.configurations.baseUrl + this.addURL; }
    get update() { return this.configurations.baseUrl + this.updateURL; }
    get removeById() { return this.configurations.baseUrl + this.removeByIdURL; }
    
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getAllAssets<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllAssets());
            }));
    }

    getAssetById<T>(assetId: number): Observable<T> {
        let endpointUrl = `${this.getById}/${assetId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAssetById(assetId));
            }));
    }

    addAsset<T>(asset: AssetStatus): Observable<T> {
        let endpointUrl = this.add;

        return this.http.post<any>(endpointUrl, JSON.stringify(asset), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addAsset(asset));
            }));
    }

    updateAsset<T>(assetStatus: AssetStatus): Observable<T> {
        let endpointUrl = this.update;

        return this.http.post<any>(endpointUrl, JSON.stringify(assetStatus), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.updateAsset(assetStatus));
            }));
    }

    removeAssetById<T>(assetId: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${assetId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.removeAssetById(assetId));
            }));
    }

    getUpdateForActive<T>(roleObject: any, id: number): Observable<T> {
        let endpointUrl = `${this.updateForActive}/${id}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateForActive(roleObject, id));
            }));
    }

    getAssetStatusAuditById<T>(assetId: number): Observable<T> {
        let endpointUrl = `${this.getAssetAuditById}/${assetId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAssetStatusAuditById(assetId));
            }));
    }

    AssetStatusCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)


    }
    
}