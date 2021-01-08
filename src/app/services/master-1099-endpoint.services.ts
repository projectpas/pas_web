
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import{catchError} from 'rxjs/operators'

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class Master1099Endpoint extends EndpointFactory {


    private readonly _glCashFlowClassificationUrl: string = "/api/Master1099/get";
    private readonly glCashFlowClassificationsUrlsearch: string = "/api/Master1099/search"
    private readonly _glCashFlowClassificationUrlNew: string = "/api/Master1099/glcashflowpost";
    private readonly _glCashFlowClassificationsUrlAuditHistory: string = "/api/Master1099/auditHistoryById";
    private readonly _auditUrl: string = '/api/Master1099/audits';
    private readonly excelUpload: string = "/api/Master1099/uploadGlClassFlowClassificationcustomdata";
    private readonly getGlCashFlowClassification: string = "/api/Master1099/pagination";
    private readonly GlDelete: string = '/api/Master1099/glcashflowDeletepost'
    get paginate() { return this.configurations.baseUrl + this.getGlCashFlowClassification; }
    get glCashFlowClassificationsUrl() { return this.configurations.baseUrl + this._glCashFlowClassificationUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getMaster1099Endpoint<T>(): Observable<T> {

        return this.http.get<any>(this.glCashFlowClassificationsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getMaster1099Endpoint());
            }));
    }

    getMaster1099searchEndpoint<T>(paginationOption: any): Observable<T> {
        // let endpointUrl = this.searchUrl;
        return this.http.post<any>(this.glCashFlowClassificationsUrlsearch, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getMaster1099searchEndpoint(paginationOption));
            }));
    }

    getHistoryMaster1099Endpoint<T>(master1099Id: number): Observable<T> {
        let endpointUrl = `${this._glCashFlowClassificationsUrlAuditHistory}/${master1099Id}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistoryMaster1099Endpoint(master1099Id));
            }));
    }


    getNewMaster1099Endpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._glCashFlowClassificationUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewMaster1099Endpoint(userObject));
            }));
    }

    getEditMaster1099Endpoint<T>(master1099Id?: number): Observable<T> {
        let endpointUrl = master1099Id ? `${this._glCashFlowClassificationUrlNew}/${master1099Id}` : this._glCashFlowClassificationUrlNew;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditMaster1099Endpoint(master1099Id));
            }));
    }

    getUpdateMaster1099Endpoint<T>(roleObject: any, master1099Id: number): Observable<T> {
        let endpointUrl = `${this._glCashFlowClassificationUrlNew}/${master1099Id}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateMaster1099Endpoint(roleObject, master1099Id));
            }));
    }

    getDeleteMaster1099Endpoint<T>(master1099Id: number): Observable<T> {
        let endpointUrl = `${this.GlDelete}/${master1099Id}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteMaster1099Endpoint(master1099Id));
            }));
    }

    getMaster1099AuditDetails<T>(Id: number): Observable<T> {
        let endpointUrl = `${this._auditUrl}/${Id}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getMaster1099AuditDetails(Id));
            }));
    }
    getMaster1099Records<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        return this.http.post<any>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getMaster1099Records(paginationOption));
            }));
    }

    master1099FileUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

    }
}