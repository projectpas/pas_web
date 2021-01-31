import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndpointFactory } from '../endpoint-factory.service';
import { ConfigurationService } from '../configuration.service';
import { AssetAttributeType } from '../../models/asset-attribute-type.model';

@Injectable()
export class AssetAttributeTypeEndpointService extends EndpointFactory {

    private readonly item: string = "AssetAttributeType";
    private readonly getAllItemsEndPointTemplate: string = "getAll";
    private readonly getItemByIdEndPointTemplate: string = "getById";
    private readonly getByAssetTypeIdEndPointTemplate: string = "getByAssetTypeId";
    private readonly addItemEndPointTemplate: string = "add";
    private readonly updateItemEndPointTemplate: string = "update";
    private readonly removeItemByIdEndPointTemplate: string = "removeById";
    private readonly getItemAuditByIdEndPointTemplate: string = "audit";
    private readonly bulkUploadEndPointTemplate: string = "bulkUpload";


    get getAll() { return `${this.configurations.baseUrl}/api/${this.item}/${this.getAllItemsEndPointTemplate}`; }
    get getByAssetTypeId() { return `${this.configurations.baseUrl}/api/${this.item}/${this.getByAssetTypeIdEndPointTemplate}`; }
    get getById() { return `${this.configurations.baseUrl}/api/${this.item}/${this.getItemByIdEndPointTemplate}`; }
    get add() { return `${this.configurations.baseUrl}/api/${this.item}/${this.addItemEndPointTemplate}`; }
    get update() { return `${this.configurations.baseUrl}/api/${this.item}/${this.updateItemEndPointTemplate}`; }
    get removeById() { return `${this.configurations.baseUrl}/api/${this.item}/${this.removeItemByIdEndPointTemplate}`; }
    get getAudit() { return `${this.configurations.baseUrl}/api/${this.item}/${this.getItemAuditByIdEndPointTemplate}`; }
    get bulkUpload() { return `${this.configurations.baseUrl}/api/${this.item}/${this.bulkUploadEndPointTemplate}`; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    addItem<T>(item: AssetAttributeType): Observable<T> {
        let endpointUrl = this.add;
        return this.http.post<T>(endpointUrl, JSON.stringify(item), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.addItem(item));
            });
    }

    bulkItemUpload(file: any): Observable<object> {
        return this.http.post(this.bulkUpload, file);
    }

    getAllItems<T>(): Observable<T> {
        let endpointUrl = this.getAll;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAllItems());
            });
    }

    getByAssetType<T>(id: number): Observable<T> {
        let endpointUrl = `${this.getByAssetTypeId}/${id}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getByAssetType(id));
            });
    }

    getItemAudit<T>(id: number): Observable<T> {
        let endpointUrl = `${this.getAudit}/${id}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemAudit(id));
            });
    }

    getItemById<T>(id: number): Observable<T> {
        let endpointUrl = `${this.getById}/${id}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getItemById(id));
            });
    }

    removeItemById<T>(id: number): Observable<T> {
        let endpointUrl = `${this.removeById}/${id}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.removeItemById(id));
            });
    }

    updateItem<T>(item: AssetAttributeType): Observable<T> {
        let endpointUrl = this.update;
        return this.http.post<T>(endpointUrl, JSON.stringify(item), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateItem(item));
            });
    }
}