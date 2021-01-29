import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class WorkOrderSettingsEndpointService extends EndpointFactory {


    private readonly _workorderUrl: string = "/api/workorder/Get";
    private readonly _workorderUrlAll: string = "/api/workorder/getworkordersettingslist";


    private readonly _workorderLiteUrl: string =this.configurations.baseUrl+"/api/workorder/basic";
    private readonly _workorderPostUrl: string = this.configurations.baseUrl+"/api/workorder/createworkordersettings";
    private readonly _getAuditById: string =this.configurations.baseUrl+ "/api/workorder/audithistorybyid";

    private readonly _actionsUrlNewAuditHistory: string = "/api/workorder/workordersettings";
    get workorderUrl() { return this.configurations.baseUrl + this._workorderUrl; }
    get workorderAllUrl() { return this.configurations.baseUrl + this._workorderUrlAll; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getworkorderEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.workorderUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getworkorderEndpoint());
            });
    }

    getAllworkorderEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.workorderAllUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllworkorderEndpoint());
            });
    }
    getworkorderLiteEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this._workorderLiteUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getworkorderLiteEndpoint());
            });
    }

    getNewActionEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._workorderPostUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewActionEndpoint(userObject));
            });
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._workorderPostUrl}/${actionId}` : this._workorderPostUrl;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            });
    }

    //getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
    //    let endpointUrl = `${this._workorderPostUrl}/${actionId}`;

    //    return this.http.post<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
    //        .catch(error => {
    //            return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
    //        });
    //}
    getUpdateActionEndpoint<T>(userObject: any): Observable<T> {
        //  let endpointUrl = `${this._workorderPostUrl}`;

        return this.http.post<T>(this._workorderPostUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(userObject));
            });
    }

    getDeleteActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/${this._workorderPostUrl}/${actionId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId));
            });
    }

    getworkflowbyidEndpoint(companyid, actionId) {
        return this.http.get<any>(`${this.configurations.baseUrl}/api/workorder/workordersettings?masterCompanyId=${companyid}&workOrderTypeId=${actionId}`)
    }


    //  getworkflowbyidEndpoint<T>(companyid:any, actionId: number): Observable<T> {
    //      let endpointUrl = `${this._actionsUrlNewAuditHistory}/${companyid, actionId}`;

    //return this.http.get<T>(endpointUrl, this.getRequestHeaders())
    //	.catch(error => {
    //              return this.handleError(error, () => this.getworkflowbyidEndpoint(companyid,actionId));
    //	});
    //  }

    getAuditById<T>(workorderPortalId: number): Observable<T> {
        let endpointUrl = `${this._getAuditById}/${workorderPortalId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAuditById(workorderPortalId));
            });
    }


}