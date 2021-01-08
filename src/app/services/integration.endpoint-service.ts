
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
@Injectable()
export class IntegrationEndpointService extends EndpointFactory {


    private readonly _integrationUrl: string = "/api/Integration/Get";
    private readonly _integrationUrlAll: string = "/api/Integration/GetAll";

    
    private readonly _integrationLiteUrl:string="/api/Integration/basic";
	private readonly _integrationPostUrl: string = "/api/Integration/IntegrationPost";
    private readonly _getAuditById: string = "/api/Integration/audits";

    private readonly _actionsUrlNewAuditHistory: string = "/api/Integration/auditHistoryById";
    private readonly excelUpload: string = "/api/Integration/UploadIntegrationCustomData";
    get integrationUrl() { return this.configurations.baseUrl + this._integrationUrl; }
    get integrationAllUrl() { return this.configurations.baseUrl + this._integrationUrlAll; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getIntegrationEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.integrationUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getIntegrationEndpoint());
            }));
    }

    getAllIntegrationEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this.integrationAllUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAllIntegrationEndpoint());
            }));
    }
    getIntegrationLiteEndpoint<T>(): Observable<T> {

        return this.http.get<any>(this._integrationLiteUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getIntegrationLiteEndpoint());
            }));
    }

    getNewActionEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._integrationPostUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewActionEndpoint(userObject));
            }));
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._integrationPostUrl}/${actionId}` : this._integrationPostUrl;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            }));
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._integrationPostUrl}/${actionId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            }));
    }

    getDeleteActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._integrationPostUrl}/${actionId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId));
            }));
	}


	getHistoryintegrationEndpoint<T>(actionId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlNewAuditHistory}/${actionId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getHistoryintegrationEndpoint(actionId));
			}));
    }

    getAuditById<T>(integrationPortalId: number): Observable<T> {
        let endpointUrl = `${this._getAuditById}/${integrationPortalId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getAuditById(integrationPortalId));
            }));
    }

    IntegrationCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

    }

}