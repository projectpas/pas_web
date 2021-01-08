
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { Itemgroup } from '../models/item-group.model';

@Injectable()
export class ItemgroupEndpointService extends EndpointFactory {


    private readonly _itemgroupGetUrl: string = "/api/Itemgroup/Get";
    private readonly _itemgroupUrlNew: string = "/api/Itemgroup/Itemgrouppost";
    private readonly _actionsUrlAuditHistory: string = "/api/Itemgroup/auditHistoryById";
    private readonly getItemGroupAuditDataById: string = "/api/Itemgroup/audits";
    private readonly getItemGroup: string = "/api/Itemgroup/pagination";
    private readonly excelUpload: string = "/api/Itemgroup/UploadItemGroupCustomData";

    get paginate() { return this.configurations.baseUrl + this.getItemGroup; }

    get getitemgroupUrl() { return this.configurations.baseUrl + this._itemgroupGetUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getItemgroupEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.getitemgroupUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItemgroupEndpoint());
            });
    }

    getNewItemgroupEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._itemgroupUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewItemgroupEndpoint(userObject));
            });
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._itemgroupUrlNew}/${actionId}` : this._itemgroupUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            });
    }

    getUpdateActionEndpoint<T>(roleObject: Itemgroup, actionId): Observable<T> {
        let endpointUrl = `${this._itemgroupUrlNew}/${actionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(actionId, roleObject));
            });
    }

    getDeleteActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._itemgroupUrlNew}/${actionId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId));
            });
    }

    getHistoryActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${actionId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryActionEndpoint(actionId));
            });
    }
    
    getItemGroupAuditById<T>(itemGroupId: number): Observable<T> {
        let endpointUrl = `${this.getItemGroupAuditDataById}/${itemGroupId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItemGroupAuditById(itemGroupId));
            });
    }
    getItemGroupPagination<T>(pageSearch: any): Observable<T> {
        let endpointUrl = this.paginate;
        //let endpointUrl = `${this.getPaginationData}/${data}`;
        return this.http.post<T>(endpointUrl, JSON.stringify(pageSearch), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getItemGroupPagination(pageSearch));
            });
    }
    ItemGroupCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

    }
}