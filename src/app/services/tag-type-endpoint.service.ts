import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class TagTypeEndpointService extends EndpointFactory {


    private readonly _tagTypeUrl: string = "/api/TagType/Get";
    private readonly _tagTypeUrlAll: string = "/api/TagType/GetAllActive";


    private readonly _tagTypeLiteUrl: string = "/api/TagType/basic";
    private readonly _tagTypePostUrl: string = "/api/TagType/add";
    private readonly _getAuditById: string = "/api/TagType/audits";

    private readonly _actionsUrlNewAuditHistory: string = "/api/TagType/auditHistoryById";
    private readonly excelUpload: string = "/api/TagType/UploadTagTypeCustomData";
    private readonly _tagTypeUpdateUrl: string = "/api/TagType/update";
    private readonly _tagTypeDeleteUrl: string = "/api/TagType/remove";

    get TagTypeUrl() { return this.configurations.baseUrl + this._tagTypeUrl; }
    get TagTypeAllUrl() { return this.configurations.baseUrl + this._tagTypeUrlAll; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getTagTypeEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.TagTypeUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTagTypeEndpoint());
            });
    }

    getAllTagTypeEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.TagTypeUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllTagTypeEndpoint());
            });
    }
    getTagTypeLiteEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this._tagTypeLiteUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getTagTypeLiteEndpoint());
            });
    }

    getNewActionEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._tagTypePostUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewActionEndpoint(userObject));
            });
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._tagTypePostUrl}/${actionId}` : this._tagTypePostUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            });
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._tagTypeUpdateUrl}/${actionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            });
    }

    getDeleteActionEndpoint<T>(actionId: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this._tagTypeDeleteUrl}/${actionId}?updatedBy=${updatedBy}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId, updatedBy));
            });
    }


    getHistoryTagTypeEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNewAuditHistory}/${actionId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryTagTypeEndpoint(actionId));
            });
    }

    getAuditById<T>(TagTypePortalId: number): Observable<T> {
        let endpointUrl = `${this._getAuditById}/${TagTypePortalId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAuditById(TagTypePortalId));
            });
    }

    TagTypeCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

    }

}