import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class publicationTypeEndpointService extends EndpointFactory {


    private readonly _documentTypeUrl: string = "/api/PublicationType/publicationtypeslist";
    private readonly _documentTypeUrlAll: string = "/api/PublicationType/publicationtypeslist";
    private readonly _getdocumenttypebyid: string = "/api/PublicationType/publicationtypebyid";
    private readonly _documenttypestatus: string = "/api/PublicationType/publicationtypestatus";
    private readonly excelUpload: string = "/api/PublicationType/uploadpublicationtypecustomdata";
    private readonly _documentTypeUpdateUrl: string = "/api/PublicationType/updatepublicationtype";
    private readonly _documentTypeDeleteUrl: string = "/api/PublicationType/deletepublicationtype";


    private readonly _documentTypeLiteUrl: string = "/api/PublicationType/basic";
    private readonly _documentTypePostUrl: string = "/api/PublicationType/createpublicationtype";
    //private readonly _getAuditById: string = "/api/PublicationType/publicationtypehistory";

    private readonly _actionsUrlNewAuditHistory: string = "/api/PublicationType/publicationtypehistory";

    get DocumentTypeUrl() { return this.configurations.baseUrl + this._documentTypeUrl; }
    get DocumentTypeAllUrl() { return this.configurations.baseUrl + this._documentTypeUrlAll; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getDocumentTypeEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.DocumentTypeUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDocumentTypeEndpoint());
            }));
    }

    getAllDocumentTypeEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.DocumentTypeUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllDocumentTypeEndpoint());
            }));
    }
    getDocumentTypeLiteEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this._documentTypeLiteUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDocumentTypeLiteEndpoint());
            }));
    }

    getNewActionEndpoint<T>(userObject: any): Observable<T> {

        alert(JSON.stringify(userObject));
        return this.http.post<any>(this._documentTypePostUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewActionEndpoint(userObject));
            }));
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._documentTypePostUrl}/${actionId}` : this._documentTypePostUrl;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            }));
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._documentTypeUpdateUrl}/${actionId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            }));
    }

    getDeleteActionEndpoint<T>(actionId: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this._documentTypeDeleteUrl}/${actionId}?updatedBy=${updatedBy}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId, updatedBy));
            }));
    }


    getHistoryDocumentTypeEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNewAuditHistory}/${actionId}`;
        alert(JSON.stringify(actionId));
        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistoryDocumentTypeEndpoint(actionId));
            }));
    }

    //getAuditById<T>(DocumentTypePortalId: number): Observable<T> {
    //    let endpointUrl = `${this._getAuditById}/${DocumentTypePortalId}`;

    //    return this.http.get<T>(endpointUrl, this.getRequestHeaders())
    //        .catch(error => {
    //            return this.handleError(error, () => this.getAuditById(DocumentTypePortalId));
    //        });
    //}

    DocumentTypeCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

    }

}