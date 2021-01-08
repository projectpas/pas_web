import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class laborAndOverheadCostEndpointservice extends EndpointFactory {


    private readonly _laborandoverheadcostUrl: string = "/api/LaborAndOverheadCost/Get";
    private readonly _laborandoverheadcostUrlNew: string = "/api/LaborAndOverheadCost/labourpost";
    private readonly _laborandoverheadcostUrlAuditHistory: string = "/api/LaborAndOverheadCost/auditHistoryById";
    private readonly _auditUrl: string = '/api/LaborAndOverheadCost/audits';
    private readonly _laborOHSettingsUrl: string = '/api/LaborOHSettings/Get';
    private readonly _createLaborOHSettingsUrl: string = '/api/LaborOHSettings/LaborOHSettings';
    private readonly _getLaborOHSettingsByIdUrl: string = '/api/LaborOHSettings/GetLaborOHSettingsDataById';
    private readonly _getLaborOHSettingsAuditUrl: string = '/api/LaborOHSettings/GetLaborOHSettingsAuditDataById';
    private readonly _getLaborOHSettingsStatusUrl: string = '/api/LaborOHSettings/chargestatus';


    get laborandoverheadcostUrl() { return this.configurations.baseUrl + this._laborandoverheadcostUrl; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getLaborAndOverheadCostEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.laborandoverheadcostUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLaborAndOverheadCostEndpoint());
            });
    }
    getNewLaborAndOverheadCostEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._laborandoverheadcostUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewLaborAndOverheadCostEndpoint(userObject));
            });
    }

    getEditLaborAndOverheadCostEndpoint<T>(LaborOverloadCostId?: number): Observable<T> {
        let endpointUrl = LaborOverloadCostId ? `${this._laborandoverheadcostUrlNew}/${LaborOverloadCostId}` : this._laborandoverheadcostUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditLaborAndOverheadCostEndpoint(LaborOverloadCostId));
            });
    }

    getUpdateLaborAndOverheadCostEndpoint<T>(roleObject: any, LaborOverloadCostId: number): Observable<T> {
        let endpointUrl = `${this._laborandoverheadcostUrlNew}/${LaborOverloadCostId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateLaborAndOverheadCostEndpoint(roleObject, LaborOverloadCostId));
            });
    }

    getDeleteLaborAndOverheadCostEndpoint<T>(LaborOverloadCostId: number): Observable<T> {
        let endpointUrl = `${this._laborandoverheadcostUrlNew}/${LaborOverloadCostId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteLaborAndOverheadCostEndpoint(LaborOverloadCostId));
            });
    }
    getHistoryLaborandOverheadCostEndpoint<T>(LaborOverloadCostId: number): Observable<T> {
        let endpointUrl = `${this._laborandoverheadcostUrlAuditHistory}/${LaborOverloadCostId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryLaborandOverheadCostEndpoint(LaborOverloadCostId));
            });
    }

    getHistoryLaborandOverheadCostAuditDetails<T>(Id: number): Observable<T> {
        let endpointUrl = `${this._auditUrl}/${Id}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryLaborandOverheadCostAuditDetails(Id));
            });
    }

    // Direct LaborOHSettings APIs
    getLaborOHSettings<T>(): Observable<T> {
        let endpointUrl = `${this._laborOHSettingsUrl}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLaborOHSettings());
            });
    }

    createLaborOHSettings<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._createLaborOHSettingsUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.createLaborOHSettings(userObject));
            });
    }

    updateLaborOHSettings<T>(userObject: any): Observable<T> {
        let endpointUrl = `${this._createLaborOHSettingsUrl}/${userObject.laborOHSettingsId}`;
        return this.http.put<T>(endpointUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.updateLaborOHSettings(userObject));
            });
    }

    getLaborOHSettingsById<T>(id): Observable<T> {
        let endpointUrl = `${this._getLaborOHSettingsByIdUrl}/${id}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLaborOHSettingsById(id));
            });
    }

    getLaborOHSettingsStatus<T>(id, status, updatedBy): Observable<T> {
        let endpointUrl = `${this._getLaborOHSettingsStatusUrl}?id=${id}&status=${status}&updatedBy=${updatedBy}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLaborOHSettingsStatus(id, status, updatedBy));
            });
    }

    deleteLaborOHSettings<T>(id: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this._createLaborOHSettingsUrl}/${id}?updatedBy=${updatedBy}`;
        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.deleteLaborOHSettings(id, updatedBy));
            });
    }

    getLaborOHSettingsAuditById<T>(id): Observable<T> {
        let endpointUrl = `${this._getLaborOHSettingsAuditUrl}?laborOHSettingsId=${id}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getLaborOHSettingsAuditById(id));
            });
    }

}
