
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class JobTypeEndpontService extends EndpointFactory {


    private readonly _JobTypeUrlNew: string = "/api/JobType/jobTypepost";
    private readonly _JobTypeUrl: string = "/api/JobType/Get";
    private readonly getJobTypeDataAuditById: string = "/api/JobType/audits";

    get jobtypeurl() { return this.configurations.baseUrl + this._JobTypeUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

 

    getJobtypeEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.jobtypeurl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getJobtypeEndpoint());
            });
    }

    addNewJobtype<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._JobTypeUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getJobtypeEndpoint());
            });
    }

    updateJobType<T>(userObject: any, actionId: number): Observable<T> {
       // let endpointUrl = actionId ? `${this._JobTypeUrlNew}/${actionId}` : this._JobTypeUrlNew;
        let endpointUrl = `${this._JobTypeUrlNew}/${actionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.updateJobType(userObject, actionId));
            });
    }

    getDeleteJobTypeEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._JobTypeUrlNew}/${actionId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteJobTypeEndpoint(actionId));
            });
    }

    getJobTypeAuditById<T>(jobTypeId: number): Observable<T> {
        let endpointUrl = `${this.getJobTypeDataAuditById}/${jobTypeId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getJobTypeAuditById(jobTypeId));
            });
    }


  
}