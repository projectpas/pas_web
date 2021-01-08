import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class DocumentTypeEndpointService extends EndpointFactory {


    private readonly _documentTypeUrl: string = "/api/DocumentType/Get";
    private readonly _documentTypeUrlAll: string = "/api/DocumentType/getallactive";
    private readonly _getdocumenttypebyid: string = "/api/DocumentType/getdocumenttypebyid";
    private readonly _documenttypestatus: string = "/api/DocumentType/documenttypestatus";
    private readonly excelUpload: string = "/api/DocumentType/UploadDocumentTypeCustomData";
    private readonly _documentTypeUpdateUrl: string = "/api/DocumentType/documenttypeupdate";
    private readonly _documentTypeDeleteUrl: string = "/api/DocumentType/documenttypedelete";


    private readonly _documentTypeLiteUrl: string = "/api/DocumentType/basic";
    private readonly _documentTypePostUrl: string = "/api/DocumentType/documenttypepost";
    private readonly _getAuditById: string = "/api/DocumentType/audits";

    private readonly _actionsUrlNewAuditHistory: string = "/api/DocumentType/audithistory";

    get DocumentTypeUrl() { return this.configurations.baseUrl + this._documentTypeUrl; }
    get DocumentTypeAllUrl() { return this.configurations.baseUrl + this._documentTypeUrlAll; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getDocumentTypeEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.DocumentTypeUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDocumentTypeEndpoint());
            });
    }

    getAllDocumentTypeEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.DocumentTypeUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllDocumentTypeEndpoint());
            });
    }
    getDocumentTypeLiteEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this._documentTypeLiteUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDocumentTypeLiteEndpoint());
            });
    }

    getNewActionEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._documentTypePostUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewActionEndpoint(userObject));
            });
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._documentTypePostUrl}/${actionId}` : this._documentTypePostUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            });
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._documentTypeUpdateUrl}/${actionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            });
    }

    getDeleteActionEndpoint<T>(actionId: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this._documentTypeDeleteUrl}/${actionId}?updatedBy=${updatedBy}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId, updatedBy));
            });
    }


    getHistoryDocumentTypeEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNewAuditHistory}/${actionId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryDocumentTypeEndpoint(actionId));
            });
    }

    getAuditById<T>(DocumentTypePortalId: number): Observable<T> {
        let endpointUrl = `${this._getAuditById}/${DocumentTypePortalId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAuditById(DocumentTypePortalId));
            });
    }

    DocumentTypeCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

    }

}