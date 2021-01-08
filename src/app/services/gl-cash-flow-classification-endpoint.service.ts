
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class GlCashFlowClassificationEndpoint extends EndpointFactory {


    private readonly _glCashFlowClassificationUrl: string = "/api/GlCashFlowClassification/get";
    private readonly glCashFlowClassificationsUrlsearch: string ="/api/GlCashFlowClassification/search"
    private readonly _glCashFlowClassificationUrlNew: string = "/api/GlCashFlowClassification/glcashflowpost";
    private readonly _glCashFlowClassificationsUrlAuditHistory: string = "/api/GlCashFlowClassification/auditHistoryById";
    private readonly _auditUrl: string = '/api/GlCashFlowClassification/audits';
    private readonly excelUpload: string = "/api/GlCashFlowClassification/uploadGlClassFlowClassificationcustomdata";
    private readonly getGlCashFlowClassification: string = "/api/GlCashFlowClassification/pagination";
private readonly GlDelete : string = '/api/GlCashFlowClassification/glcashflowDeletepost'
    get paginate() { return this.configurations.baseUrl + this.getGlCashFlowClassification; }
    get glCashFlowClassificationsUrl() { return this.configurations.baseUrl + this._glCashFlowClassificationUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getGlCashFlowClassificationEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.glCashFlowClassificationsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getGlCashFlowClassificationEndpoint());
            }));
    }

    getGlCashFlowClassificationsearchEndpoint<T>(paginationOption: any): Observable<T> {
       // let endpointUrl = this.searchUrl;
        return this.http.post<any>(this.glCashFlowClassificationsUrlsearch, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getGlCashFlowClassificationsearchEndpoint(paginationOption));
            }));
    }

    getHistoryGlCashFlowClassificationEndpoint<T>(glclassflowclassificationId: number): Observable<T> {
        let endpointUrl = `${this._glCashFlowClassificationsUrlAuditHistory}/${glclassflowclassificationId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistoryGlCashFlowClassificationEndpoint(glclassflowclassificationId));
            }));
    }


    getNewGlCashFlowClassificationEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._glCashFlowClassificationUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewGlCashFlowClassificationEndpoint(userObject));
            }));
    }

    getEditGlCashFlowClassificationEndpoint<T>(glclassflowclassificationId?: number): Observable<T> {
        let endpointUrl = glclassflowclassificationId ? `${this._glCashFlowClassificationUrlNew}/${glclassflowclassificationId}` : this._glCashFlowClassificationUrlNew;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditGlCashFlowClassificationEndpoint(glclassflowclassificationId));
            }));
    }

    getUpdateGlCashFlowClassificationEndpoint<T>(roleObject: any, glclassflowclassificationId: number): Observable<T> {
        let endpointUrl = `${this._glCashFlowClassificationUrlNew}/${glclassflowclassificationId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateGlCashFlowClassificationEndpoint(roleObject, glclassflowclassificationId));
            }));
    }

    getDeleteGlCashFlowClassificationEndpoint<T>(glclassflowclassificationId: number): Observable<T> {
        let endpointUrl = `${this.GlDelete}/${glclassflowclassificationId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteGlCashFlowClassificationEndpoint(glclassflowclassificationId));
            }));
    }

    getGLCashFlowClassificationAuditDetails<T>(Id: number): Observable<T> {
        let endpointUrl = `${this._auditUrl}/${Id}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getGLCashFlowClassificationAuditDetails(Id));
            }));
    }
    getGlCashFlowClassificationRecords<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        return this.http.post<any>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getGlCashFlowClassificationRecords(paginationOption));
            }));
    }

    getGLCashFlowClassificationFileUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

    }
}