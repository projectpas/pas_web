
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class JobTitleEndpontService extends EndpointFactory {


    private readonly _JobTilesUrl: string = "/api/JobTitle/Get";
  
    
    private readonly _JobTilesUrlNew: string = "/api/JobTitle/jobTitlepost";
    private readonly _JobTilesUrlAuditHistory: string = "/api/JobTitle/auditHistoryById";
    private readonly getJobTitleDataAuditById: string = "/api/JobTitle/audits";

    get jobtitleurl() { return this.configurations.baseUrl + this._JobTilesUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getJobtitleEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.jobtitleurl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getJobtitleEndpoint());
            });
    }

    getNewjobtitleEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._JobTilesUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewjobtitleEndpoint(userObject));
            });
    }

    getEditJobTitleEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._JobTilesUrlNew}/${actionId}` : this._JobTilesUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getEditJobTitleEndpoint(actionId));
            });
    }

    getUpdateJobtitleEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._JobTilesUrlNew}/${actionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getUpdateJobtitleEndpoint(roleObject, actionId));
            });
    }

    getDeleteJobTitleEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._JobTilesUrlNew}/${actionId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getDeleteJobTitleEndpoint(actionId));
            });
    }

	getHistoryJobTitleEndpoint<T>(jobTitleId: number): Observable<T> {
		let endpointUrl = `${this._JobTilesUrlAuditHistory}/${jobTitleId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleErrorCommon(error, () => this.getHistoryJobTitleEndpoint(jobTitleId));
			});
    }
    
    getJobTitleAuditById<T>(jobTitleId: number): Observable<T> {
        let endpointUrl = `${this.getJobTitleDataAuditById}/${jobTitleId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getJobTitleAuditById(jobTitleId));
            });
    }
}