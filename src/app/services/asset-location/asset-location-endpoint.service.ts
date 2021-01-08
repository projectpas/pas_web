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
import { AssetLocation } from '../../models/asset-location.model';

@Injectable()
export class AssetLocationEndpointService extends EndpointFactory {

    private readonly getAllURL: string = "/api/assetlocation/getAll";
    private readonly getDeleted: string = "/api/assetlocation/getDeleted";
    private readonly getByIdURL: string = "/api/assetlocation/getById";
    private readonly addURL: string = "/api/assetlocation/add";
    private readonly updateURL: string = "/api/assetlocation/update";
    private readonly removeByIdURL: string = "/api/assetlocation/removeById";
    private readonly updateForActive: string = "/api/assetlocation/updateActive";
    private readonly getAssetAuditById: string = "/api/assetlocation/assetlocationauditdetails";
    private readonly excelUpload: string = "/api/assetlocation/UploadAssetLocationCustomData";


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

    getAllDeleted<T>(): Observable<T> {
        let endpointUrl = this.getDeleted;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllDeleted());
            });
    }

    getAssetById<T>(assetId: number): Observable<T> {
        let endpointUrl = `${this.getById}/${assetId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAssetById(assetId));
            });
    }

    addAsset<T>(asset: AssetLocation): Observable<T> {
        let endpointUrl = this.add;

        return this.http.post<T>(endpointUrl, JSON.stringify(asset), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.addAsset(asset));
            });
    }

    updateAsset<T>(assetLocation: AssetLocation): Observable<T> {
        let endpointUrl = this.update;

        return this.http.post<T>(endpointUrl, JSON.stringify(assetLocation), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.updateAsset(assetLocation));
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

    getAssetLocationAuditById<T>(assetId: number): Observable<T> {
        let endpointUrl = `${this.getAssetAuditById}/${assetId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAssetLocationAuditById(assetId));
            });
    }

    AssetLocationCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)


    }

    getAssetLocationsList() {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/assetlocation/getassetlocationslist`, this.getRequestHeaders());
    }
    
}