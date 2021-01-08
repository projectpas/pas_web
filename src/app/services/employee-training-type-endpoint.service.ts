import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class EmployeeTrainingTypeEndpointService extends EndpointFactory  {
    private readonly _employeeTrainingTypeGetUrl: string = "/api/EmployeeTrainingType/Get";
    private readonly _employeeTrainingTypeUrlNew: string = "/api/EmployeeTrainingType/GetAllEmployeeTrainingTypeData";
    private readonly _actionsUrlAuditHistory: string = "/api/EmployeeTrainingType/auditHistoryById";
    private readonly _employeeTrainingTypePost: string = "/api/EmployeeTrainingType/EmployeeTrainingTypePost";
    private readonly _employeeTrainingTypeSave: string = "/api/EmployeeTrainingType/employeeTrainingTypeSave";
    private readonly _search: string = "/api/EmployeeTrainingType/search";
    private readonly _delete: string = "/api/EmployeeTrainingType/EmployeeTrainingTypeDelete";


    private readonly _getAuditById: string = "/api/EmployeeTrainingType/audits";
    private readonly excelUpload: string = "/api/EmployeeTrainingType/bulkupload";
    get employeeExpertiseUrl() { return this.configurations.baseUrl + this._employeeTrainingTypeGetUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getEmployeeExpertiseEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.employeeExpertiseUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEmployeeExpertiseEndpoint());
            });
    }

    getNewEmployeeExpertiseEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._employeeTrainingTypePost, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewEmployeeExpertiseEndpoint(userObject));
            });
    }

    getEditActionEndpoint<T>(actionId?: number): Observable<T> {
        let endpointUrl = actionId ? `${this._employeeTrainingTypeUrlNew}/${actionId}` : this._employeeTrainingTypeUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditActionEndpoint(actionId));
            });
    }

    getUpdateActionEndpoint<T>(roleObject: any, actionId: number): Observable<T> {
        let endpointUrl = `${this._employeeTrainingTypePost}/${actionId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateActionEndpoint(roleObject, actionId));
            });
    }

    getDeleteActionEndpoint<T>(actionId: number,updatedBy: string): Observable<T> {
        let endpointUrl = `${this._delete}/${actionId}?updatedBy=${updatedBy}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteActionEndpoint(actionId,updatedBy));
            });
    }
    getHistoryActionEndpoint<T>(actionId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${actionId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryActionEndpoint(actionId));
            });
    }
    getAuditById<T>(employeeExpertiseId: number): Observable<T> {
        let endpointUrl = `${this._getAuditById}/${employeeExpertiseId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAuditById(employeeExpertiseId));
            });
    }


    EmployeeExpertiseFileUploadCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)
            .catch(error => {
                return this.handleError(error, () => this.EmployeeExpertiseFileUploadCustomUpload(file));
            });

    }

    SearchData<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this._search;
        //let endpointUrl = `${this.getPaginationData}/${data}`;
        return this.http.post<T>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.SearchData(paginationOption));
            });
    }
}