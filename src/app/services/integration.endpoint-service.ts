
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

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

        return this.http.get<T>(this.integrationUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getIntegrationEndpoint());
            });
    }

    getAllIntegrationEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.integrationAllUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllIntegrationEndpoint());
            });
    }
    getIntegrationLiteEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this._integrationLiteUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getIntegrationLiteEndpoint());
            });
    }

    getNewActionEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._integrationPostUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewActionEndpoint(userObject));
            });
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._integrationPostUrl}/${actionId}` : this._integrationPostUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            });
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._integrationPostUrl}/${actionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            });
    }

    getDeleteActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._integrationPostUrl}/${actionId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId));
            });
	}


	getHistoryintegrationEndpoint<T>(actionId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlNewAuditHistory}/${actionId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getHistoryintegrationEndpoint(actionId));
			});
    }

    getAuditById<T>(integrationPortalId: number): Observable<T> {
        let endpointUrl = `${this._getAuditById}/${integrationPortalId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAuditById(integrationPortalId));
            });
    }

    IntegrationCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

    }

}