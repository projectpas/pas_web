
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class UnitOfMeasureEndpoint extends EndpointFactory {


    private readonly _actionsUrl: string = "/api/UnitOfMeasure/Get";
    private readonly _actionsUrlNew: string = "/api/UnitOfMeasure/unitofmeasure";
    private readonly _actionsUrlAuditHistory: string = "/api/UnitOfMeasure/auditHistoryById";
    private readonly _auditsUrl: string = "/api/UnitOfMeasure/unitofmeasureauditdetails";
    private readonly _actionUrlAll: string = "/api/UnitOfMeasure/getAll"
    private readonly getUnitOfMeasure: string = "/api/UnitOfMeasure/pagination";
    private readonly excelUpload: string ="/api/UnitofMeasure/uploaduomcustomdata";
    private readonly sampleExcelFormat: string = "/api/FileUpload/downloadsamplefile?moduleName=UnitOfMeasure&fileName=uom.xlsx"

    get actionsUrl() { return this.configurations.baseUrl + this._actionsUrl; }
    get paginate() { return this.configurations.baseUrl + this.getUnitOfMeasure; }
    constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

        super(http, configurations, injector);
    }

    getUnitOfMeasureEndpoint<T>(): Observable<T> {

        return this.http.get<T>(this.actionsUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUnitOfMeasureEndpoint());
            });
    }
    getAllUnitOfMeasureEndpoint<T>(): Observable<T> {
        return this.http.get<T>(this._actionUrlAll, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getAllUnitOfMeasureEndpoint());
            });
    }
    getNewUnitOfMeasureEndpoint<T>(userObject: any): Observable<T> {

        return this.http.post<T>(this._actionsUrlNew, JSON.stringify(userObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getNewUnitOfMeasureEndpoint(userObject));
            });
    }

    getHistoryUnitOfMeasureEndpoint<T>(unitofmeasureId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlAuditHistory}/${unitofmeasureId}`;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getHistoryUnitOfMeasureEndpoint(unitofmeasureId));
            });
    }

    getEditUnitOfMeasureEndpoint<T>(unitofmeasureId?: number): Observable<T> {
        let endpointUrl = unitofmeasureId ? `${this._actionsUrlNew}/${unitofmeasureId}` : this._actionsUrlNew;

        return this.http.get<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getEditUnitOfMeasureEndpoint(unitofmeasureId));
            });
    }

    getUpdateUnitOfMeasureEndpoint<T>(roleObject: any, unitofmeasureId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${unitofmeasureId}`;

        return this.http.put<T>(endpointUrl, JSON.stringify(roleObject), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUpdateUnitOfMeasureEndpoint(roleObject, unitofmeasureId));
            });
    }

    getDeleteUnitOfMeasureEndpoint<T>(unitofmeasureId: number): Observable<T> {
        let endpointUrl = `${this._actionsUrlNew}/${unitofmeasureId}`;

        return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getDeleteUnitOfMeasureEndpoint(unitofmeasureId));
            });
    }

    getUnitOfWorkAuditDetails<T>(Id: number): Observable<T> {
        let endPointUrl = `${this._auditsUrl}/${Id}`;

        return this.http.get<T>(endPointUrl, this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUnitOfWorkAuditDetails(Id));
            });
    }

    getUnitOfMeasurePages<T>(paginationOption: any): Observable<T> {
        let endpointUrl = this.paginate;
        //let endpointUrl = `${this.getPaginationData}/${data}`;
        return this.http.post<T>(endpointUrl, JSON.stringify(paginationOption), this.getRequestHeaders())
            .catch(error => {
                return this.handleError(error, () => this.getUnitOfMeasurePages(paginationOption));
            });
    }

    UOMCustomUpload(file){
        return this.http.post( `${this.configurations.baseUrl}${this.excelUpload}`, file)
        
        
    }

    // sampleExcelDownload(){
    //     return this.http.get(  `${this.configurations.baseUrl}${this.sampleExcelFormat}`)
    // }


}


