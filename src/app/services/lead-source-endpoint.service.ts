
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class LeadSourceEndpointService extends EndpointFactory {


    private readonly _leadSourceUrl: string = "/api/LeadSource/Get";
    private readonly _leadSourceUrlAll: string = "/api/LeadSource/GetAll";

    
    private readonly _leadSourceLiteUrl:string="/api/LeadSource/basic";
	private readonly _leadSourcePostUrl: string = "/api/LeadSource/LeadSourcePost";
    private readonly _getAuditById: string = "/api/LeadSource/audits";

    private readonly _actionsUrlNewAuditHistory: string = "/api/LeadSource/auditHistoryById";
    private readonly excelUpload: string = "/api/LeadSource/UploadLeadSourceCustomData";
    get LeadSourceUrl() { return this.configurations.baseUrl + this._leadSourceUrl; }
    get LeadSourceAllUrl() { return this.configurations.baseUrl + this._leadSourceUrlAll; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getLeadSourceEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.LeadSourceUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLeadSourceEndpoint());
            });
    }

    getAllLeadSourceEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.LeadSourceAllUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllLeadSourceEndpoint());
            });
    }
    getLeadSourceLiteEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this._leadSourceLiteUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLeadSourceLiteEndpoint());
            });
    }

    getNewActionEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._leadSourcePostUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewActionEndpoint(userObject));
            });
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._leadSourcePostUrl}/${actionId}` : this._leadSourcePostUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            });
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._leadSourcePostUrl}/${actionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            });
    }

    getDeleteActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._leadSourcePostUrl}/${actionId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId));
            });
	}


	getHistoryLeadSourceEndpoint<T>(actionId: number): Observable<T> {
		let endpointUrl = `${this._actionsUrlNewAuditHistory}/${actionId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getHistoryLeadSourceEndpoint(actionId));
			});
    }

    getAuditById<T>(LeadSourcePortalId: number): Observable<T> {
        let endpointUrl = `${this._getAuditById}/${LeadSourcePortalId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAuditById(LeadSourcePortalId));
            });
    }

    LeadSourceCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)

    }

}