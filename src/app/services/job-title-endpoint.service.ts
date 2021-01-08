
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import {catchError} from 'rxjs/operators';
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

        return this.http.get<any>(this.jobtitleurl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getJobtitleEndpoint());
            }));
    }

    getNewjobtitleEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<any>(this._JobTilesUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getNewjobtitleEndpoint(userObject));
            }));
    }

    getEditJobTitleEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._JobTilesUrlNew}/${actionId}` : this._JobTilesUrlNew;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getEditJobTitleEndpoint(actionId));
            }));
    }

    getUpdateJobtitleEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._JobTilesUrlNew}/${actionId}`;

        return this.http.put<any>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getUpdateJobtitleEndpoint(roleObject, actionId));
            }));
    }

    getDeleteJobTitleEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._JobTilesUrlNew}/${actionId}`;

        return this.http.delete<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getDeleteJobTitleEndpoint(actionId));
            }));
    }

	getHistoryJobTitleEndpoint<T>(jobTitleId: number): Observable<T> {
		let endpointUrl = `${this._JobTilesUrlAuditHistory}/${jobTitleId}`;

		return this.http.get<any>(endpointUrl, this.getRequestHeaders())
			.pipe(catchError(error => {
				return this.handleError(error, () => this.getHistoryJobTitleEndpoint(jobTitleId));
			}));
    }
    
    getJobTitleAuditById<T>(jobTitleId: number): Observable<T> {
        let endpointUrl = `${this.getJobTitleDataAuditById}/${jobTitleId}`;

        return this.http.get<any>(endpointUrl, this.getRequestHeaders())
            .pipe(catchError(error => {
                return this.handleError(error, () => this.getJobTitleAuditById(jobTitleId));
            }));
    }
}