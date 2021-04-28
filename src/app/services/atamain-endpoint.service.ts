
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { environment } from '../../../src/environments/environment';

@Injectable()
export class ATAMainEndpoint extends EndpointFactory {

    private readonly _actionsUrl: string = "/api/ATAMain/Get";
    private readonly _actionsUrlNew: string = "/api/ATAMain/actions";
	private readonly _actionsUrlAuditHistory: string = "/api/ATAMain/ataauditHistoryById";
    private readonly getAtaChapterDataAuditById: string = "/api/ATAMain/audits";
    private readonly getATAUrl: string = "/api/ATAMain/GetATASUBS_BY_ATAMain_ID";
    private readonly getMultiATAUrl: string = environment.baseUrl + "/api/ATAMain/GetMultiATASUBSBYATAMainID";
    private readonly deleteATAURL: string = "/api/ATAMain/deleteATAMAIN";
    private readonly excelUpload: string = "/api/ATAMain/UploadataChapterCustomData";
    private readonly _actionsUrlAll: string = "/api/ATAMain/GetAll";
    private readonly getMultiAircraftUrl: string = "/api/Aircraft/GetMultiAirCraftModelByAircraftID";
    
    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }
    get actionsUrlAll() { return this.configurations.baseUrl + this._actionsUrlAll; }

    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getATAMainEndpoint<T>(id?): Observable<T> {
        let endpointUrl = `${this.actionsUrl}/${id !== undefined ? id : 1}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getATAMainEndpoint(id));
            });
    }

    getAllATAMainEndpoint<T>(): Observable<T> {
        return this.http.get<T>(this.actionsUrlAll, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAllATAMainEndpoint());
        });
    }

    getNewATAMainEndpoint<T>(userObject: any): Observable<T> {
        return this.http.post<T>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getNewATAMainEndpoint(userObject));
        });
    }
    
    getHistoryATAMainEndpoint<T>(ataChapterId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${ataChapterId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getHistoryATAMainEndpoint(ataChapterId));
        });
    }

    getEditATAMainEndpoint<T>(ataChapterId?: number): Observable<T> {
        let endpointUrl = ataChapterId ? `${this._actionsUrlNew}/${ataChapterId}` : this._actionsUrlNew;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getEditATAMainEndpoint(ataChapterId));
        });
    }

    getUpdateATAMainEndpoint<T>(roleObject: any, ataChapterId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${ataChapterId}`;
        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getUpdateATAMainEndpoint(roleObject, ataChapterId));
        });
    }

    getDeleteATAMainEndpoint<T>(ataChapterId: number): Observable<T> {
        let endpointUrl = `${this.deleteATAURL}/${ataChapterId}`;
        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getDeleteATAMainEndpoint(ataChapterId));
        });
    }
    
    getAtaChapterAuditById<T>(ataChapterId: number): Observable<T> {
        let endpointUrl = `${this.getAtaChapterDataAuditById}/${ataChapterId}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getAtaChapterAuditById(ataChapterId));
        });
    }

    getATASubByID<T>(Chid: number): Observable<T> {
        let endpointUrl = `${this.getATAUrl}/${Chid}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getATASubByID(Chid));
        });
    }

    getMultiATASubByID<T>(Chapterids: string): Observable<T> {
        let endpointUrl = `${this.getMultiATAUrl}/${Chapterids}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getMultiATASubByID(Chapterids));
        });
    }

    getMultiAirCraftSubDesc<T>(AircraftTypeids: string): Observable<T> {
        let endpointUrl = `${this.getMultiAircraftUrl}/${AircraftTypeids}`;
        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleErrorCommon(error, () => this.getMultiAirCraftSubDesc(AircraftTypeids));
        });
    }
    
    ataChapterCustomUpload(file) {
        return this.http.post(`${this.configurations.baseUrl}${this.excelUpload}`, file)
        .catch(error => {
            return this.handleErrorCommon(error, () => this.ataChapterCustomUpload(file));
        });
    }
    
    getATAMainDropdownList(masterCompanyId?){
        let endpointUrl = `${this.configurations.baseUrl}/api/ATAMain/getdropdownlist/${masterCompanyId !== undefined ? masterCompanyId : 1}`;
        return this.http.get<any>(endpointUrl)
        .catch(error => {
            return this.handleErrorCommon(error, () => this.getATAMainDropdownList(masterCompanyId));
        });
    }
   
}