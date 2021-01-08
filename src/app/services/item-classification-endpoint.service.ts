
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class ItemClassificationEndpointService extends EndpointFactory {


    private readonly _itemclassificationGetUrl: string = "/api/ItemClassification/Get";
    private readonly _itemclassificationUrlNew: string = "/api/ItemClassification/itemclasspost";
    private readonly _actionsUrlAuditHistory: string = "/api/ItemClassification/auditHistoryById";
    private readonly _altEquPartlist: string = "api/workorder/woaltequpartlist";
    private readonly getItemClassificationAuditById: string = "/api/ItemClassification/audits";
    private readonly getItemClassification: string = "/api/ItemClassification/pagination";
    private readonly excelUpload: string = "/api/ItemClassification/UploadItemClassCustomData";
  private readonly searchUrl: string = "/api/ItemClassification/search";

    get paginate() { return this.configurations.baseUrl + this.getItemClassification; }
    get getCodeUrl() { return this.configurations.baseUrl + this._itemclassificationGetUrl; }
 get serach() { return this.configurations.baseUrl + this.searchUrl; }
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getitemclassificationEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.getCodeUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getitemclassificationEndpoint());
            }));
    }

    getloadAltEquPartInfoData<T>(itemMasterId): Observable<T> {
        let endpointUrl = `${this._altEquPartlist}?itemMasterId=${itemMasterId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getloadAltEquPartInfoData(itemMasterId));
            }));
    }
    getNewitemclassificationEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._itemclassificationUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewitemclassificationEndpoint(userObject));
            }));
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._itemclassificationUrlNew}/${actionId}` : this._itemclassificationUrlNew;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            }));
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._itemclassificationUrlNew}/${actionId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            }));
    }

    getDeleteActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._itemclassificationUrlNew}/${actionId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId));
            }));
    }

    getHistoryActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${actionId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistoryActionEndpoint(actionId));
            }));
    }
    
    getItemClassificationDataAuditById<T>(itemClassificationId: number): Observable<T> {
        let endpointUrl = `${this.getItemClassificationAuditById}/${itemClassificationId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getItemClassificationDataAuditById(itemClassificationId));
            }));
    }
    getItemClassificationPagination<T>(pageSearch: any): Observable<T> {
        let endpointUrl = this.paginate;
        //let endpointUrl = `${this.getPaginationData}/${data}`;
        return this.http.post<any>(endpointUrl, JSON.stringify(pageSearch), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getItemClassificationPagination(pageSearch));
            }));
    } 
    ItemClassCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

    }

SearchData<T>(pageSearch: any): Observable<T> {
        let endpointUrl = this.serach;
        return this.http.post<any>(endpointUrl, JSON.stringify(pageSearch), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.SearchData(pageSearch));
            }));
    }
}