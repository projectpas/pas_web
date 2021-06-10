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
    private readonly _RestoreLaborOHSettings: string = '/api/LaborOHSettings/RestoreLaborOHSettings';
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
                return this.handleErrorCommon(error, () => this.getLaborAndOverheadCostEndpoint());
            });
    }
    getNewLaborAndOverheadCostEndpoint<T>(userObject: any): Observable<T> {
        let url = this.configurations.baseUrl + this._laborandoverheadcostUrlNew;
        return this.http.post<T>(url, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewLaborAndOverheadCostEndpoint(userObject));
            });
    }
    getEditLaborAndOverheadCostEndpoint<T>(LaborOverloadCostId?: number): Observable<T> {
        let endpointUrl = LaborOverloadCostId ? `${this._laborandoverheadcostUrlNew}/${LaborOverloadCostId}` : this._laborandoverheadcostUrlNew;
        endpointUrl = this.configurations.baseUrl + endpointUrl
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getEditLaborAndOverheadCostEndpoint(LaborOverloadCostId));
            });
    }
    getUpdateLaborAndOverheadCostEndpoint<T>(roleObject: any, LaborOverloadCostId: number): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/${this._laborandoverheadcostUrlNew}/${LaborOverloadCostId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getUpdateLaborAndOverheadCostEndpoint(roleObject, LaborOverloadCostId));
            });
    }
    getDeleteLaborAndOverheadCostEndpoint<T>(LaborOverloadCostId: number): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/${this._laborandoverheadcostUrlNew}/${LaborOverloadCostId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getDeleteLaborAndOverheadCostEndpoint(LaborOverloadCostId));
            });
    }
    getHistoryLaborandOverheadCostEndpoint<T>(LaborOverloadCostId: number): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/${this._laborandoverheadcostUrlAuditHistory}/${LaborOverloadCostId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getHistoryLaborandOverheadCostEndpoint(LaborOverloadCostId));
            });
    }
    getHistoryLaborandOverheadCostAuditDetails<T>(Id: number): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/${this._auditUrl}/${Id}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getHistoryLaborandOverheadCostAuditDetails(Id));
            });
    }

    // Direct LaborOHSettings APIs
    getLaborOHSettings<T>(isDeleted: boolean,isActive: boolean,masterCompanyId :number): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/${this._laborOHSettingsUrl}?isDeleted=${isDeleted}&isActive=${isActive}&masterCompanyId=${masterCompanyId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getLaborOHSettings(isDeleted,isActive,masterCompanyId));
            });
    }
    createLaborOHSettings<T>(userObject: any): Observable<T> {
        let url = this.configurations.baseUrl + this._createLaborOHSettingsUrl;
        return this.http.post<T>(url, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.createLaborOHSettings(userObject));
            });
    }
    updateLaborOHSettings<T>(userObject: any): Observable<T> {

        let endpointUrl = `${this.configurations.baseUrl}/${this._createLaborOHSettingsUrl}/${userObject.laborOHSettingsId}`;
        return this.http.put<T>(endpointUrl, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.updateLaborOHSettings(userObject));
            });
    }
    getLaborOHSettingsById<T>(id): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/${this._getLaborOHSettingsByIdUrl}/${id}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getLaborOHSettingsById(id));
            });
    }
    getLaborOHSettingsStatus<T>(id, status, updatedBy): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/${this._getLaborOHSettingsStatusUrl}?id=${id}&status=${status}&updatedBy=${updatedBy}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getLaborOHSettingsStatus(id, status, updatedBy));
            });
    }
    deleteLaborOHSettings<T>(id: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/${this._createLaborOHSettingsUrl}/${id}?updatedBy=${updatedBy}`;
        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.deleteLaborOHSettings(id, updatedBy));
            });
    }

    restoreLaborOHSettings<T>(id: number, updatedBy: string): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/${this._RestoreLaborOHSettings}/${id}?updatedBy=${updatedBy}`;
        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.restoreLaborOHSettings(id, updatedBy));
            });
    }
    getLaborOHSettingsAuditById<T>(id): Observable<T> {
        let endpointUrl = `${this.configurations.baseUrl}/${this._getLaborOHSettingsAuditUrl}?laborOHSettingsId=${id}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getLaborOHSettingsAuditById(id));
            });
    }

}
