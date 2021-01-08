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
import { AssetAcquisitionType } from '../../models/asset-acquisition-type.model';

@Injectable()
export class AssetAcquisitionTypeEndpointService extends EndpointFactory {

    private readonly getAllURL: string = "/api/assetacquisition/getAll";
    private readonly getByIdURL: string = "/api/assetacquisition/getById";
    private readonly addURL: string = "/api/assetacquisition/add";
    private readonly updateURL: string = "/api/assetacquisition/update";
    private readonly removeByIdURL: string = "/api/assetacquisition/removeById";
    private readonly updateForActive: string = "/api/assetacquisition/updateActive";
    private readonly getAssetAuditById: string = "/api/assetacquisition/audits";
    private readonly excelUpload: string = "/api/assetacquisition/UploadAssetAcquisitionTypeCustomData";


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

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllAssets());
            });
    }

    getAssetById<T>(assetId: number): Observable<T> {
        let endpointUrl = `${this.getById}/${assetId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAssetById(assetId));
            });
    }

    addAsset<T>(asset: AssetAcquisitionType): Observable<T> {
        let endpointUrl = this.add;

        return this.http.post<T>(endpointUrl, JSON.stringify(asset), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.addAsset(asset));
            });
    }

    updateAsset<T>(AssetAcquisitionType: AssetAcquisitionType): Observable<T> {
        let endpointUrl = this.update;

        return this.http.post<T>(endpointUrl, JSON.stringify(AssetAcquisitionType), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.updateAsset(AssetAcquisitionType));
            });
    }

    removeAssetById<T>(assetId: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${assetId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.removeAssetById(assetId));
            });
    }

    getUpdateForActive<T>(roleObject: any, id: number): Observable<T> {
        let endpointUrl = `${this.updateForActive}/${id}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateForActive(roleObject, id));
            });
    }

    getAssetAcquisitionTypeAuditById<T>(assetId: number): Observable<T> {
        let endpointUrl = `${this.getAssetAuditById}/${assetId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAssetAcquisitionTypeAuditById(assetId));
            });
    }

    AssetAcquisitionTypeCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)


    }
    
}