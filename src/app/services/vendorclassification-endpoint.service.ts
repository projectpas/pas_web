
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class VendorClassificationEndpoint extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/VendorClassification/Get";
    private readonly _actionsUrlNew: string = "/api/VendorClassification/vendorclassification";
    private readonly _actionsUrlAuditHistory: string = "/api/VendorClassification/auditHistoryById";
    private readonly getVendorClassificationAuditById: string = "/api/VendorClassification/audits";
    private readonly _actionUrlAll: string = "/api/VendorClassification/getAll"


    // private readonly _workflowActionsNewUrl: string = "/api/WorkflowAction/Get";
    // private readonly _actionsUrlNew: string = "/api/Action/actions";
    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getVendorClassificationEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.actionsUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getVendorClassificationEndpoint());
            }));
    }

    getActiveVendorClassificationEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.actionsUrl+"Active", this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getActiveVendorClassificationEndpoint());
            }));
    }

    getAllVendorClassificationEndpoint<T>(): Observable<T> {
        return this.http.get<any>(this._actionUrlAll, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllVendorClassificationEndpoint());
            }));
    }

    getNewVendorClassificationEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewVendorClassificationEndpoint(userObject));
            }));
    }

    getHistoryVendorClassificationEndpoint<T>(vendorclassificationId: number): Observable<T> {
        let endpointUrl = `${this.getVendorClassificationAuditById}/${vendorclassificationId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getHistoryVendorClassificationEndpoint(vendorclassificationId));
            }));
    }

    getEditVendorClassificationEndpoint<T>(vendorclassificationId?: number): Observable<T> {
        let endpointUrl = vendorclassificationId ? `${this._actionsUrlNew}/${vendorclassificationId}` : this._actionsUrlNew;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditVendorClassificationEndpoint(vendorclassificationId));
            }));
    }

    getUpdateVendorClassificationEndpoint<T>(roleObject: any, vendorclassificationId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${vendorclassificationId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateVendorClassificationEndpoint(roleObject, vendorclassificationId));
            }));
    }

    getDeleteVendorClassificationEndpoint<T>(vendorclassificationId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${vendorclassificationId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteVendorClassificationEndpoint(vendorclassificationId));
            }));
    }

    getVendorClassificationDataAuditById<T>(vendorclassificationId: number): Observable<T> {
        let endpointUrl = `${this.getVendorClassificationAuditById}/${vendorclassificationId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getVendorClassificationDataAuditById(vendorclassificationId));
            }));
    }

}


