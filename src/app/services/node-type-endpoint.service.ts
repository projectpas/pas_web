
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class NodeTypeEndpoint extends EndpointFactory {

    
    private readonly _glCashFlowClassificationUrl: string = "/api/NodeType/get";
    private readonly glCashFlowClassificationsUrlsearch: string = "/api/NodeType/search"
    private readonly _glCashFlowClassificationUrlNew: string = "/api/NodeType/nodetypesave";
    private readonly _glCashFlowClassificationsUrlAuditHistory: string = "/api/NodeType/nodeTypeAuditHistory";
    private readonly _auditUrl: string = '/api/NodeType/audits';
    private readonly excelUpload: string = "/api/NodeType/uploadNodeTypecustomdata";
    private readonly getGlCashFlowClassification: string = "/api/NodeType/pagination";
    private readonly GlDelete: string = '/api/NodeType/nodeTypeDelete';
    private readonly _addGlAccount: string = "/api/GlAccount/add";
    get paginate() { return this.configurations.baseUrl + this.getGlCashFlowClassification; }
    get glCashFlowClassificationsUrl() { return this.configurations.baseUrl + this._glCashFlowClassificationUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector); 
    }

    getGlCashFlowClassificationEndpoint<T>(): Observable<T> {

        // return this.http.get<T>(this.glCashFlowClassificationsUrl, this.getRequestHeaders())
        //     .catch(error => {
        //         return this.handleError(error, () => this.getGlCashFlowClassificationEndpoint());
        //     });

            return this.http.get<any>(this.glCashFlowClassificationsUrl, this.getRequestHeaders()).pipe(
                catchError(error => {
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

    getUpdateGlCashFlowClassificationEndpoint<T>(roleObject: any, nodeTypeId: number): Observable<T> {
        let endpointUrl = `${this._glCashFlowClassificationUrlNew}/${nodeTypeId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateGlCashFlowClassificationEndpoint(roleObject, nodeTypeId));
            }));
    }

    getDeleteGlCashFlowClassificationEndpoint<T>(glclassflowclassificationId: number,username:any): Observable<T> {
        let endpointUrl = `${this.GlDelete}/${glclassflowclassificationId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(username), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteGlCashFlowClassificationEndpoint(glclassflowclassificationId,username));
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



    addGlAccount<T>(paginationOption: any): Observable<T> {
        // let endpointUrl = this.searchUrl;
       // alert(JSON.stringify(paginationOption));
        return this.http.post<any>(this._addGlAccount, JSON.stringify(paginationOption), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.addGlAccount(paginationOption));
            }));
    }
}